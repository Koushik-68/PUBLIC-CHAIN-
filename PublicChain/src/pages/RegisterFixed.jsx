import React, { useState } from "react";
import api from "../axios/api";
import { useNavigate } from "react-router-dom";

export default function RegisterFixed() {
  const [departmentName, setDepartmentName] = useState("");
  const [departmentType, setDepartmentType] = useState("Other");
  const [stateVal, setStateVal] = useState("");
  const [district, setDistrict] = useState("");
  const [headName, setHeadName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      await api.post("/api/register", {
        name: headName || departmentName,
        email,
        department_name: departmentName,
        department_type: departmentType,
        state: stateVal,
        district,
        contact_number: contactNumber,
        head_name: headName,
        address,
      });
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#0D051B] text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

      {/* Center Wrapper */}
      <div className="relative w-full max-w-md z-10 mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-2xl shadow-indigo-500/30 mb-4 transform hover:scale-[1.02] transition-all duration-500 ease-in-out">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>

          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-300 mb-2 tracking-wide">
            PublicChain
          </h1>

          <p className="text-indigo-300 text-base font-light">
            Department Registration Portal
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-gray-800/50 backdrop-blur-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),0_0_15px_rgba(79,70,229,0.5)] rounded-3xl p-10 border border-indigo-400/30 transition-all duration-500 hover:border-blue-400/50">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Register Department
            </h2>
            <p className="text-indigo-300 text-sm">
              Fill in details to request access
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-900/40 border-l-4 border-red-500 p-4 rounded-lg shadow-inner">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-red-400 mr-3 animate-pulse"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-red-300 font-medium text-sm">
                  {error}
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Department Name */}
            <div>
              <label className="block text-sm font-semibold text-indigo-200 mb-2">
                Department Name
              </label>
              <input
                type="text"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white text-black border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                placeholder="Department Name"
              />
            </div>

            {/* Department Type */}
            <div>
              <label className="block text-sm font-semibold text-indigo-200 mb-2">
                Department Type
              </label>
              <select
                value={departmentType}
                onChange={(e) => setDepartmentType(e.target.value)}
                className="w-full px-4 py-3 bg-white text-black border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option>Education</option>
                <option>Health</option>
                <option>Infrastructure</option>
                <option>Welfare</option>
                <option>Environment</option>
                <option>Other</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* State */}
              <div>
                <label className="block text-sm font-semibold text-indigo-200 mb-2">
                  State
                </label>
                <input
                  type="text"
                  value={stateVal}
                  onChange={(e) => setStateVal(e.target.value)}
                  className="w-full px-4 py-3 bg-white text-black border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                />
              </div>

              {/* District */}
              <div>
                <label className="block text-sm font-semibold text-indigo-200 mb-2">
                  District
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-4 py-3 bg-white text-black border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Head Name */}
            <div>
              <label className="block text-sm font-semibold text-indigo-200 mb-2">
                Head / Contact Person
              </label>
              <input
                type="text"
                value={headName}
                onChange={(e) => setHeadName(e.target.value)}
                className="w-full px-4 py-3 bg-white text-black border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-indigo-200 mb-2">
                Contact Number
              </label>
              <input
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full px-4 py-3 bg-white text-black border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-indigo-200 mb-2">
                Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-white text-black border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-indigo-200 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email address"
                className="w-full px-4 py-3 bg-white text-black border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full text-white font-bold py-3.5 px-4 rounded-xl bg-gradient-to-r from-green-500 to-indigo-600 shadow-lg hover:scale-105 transition-all"
            >
              Create Account
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-700/50">
            <div className="flex items-center justify-center text-sm text-indigo-300 font-medium">
              <svg
                className="w-4 h-4 mr-2 text-green-400 animate-pulse"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Connection Status: Encrypted & Verified
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          PublicChain Trust Protocol © {new Date().getFullYear()}
        </div>
      </div>

      {/* Blob Animation */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(30px,-50px) scale(1.1); }
          66% { transform: translate(-20px,20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}
