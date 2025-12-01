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

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar active="Zero Knowledge" />

      <div className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            DigiLocker Replica – Zero Knowledge Demo
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            Logged in as <span className="font-semibold">{user.name}</span>{" "}
            (Aadhaar: <span className="font-mono">{maskedAadhaar}</span>)
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <Link to="/public/zk/generate">
              <div className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition">
                <h2 className="text-lg font-semibold text-slate-800 mb-2">
                  Zero-Knowledge Proof
                </h2>
                <p className="text-sm text-slate-500">
                  Select which fields from your Aadhaar you want to share, then
                  generate a QR code.
                </p>
              </div>
            </Link>

            <Link to="/public/zk/verify">
              <div className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition">
                <h2 className="text-lg font-semibold text-slate-800 mb-2">
                  Verify QR
                </h2>
                <p className="text-sm text-slate-500">
                  Scan or paste a QR payload and verify that the information is
                  valid and not tampered (DigiLocker demo).
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
