import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";

export default function DigiLockerHome() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("zkUser");
    if (!stored) {
      navigate("/public/zk/login");
    } else {
      setUser(JSON.parse(stored));
    }
  }, [navigate]);

  if (!user) return null;

  const maskedAadhaar =
    user.aadhaar?.slice(0, 4) + " XXXX " + user.aadhaar?.slice(-4);

  const firstName = user.name?.split(" ")[0] || user.name;

  return (
    // ✅ Full screen wrapper
    <div className="min-h-screen w-full flex bg-slate-100">
      {/* Left Sidebar */}
      <Sidebar active="Zero Knowledge" />

      {/* Right main section like DigiLocker */}
      <main className="flex-1 flex flex-col bg-slate-100">
        {/* 🔹 Top DigiLocker-style header bar */}
        <header className="w-full bg-white border-b shadow-sm px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://play-lh.googleusercontent.com/4jlq9fgOmpkCikwBzJYkbXlkruFo1ygmaLaaLcLph9ln8sQgQ78P0-6teFkczp1S0N-l"
              alt="DigiLocker"
              className="h-9 w-9 rounded-lg"
            />
            <div>
              <p className="text-sm font-semibold text-indigo-700 leading-tight">
                DigiLocker
              </p>
              <p className="text-xs text-slate-500">
                Document wallet to empower citizens
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-800">
                {user.name}
              </p>
              <p className="text-xs text-slate-500 font-mono">
                Aadhaar: {maskedAadhaar}
              </p>
            </div>
            <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-semibold text-indigo-700">
              {firstName?.[0] || "U"}
            </div>
          </div>
        </header>

        {/* 🔹 Main scrollable content */}
        <div className="flex-1 flex justify-center overflow-y-auto">
          <div className="w-full max-w-5xl px-6 py-8">
            {/* Hero section like DigiLocker top purple area */}
            <section className="rounded-2xl bg-gradient-to-r from-indigo-700 to-sky-500 text-white p-6 mb-8 shadow-lg">
              <p className="text-sm opacity-80 mb-1">
                Welcome back, {firstName}
              </p>
              <h1 className="text-2xl font-bold mb-2">
                Your digital documents are safe with DigiLocker
              </h1>
              <p className="text-sm md:text-base text-indigo-100 max-w-2xl">
                Aadhaar linked account • Zero-knowledge demo view – your Aadhaar
                details stay on your device, only proofs are shared.
              </p>
            </section>

            {/* Issued Documents section style */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-slate-800">
                  Issued Documents
                </h2>
                {/* <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                  See All
                </button> */}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {/* Aadhaar card card */}
                <div className="bg-white rounded-xl shadow-md p-4 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold">
                    UIDAI
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Aadhaar Card
                    </p>
                    <p className="text-xs font-mono text-slate-500">
                      {maskedAadhaar}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Unique Identification Authority of India
                    </p>
                  </div>
                </div>

                {/* Placeholder card to look like DigiLocker */}
                <div className="bg-white rounded-xl shadow-md p-4 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 text-xs font-bold">
                    GOV
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Other Documents
                    </p>
                    <p className="text-xs text-slate-500">
                      Driving Licence, PAN, Marksheets, etc.
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      (Demo only – not fetched here)
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Zero-knowledge cards – like DigiLocker feature tiles */}
            <section>
              <h2 className="text-base font-semibold text-slate-800 mb-3">
                Zero-Knowledge Services
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                <Link to="/public/zk/generate">
                  <div className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition">
                    <p className="text-xs font-semibold text-indigo-600 mb-1 uppercase tracking-wide">
                      Create Proof
                    </p>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">
                      Generate ZK Proof & QR
                    </h3>
                    <p className="text-sm text-slate-500">
                      Choose which Aadhaar fields you want to share and create a
                      DigiLocker-style QR code proof.
                    </p>
                  </div>
                </Link>

                <Link to="/public/zk/verify">
                  <div className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition">
                    <p className="text-xs font-semibold text-emerald-600 mb-1 uppercase tracking-wide">
                      Verify
                    </p>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">
                      Scan / Verify QR
                    </h3>
                    <p className="text-sm text-slate-500">
                      Scan or upload a QR and verify that the shared information
                      is valid and untampered in a privacy-first way.
                    </p>
                  </div>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
