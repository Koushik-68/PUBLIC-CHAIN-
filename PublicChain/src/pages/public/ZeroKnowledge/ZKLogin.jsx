// src/pages/public/ZK/ZKLogin.jsx

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
    <div className="min-h-screen w-full flex">
      {/* Left sidebar */}
      <Sidebar active="ZK Login" />

      {/* Right side – full screen area */}
      <div className="flex-1 min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-200">
          {/* Header with DigiLocker logo */}
          <div className="pt-8 pb-4 px-10 text-center">
            <img
              src="https://play-lh.googleusercontent.com/4jlq9fgOmpkCikwBzJYkbXlkruFo1ygmaLaaLcLph9ln8sQgQ78P0-6teFkczp1S0N-l"
              alt="DigiLocker"
              className="mx-auto h-24 mb-4 rounded-xl"
            />
            <h2 className="text-2xl font-bold text-gray-800">
              Sign In to your account!
            </h2>
          </div>

          {/* Error message */}
          {error && (
            <div className="mx-10 mt-2 mb-3 text-sm bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-md">
              {error}
            </div>
          )}

          {/* Form – ONLY Aadhaar + Password */}
          <form onSubmit={handleLogin} className="px-10 pb-8 pt-4 space-y-4">
            <div>
              <input
                type="text"
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value)}
                placeholder="Aadhaar Number"
                maxLength={12}
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6 digit security PIN"
                maxLength={6}
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {/* <p className="text-right text-xs text-blue-600 mt-1 cursor-pointer">
                Forgot security PIN?
              </p> */}
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-md font-semibold text-lg"
            >
              Sign In
            </button>
          </form>

          {/* Footer link */}
          {/* <div className="border-t border-gray-200 text-center py-4 text-sm">
            Don&apos;t have an account?{" "}
            {/* <span className="text-blue-600 font-semibold cursor-pointer">
              Sign Up
            </span> */}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}
