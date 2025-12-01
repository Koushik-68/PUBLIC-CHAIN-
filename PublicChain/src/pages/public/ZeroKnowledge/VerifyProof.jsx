import React, { useState, useRef, useEffect } from "react";
import axios from "../../../axios/api";
import Sidebar from "../../../components/Sidebar";
import jsQR from "jsqr";

export default function VerifyProof() {
  const [mode, setMode] = useState("camera"); // "camera" | "device" | "manual"
  const [rawInput, setRawInput] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // camera + image related
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);

  // ----------------- CLEANUP on unmount -----------------
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // ----------------- COMMON VERIFY FUNCTION -----------------
  const verifyPayloadString = async (payloadString) => {
    setError("");
    setResult(null);

    if (!payloadString || !payloadString.trim()) {
      setError("No QR data found.");
      return;
    }

    try {
      const parsed = JSON.parse(payloadString);

      if (!parsed.proof || !parsed.hash) {
        setError("QR data is not in expected format (missing proof or hash).");
        return;
      }

      const res = await axios.post("/api/zk/verify-proof", {
        proof: parsed.proof,
        hash: parsed.hash,
      });

      setResult(res.data);
    } catch (err) {
      console.error(err);
      if (err.name === "SyntaxError") {
        setError("QR content is not valid JSON.");
      } else {
        setError(
          err.response?.data?.message ||
            "Verification failed or proof is invalid."
        );
      }
    }
  };

  // ----------------- CAMERA MODE -----------------
  const startCamera = async () => {
    setError("");
    setResult(null);
    stopCamera(); // reset before starting again

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Camera is not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      startScanLoop();
    } catch (err) {
      console.error(err);
      setError("Unable to access camera. Please check permissions.");
    }
  };

  const startScanLoop = () => {
    if (!canvasRef.current || !videoRef.current) return;

    scanIntervalRef.current = setInterval(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || video.readyState !== 4) return;

      const width = video.videoWidth;
      const height = video.videoHeight;

      if (!width || !height) return;

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, width, height);
      const code = jsQR(imageData.data, width, height);

      if (code && code.data) {
        // QR found → stop camera and verify
        stopCamera();
        verifyPayloadString(code.data);
      }
    }, 600); // scan every 600ms
  };

  const stopCamera = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  // ----------------- DEVICE (IMAGE UPLOAD) MODE -----------------
  const handleImageUpload = (e) => {
    setError("");
    setResult(null);

    const file = e.target.files?.[0];
    if (!file) {
      setError("No file selected.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) {
          setError("Canvas not ready.");
          return;
        }
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);

        if (code && code.data) {
          verifyPayloadString(code.data);
        } else {
          setError("No QR code found in this image.");
        }
      };
      img.src = reader.result;
    };
    reader.onerror = () => {
      setError("Error reading image file.");
    };

    reader.readAsDataURL(file);
  };

  // ----------------- MANUAL MODE -----------------
  const handleManualVerify = () => {
    verifyPayloadString(rawInput);
  };

  // ----------------- UI -----------------
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar active="Zero Knowledge" />

      <div className="flex-1 p-8">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6">
          <h1 className="text-xl font-bold text-slate-800 mb-2">
            Verify Zero-Knowledge Proof (DigiLocker Demo)
          </h1>
          <p className="text-sm text-slate-500 mb-4">
            Choose how you want to verify the QR:
            <br />
            <span className="font-medium">Camera</span> to scan live, or{" "}
            <span className="font-medium">Device</span> to upload a QR image.
            Manual paste is also available.
          </p>

          {/* Mode buttons */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => {
                setMode("camera");
                setError("");
                setResult(null);
                // start camera automatically when switching to camera mode
                startCamera();
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                mode === "camera"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              Camera
            </button>
            <button
              onClick={() => {
                setMode("device");
                setError("");
                setResult(null);
                stopCamera();
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                mode === "device"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              Device
            </button>
            <button
              onClick={() => {
                setMode("manual");
                setError("");
                setResult(null);
                stopCamera();
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                mode === "manual"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              Manual
            </button>
          </div>

          {/* Hidden canvas used for decoding QR from camera / image */}
          <canvas ref={canvasRef} style={{ display: "none" }} />

          {/* MODE: CAMERA */}
          {mode === "camera" && (
            <div className="mb-6">
              <p className="text-sm text-slate-600 mb-2">
                Allow camera permission and point your QR code to the camera. It
                will auto-scan and verify.
              </p>
              <div className="w-full max-w-md aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
              <button
                onClick={startCamera}
                className="mt-3 bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-semibold"
              >
                Restart Camera
              </button>
            </div>
          )}

          {/* MODE: DEVICE (IMAGE UPLOAD) */}
          {mode === "device" && (
            <div className="mb-6">
              <p className="text-sm text-slate-600 mb-2">
                Select a QR code image from your device storage.
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="text-sm"
              />
            </div>
          )}

          {/* MODE: MANUAL */}
          {mode === "manual" && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                QR Payload (JSON)
              </label>
              <textarea
                className="w-full h-40 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Paste the full JSON content from the QR here.\nFor example:\n{\n  "proof": { "name": "Ramesh Kumar", "age": 25 },\n  "hash": "....",\n  "verifiedBy": "DigiLocker (Demo)"\n}`}
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
              />

              <button
                onClick={handleManualVerify}
                className="mt-3 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
              >
                Verify Manually
              </button>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="mt-2 text-red-600 text-sm bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          {/* RESULT */}
          {result && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm font-semibold text-green-800 mb-1">
                ✅ {result.message || "Verified by DigiLocker (Demo)"}
              </p>
              <p className="text-xs text-slate-600 mb-2">
                Only these fields were revealed from Aadhaar as part of the
                zero-knowledge proof:
              </p>
              <pre className="text-xs bg-slate-900 text-slate-50 p-3 rounded-lg overflow-auto max-h-52">
                {JSON.stringify(result.proof, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
