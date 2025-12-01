import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../axios/api";
import Sidebar from "../../../components/Sidebar";

export default function ZKLogin() {
  const [aadhaar, setAadhaar] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/api/zk/login", {
        aadhaar,
        password,
      });

      // Save user in localStorage for other pages
      localStorage.setItem("zkUser", JSON.stringify(res.data.user));
      navigate("/public/zk/home");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Login failed. Please check details."
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar active="Zero Knowledge" />

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            DigiLocker – Aadhaar Login (Demo)
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            Use demo Aadhaar:
            <br />
            <span className="font-mono text-xs">
              123412341234 / 1234
            </span> or{" "}
            <span className="font-mono text-xs">555566667777 / 1111</span>
          </p>

          {error && (
            <div className="mb-4 text-red-600 text-sm bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Aadhaar Number
              </label>
              <input
                type="text"
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter 12 digit Aadhaar"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password / PIN
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter PIN"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Login to DigiLocker
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
