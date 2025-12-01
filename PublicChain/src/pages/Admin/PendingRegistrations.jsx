import { useState, useEffect } from "react";
import api from "../../axios/api";
import AdminSidebar from "../../components/Admin/AdminSidebar";

export default function PendingRegistrations() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchPending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchPending() {
    setLoading(true);
    setMessage(null);
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/api/admin/pending-users", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setPending(res.data.users || []);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  async function verify(userId) {
    setMessage(null);
    try {
      const token = localStorage.getItem("token");
      const res = await api.post(
        "/api/admin/verify-user",
        { userId },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      const { username, password } = res.data;
      setMessage(
        `Verified user ${userId}. Username: ${username} Password: ${password}`
      );
      setPending((p) => p.filter((u) => u.id !== userId));
      setModalOpen(false);
      setSelected(null);
    } catch (err) {
      setMessage(err.response?.data?.message || "Verify failed");
    }
  }

  return (
    <div className="flex min-h-screen w-screen bg-[#f5f6fa] text-gray-900 font-sans overflow-x-hidden">
      {/* Sidebar (fixed width) */}
      <AdminSidebar />

      {/* Main Area – takes all remaining width */}
      <div className="flex-1 flex flex-col">
        {/* Page content wrapper */}
        <div className="w-full px-4 md:px-8 py-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-3">
            <h2 className="text-2xl font-semibold text-[#0A3A67]">
              Pending Registrations
            </h2>
            <button
              className="px-4 md:px-6 py-2 rounded border border-[#0A3A67] bg-[#0A3A67] text-white text-sm md:text-base font-medium hover:bg-[#0c467f] focus:outline-none"
              onClick={fetchPending}
            >
              <span className="inline-flex items-center gap-2">
                <svg
                  className={`w-4 h-4 md:w-5 md:h-5 ${
                    loading ? "animate-spin" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v5h.582M20 20v-5h-.581M5.635 19A8.001 8.001 0 0012 20a8 8 0 008-8m-1.365-7A8.001 8.001 0 0012 4a8 8 0 00-8 8"
                  />
                </svg>
                Refresh
              </span>
            </button>
          </div>

          {/* Status / error message */}
          {message && (
            <div
              className={`mb-6 p-3 rounded border-l-4 text-sm ${
                message.includes("Verified")
                  ? "bg-green-50 border-green-600 text-green-800"
                  : "bg-red-50 border-red-600 text-red-800"
              }`}
            >
              <div className="font-medium">{message}</div>
            </div>
          )}

          {/* Content */}
          {loading ? (
            <div className="text-center py-8 text-gray-700">
              Loading registrations...
            </div>
          ) : pending.length === 0 ? (
            <div className="text-center py-6 text-gray-600 border border-dashed border-gray-300 rounded bg-white">
              <p>
                All clear! No pending registrations currently require
                verification.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 py-4">
              {pending.map((u) => (
                <div
                  key={u.id}
                  className="bg-white border border-gray-200 rounded-md p-4 flex flex-col cursor-pointer hover:bg-[#f1f4f8] transition-colors"
                  onClick={() => {
                    setSelected(u);
                    setModalOpen(true);
                  }}
                >
                  <div className="font-semibold text-sm md:text-base text-[#0A3A67] mb-1 truncate">
                    {u.department_name}
                  </div>
                  <div className="text-gray-700 text-xs mb-1">
                    {u.department_type}
                  </div>
                  <div className="text-gray-600 text-xs mb-1">
                    {u.state}, {u.district}
                  </div>
                  <div className="text-gray-600 text-xs mb-1">
                    Head: {u.head_name}
                  </div>
                  <div className="text-gray-600 text-xs mb-1">{u.email}</div>
                  <div className="text-gray-500 text-xs">
                    {u.created_at
                      ? new Date(u.created_at).toLocaleDateString()
                      : "N/A"}
                  </div>
                  <div className="mt-3">
                    <span className="inline-block px-3 py-1 rounded bg-[#fff5e5] text-[#a36b00] text-xs font-semibold border border-[#f0d19c]">
                      Pending
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {modalOpen && selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-md shadow-md p-6 w-full max-w-lg relative border border-gray-300">
              <button
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl font-bold focus:outline-none"
                onClick={() => {
                  setModalOpen(false);
                  setSelected(null);
                }}
              >
                &times;
              </button>
              <h3 className="text-lg font-semibold text-[#0A3A67] mb-4 text-center">
                Registration Details
              </h3>
              <table className="w-full text-xs md:text-sm text-left border-separate border-spacing-y-2">
                <tbody>
                  <tr>
                    <td className="font-medium text-gray-800 pr-3 align-top w-1/3">
                      Department Name
                    </td>
                    <td className="text-gray-700">
                      {selected.department_name}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-800 pr-3 align-top">
                      Type
                    </td>
                    <td className="text-gray-700">
                      {selected.department_type}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-800 pr-3 align-top">
                      State
                    </td>
                    <td className="text-gray-700">{selected.state}</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-800 pr-3 align-top">
                      District
                    </td>
                    <td className="text-gray-700">{selected.district}</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-800 pr-3 align-top">
                      Head
                    </td>
                    <td className="text-gray-700">{selected.head_name}</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-800 pr-3 align-top">
                      Email
                    </td>
                    <td className="text-gray-700">{selected.email}</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-800 pr-3 align-top">
                      Contact
                    </td>
                    <td className="text-gray-700">{selected.contact_number}</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-800 pr-3 align-top">
                      Registered At
                    </td>
                    <td className="text-gray-700">
                      {selected.created_at
                        ? new Date(selected.created_at).toLocaleString()
                        : "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="flex justify-center mt-6">
                <button
                  className="px-4 md:px-6 py-2 rounded border border-[#0A3A67] bg-[#0A3A67] text-white text-sm md:text-base font-medium hover:bg-[#0c467f] focus:outline-none"
                  onClick={() => verify(selected.id)}
                >
                  Verify &amp; Generate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
