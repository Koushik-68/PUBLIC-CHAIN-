import { useState } from "react";
import api from "../axios/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [role, setRole] = useState("department");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post("/api/login", { identifier, password, role });
      const { token } = res.data;
      localStorage.setItem("token", token);
      if (role === "government") {
        navigate("/government/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#0D051B] text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

      {/* Center Content Wrapper */}
      <div className="relative w-full max-w-md z-10 mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-2xl shadow-indigo-500/30 mb-4 transform scale-100 hover:scale-[1.02] transition-all duration-500 ease-in-out">
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
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-300 mb-2 tracking-wide">
            PublicChain
          </h1>
          <p className="text-indigo-300 text-base font-light">
            Decentralized Access for Government Entities
          </p>
        </div>

        {/* Glass Card */}
        <div className="bg-gray-800/50 backdrop-blur-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),0_0_15px_rgba(79,70,229,0.5)] rounded-3xl p-10 border border-indigo-400/30 transition-all duration-500 hover:border-blue-400/50">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              <center>Access Portal</center>
            </h2>
            <p className="text-indigo-300 text-sm">
              <center>Enter credentials to securely authenticate</center>
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
            {/* Identifier */}
            <div className="group">
              <label className="block text-sm font-semibold text-indigo-200 mb-2">
                User ID / Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  placeholder="Enter ID or organizational handle"
                  className="w-full pl-10 pr-4 py-3 bg-white text-black border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Role */}
            <div className="group">
              <label className="block text-sm font-semibold text-indigo-200 mb-2">
                Authentication Role
              </label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white text-black border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="department">Department</option>
                  <option value="government">Government</option>
                </select>

                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="group">
              <label className="block text-sm font-semibold text-indigo-200 mb-2">
                Secret Key
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="********"
                  className="w-full pl-10 pr-4 py-3 bg-white text-black border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500"
                />

                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full text-white font-bold py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg hover:scale-105 transition-all"
            >
              Login
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          PublicChain Trust Protocol © {new Date().getFullYear()}
        </div>
      </div>

      {/* Blob Animation CSS */}
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
