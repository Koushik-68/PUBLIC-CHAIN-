// src/pages/public/ZK/GenerateProof.jsx

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

      setQrPayload(res.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to generate proof. Try again."
      );
    }
  };

  if (!user) return null;

  const firstName = user.name?.split(" ")[0] || user.name;

  return (
    <div className="min-h-screen w-full flex bg-slate-100">
      {/* Sidebar */}
      <Sidebar active="Zero Knowledge" />

      {/* Right side like DigiLocker interior page */}
      <main className="flex-1 flex flex-col bg-slate-100">
        {/* Top header bar (same feel as DigiLocker) */}
        <header className="w-full bg-white border-b shadow-sm px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://play-lh.googleusercontent.com/4jlq9fgOmpkCikwBzJYkbXlkruFo1ygmaLaaLcLph9ln8sQgQ78P0-6teFkczp1S0N-l"
              alt="DigiLocker"
              className="h-11 w-11 rounded-lg"
            />
            <div>
              <p className="text-sm font-semibold text-indigo-700 leading-tight">
                DigiLocker
              </p>
              <p className="text-xs text-slate-500">
                Generate secure sharing QR (ZK Demo)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-800">
                {user.name}
              </p>
              <p className="text-xs text-slate-500">
                Aadhaar linked account (demo)
              </p>
            </div>
            <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-semibold text-indigo-700">
              {firstName?.[0] || "U"}
            </div>
          </div>
        </header>

        {/* Main content area */}
        <div className="flex-1 flex justify-center overflow-y-auto">
          <div className="w-full max-w-5xl px-6 py-8">
            {/* Purple info strip like DigiLocker */}
            <section className="rounded-2xl bg-gradient-to-r from-indigo-700 to-sky-500 text-white p-5 mb-6 shadow-lg">
              <p className="text-sm opacity-80 mb-1">Hello, {firstName}.</p>
              <h1 className="text-xl md:text-2xl font-bold mb-1">
                Generate a QR to share only selected Aadhaar details.
              </h1>
              <p className="text-xs md:text-sm text-indigo-100 max-w-2xl">
                Your full Aadhaar never leaves your device. Only the chosen
                fields are packed into a signed proof, just like secure
                DigiLocker document sharing.
              </p>
            </section>

            {/* White card like DigiLocker content card */}
            <section className="bg-white rounded-2xl shadow-md p-6">
              <div className="mb-4 flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">
                    Select details to include in QR
                  </h2>
                  <p className="text-xs md:text-sm text-slate-500">
                    Tick the information you want to show when someone scans
                    your QR code.
                  </p>
                </div>
              </div>

              {/* Field checkboxes styled like DigiLocker filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {fields.map((f) => (
                  <label
                    key={f.key}
                    className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 cursor-pointer hover:bg-slate-100"
                  >
                    <input
                      type="checkbox"
                      checked={selectedFields.includes(f.key)}
                      onChange={() => toggleField(f.key)}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>{f.label}</span>
                  </label>
                ))}
              </div>

              {error && (
                <div className="mb-4 text-sm bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md">
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-sm"
              >
                Generate QR Code
              </button>

              {/* QR + JSON panel */}
              {qrPayload && (
                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col items-center shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">
                      QR Code (share this)
                    </h3>
                    <div className="bg-white p-4 rounded-lg border border-slate-200">
                      <QRCode value={JSON.stringify(qrPayload)} size={180} />
                    </div>
                    <p className="mt-3 text-xs text-slate-500 text-center">
                      Show this QR at a verifier. They can scan it and verify
                      the proof like a DigiLocker document.
                    </p>
                  </div>

                  <div className="bg-slate-900 rounded-xl p-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-100 mb-2">
                      Data inside QR (for understanding only)
                    </h3>
                    <pre className="text-xs text-slate-100 bg-transparent overflow-auto max-h-64">
                      {JSON.stringify(qrPayload, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
