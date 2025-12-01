import React, { useState, useRef, useEffect } from "react";
import axios from "../../../axios/api";
import Sidebar from "../../../components/Sidebar";
import jsQR from "jsqr";

export default function VerifyProof() {
  const [mode, setMode] = useState("camera");
  const [rawInput, setRawInput] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

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
        setError("QR data format is invalid.");
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
        setError(err.response?.data?.message || "Verification failed.");
      }
    }
  };

  const startCamera = async () => {
    setError("");
    setResult(null);
    stopCamera();

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Camera not supported.");
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
    } catch {
      setError("Unable to access camera.");
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

      if (code?.data) {
        stopCamera();
        verifyPayloadString(code.data);
      }
    }, 600);
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

  const handleImageUpload = (e) => {
    setError("");
    setResult(null);

    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);

        if (code?.data) verifyPayloadString(code.data);
        else setError("No QR code found.");
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const handleManualVerify = () => verifyPayloadString(rawInput);

  return (
    <div className="min-h-screen w-full flex bg-slate-100">
      <Sidebar active="Zero Knowledge" />

      <main className="flex-1 flex flex-col">
        {/* ✅ DigiLocker style header */}
        <header className="w-full bg-white border-b shadow-sm px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://play-lh.googleusercontent.com/4jlq9fgOmpkCikwBzJYkbXlkruFo1ygmaLaaLcLph9ln8sQgQ78P0-6teFkczp1S0N-l"
              alt="DigiLocker"
              className="h-10 w-10 rounded-md"
            />
            <div>
              <p className="text-sm font-semibold text-indigo-700">Verify QR</p>
              <p className="text-xs text-slate-500">
                DigiLocker Zero-Knowledge Verification
              </p>
            </div>
          </div>
        </header>

        <div className="flex-1 flex justify-center px-6 py-8 overflow-y-auto">
          <div className="w-full max-w-5xl">
            {/* ✅ Info strip */}
            <div className="rounded-xl bg-gradient-to-r from-indigo-700 to-sky-500 text-white p-5 mb-6 shadow-md">
              <h1 className="text-xl font-bold mb-1">Verify QR Code</h1>
              <p className="text-sm opacity-90">
                Scan or upload a DigiLocker-style QR to verify shared Aadhaar
                details using Zero-Knowledge Proof.
              </p>
            </div>

            {/* ✅ White content card */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              {/* Mode buttons */}
              <div className="flex gap-2 mb-6">
                {["camera", "device", "manual"].map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setMode(m);
                      setError("");
                      setResult(null);
                      m === "camera" ? startCamera() : stopCamera();
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                      mode === m
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {m.toUpperCase()}
                  </button>
                ))}
              </div>

              <canvas ref={canvasRef} className="hidden" />

              {/* CAMERA */}
              {mode === "camera" && (
                <div className="mb-6">
                  <div className="w-full max-w-md aspect-video bg-black rounded-xl overflow-hidden">
                    <video ref={videoRef} className="w-full h-full" />
                  </div>
                  <button
                    onClick={startCamera}
                    className="mt-3 bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-semibold"
                  >
                    Restart Camera
                  </button>
                </div>
              )}

              {/* DEVICE */}
              {mode === "device" && (
                <div className="mb-6">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="text-sm"
                  />
                </div>
              )}

              {/* MANUAL */}
              {mode === "manual" && (
                <div className="mb-6">
                  <textarea
                    className="w-full h-40 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono focus:ring-2 focus:ring-indigo-500"
                    placeholder="Paste QR JSON here..."
                    value={rawInput}
                    onChange={(e) => setRawInput(e.target.value)}
                  />
                  <button
                    onClick={handleManualVerify}
                    className="mt-3 bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-semibold"
                  >
                    Verify Manually
                  </button>
                </div>
              )}

              {error && (
                <div className="mt-2 text-sm text-red-700 bg-red-50 border border-red-200 p-3 rounded-md">
                  {error}
                </div>
              )}

              {result && (
                <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-emerald-800 mb-2">
                    ✅ {result.message || "Verified Successfully"}
                  </p>
                  <pre className="text-xs bg-slate-900 text-slate-50 p-3 rounded-lg overflow-auto max-h-52">
                    {JSON.stringify(result.proof, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
