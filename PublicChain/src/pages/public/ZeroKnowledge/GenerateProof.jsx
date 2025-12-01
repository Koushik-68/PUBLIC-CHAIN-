import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../axios/api";
import Sidebar from "../../../components/Sidebar";
import QRCode from "react-qr-code";

export default function GenerateProof() {
  const [user, setUser] = useState(null);
  const [selectedFields, setSelectedFields] = useState([]);
  const [qrPayload, setQrPayload] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fields = [
    { key: "name", label: "Name" },
    { key: "age", label: "Age" },
    { key: "dob", label: "Date of Birth" },
    { key: "gender", label: "Gender" },
    { key: "mobile", label: "Mobile Number" },
    { key: "aadhaar", label: "Aadhaar Number" },
  ];

  useEffect(() => {
    const stored = localStorage.getItem("zkUser");
    if (!stored) {
      navigate("/public/zk/login");
    } else {
      setUser(JSON.parse(stored));
    }
  }, [navigate]);

  const toggleField = (key) => {
    setSelectedFields((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );
  };

  const handleGenerate = async () => {
    if (!user) return;
    if (selectedFields.length === 0) {
      setError("Please select at least one field.");
      return;
    }
    setError("");
    setQrPayload(null);

    try {
      const res = await axios.post("/api/zk/generate-proof", {
        aadhaar: user.aadhaar,
        selectedFields,
      });

      // This full object will go inside the QR
      setQrPayload(res.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to generate proof. Try again."
      );
    }
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar active="Zero Knowledge" />

      <div className="flex-1 p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
          <h1 className="text-xl font-bold text-slate-800 mb-2">
            Generate Zero-Knowledge Proof
          </h1>
          <p className="text-sm text-slate-500 mb-4">
            Select which details from your Aadhaar you want to show to others.
            Only these fields will be visible when someone scans your QR.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {fields.map((f) => (
              <label
                key={f.key}
                className="flex items-center space-x-2 text-sm text-slate-700"
              >
                <input
                  type="checkbox"
                  checked={selectedFields.includes(f.key)}
                  onChange={() => toggleField(f.key)}
                />
                <span>{f.label}</span>
              </label>
            ))}
          </div>

          {error && (
            <div className="mb-4 text-red-600 text-sm bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
          >
            Generate QR Code
          </button>

          {qrPayload && (
            <div className="mt-8 flex flex-col md:flex-row gap-6">
              <div className="flex-1 flex flex-col items-center">
                <h2 className="text-sm font-semibold text-slate-700 mb-2">
                  QR Code (Share this)
                </h2>
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <QRCode value={JSON.stringify(qrPayload)} size={180} />
                </div>
              </div>

              <div className="flex-1">
                <h2 className="text-sm font-semibold text-slate-700 mb-2">
                  Data inside the QR (for understanding)
                </h2>
                <pre className="text-xs bg-slate-900 text-slate-50 p-3 rounded-lg overflow-auto max-h-60">
                  {JSON.stringify(qrPayload, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
