import { useEffect, useState } from "react";
import api from "../../axios/api";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import { FaUserCheck, FaSyncAlt, FaIdBadge } from "react-icons/fa";

export default function VerifiedUsers() {
  const [verified, setVerified] = useState([]);
  const [loadingVerified, setLoadingVerified] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchVerified();
    // Optionally add polling if needed
  }, []);

  async function fetchVerified() {
    setLoadingVerified(true);
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/api/admin/verified-users", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setVerified(res.data.users || []);
    } catch (err) {
      // Optionally show error for verified users
      setVerified([]);
    } finally {
      setLoadingVerified(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f5f6fa] text-gray-900 font-sans">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <div className="w-full flex justify-center pt-8 pb-10">
          <div className="max-w-5xl w-full px-4 md:px-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 border-b border-gray-200 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded bg-[#0A3A67] text-white flex items-center justify-center">
                  <FaUserCheck className="text-xl" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-semibold text-[#0A3A67]">
                    Verified Users ({verified.length})
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 mt-1">
                    All departments that have successfully completed
                    verification.
                  </p>
                </div>
              </div>

              <button
                className="px-4 md:px-6 py-2 border border-[#0A3A67] bg-[#0A3A67] text-white text-sm md:text-base rounded hover:bg-[#0c467f] focus:outline-none inline-flex items-center gap-2"
                onClick={fetchVerified}
              >
                <FaSyncAlt className={loadingVerified ? "animate-spin" : ""} />
                {loadingVerified ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            {/* Content */}
            {loadingVerified ? (
              <div className="text-center py-10 text-gray-700 text-sm md:text-base">
                Loading verified users...
              </div>
            ) : verified.length === 0 ? (
              <div className="text-center py-10 text-gray-600 border border-dashed border-gray-300 rounded bg-white">
                <p className="text-sm md:text-base">
                  No verified users found at the moment.
                </p>
                <p className="text-xs mt-2 text-gray-500">
                  Once departments are verified, they will appear here.
                </p>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-md">
                <div className="px-4 md:px-6 py-3 border-b border-gray-200 flex items-center justify-between text-sm">
                  <span className="text-gray-700">
                    Total verified departments:{" "}
                    <span className="font-semibold text-[#0A3A67]">
                      {verified.length}
                    </span>
                  </span>
                </div>
                <div
                  className="overflow-x-auto"
                  style={{ maxHeight: "70vh", overflowY: "auto" }}
                >
                  <table className="w-full text-xs md:text-sm text-left border border-gray-300 border-collapse min-w-[1100px]">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-3 md:px-4 py-2 border border-gray-300">
                          Department Name
                        </th>
                        <th className="px-3 md:px-4 py-2 border border-gray-300">
                          Type
                        </th>
                        <th className="px-3 md:px-4 py-2 border border-gray-300">
                          State
                        </th>
                        <th className="px-3 md:px-4 py-2 border border-gray-300">
                          District
                        </th>
                        <th className="px-3 md:px-4 py-2 border border-gray-300">
                          Head
                        </th>
                        <th className="px-3 md:px-4 py-2 border border-gray-300">
                          Email
                        </th>
                        <th className="px-3 md:px-4 py-2 border border-gray-300">
                          Contact
                        </th>
                        <th className="px-3 md:px-4 py-2 border border-gray-300">
                          Verified At
                        </th>
                        <th className="px-3 md:px-4 py-2 border border-gray-300">
                          Username
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {verified.map((u) => (
                        <tr
                          key={u.id}
                          className="bg-white hover:bg-[#f1f4f8] cursor-pointer"
                          onClick={() => setSelectedUser(u)}
                          title="View details"
                        >
                          <td className="px-3 md:px-4 py-2 border border-gray-300 font-medium">
                            <div className="flex items-center gap-2">
                              <FaIdBadge className="text-gray-600 shrink-0" />
                              <span className="truncate max-w-[260px]">
                                {u.department_name}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 md:px-4 py-2 border border-gray-300">
                            {u.department_type}
                          </td>
                          <td className="px-3 md:px-4 py-2 border border-gray-300">
                            {u.state}
                          </td>
                          <td className="px-3 md:px-4 py-2 border border-gray-300">
                            {u.district}
                          </td>
                          <td className="px-3 md:px-4 py-2 border border-gray-300">
                            {u.head_name}
                          </td>
                          <td className="px-3 md:px-4 py-2 border border-gray-300">
                            {u.email}
                          </td>
                          <td className="px-3 md:px-4 py-2 border border-gray-300">
                            {u.contact_number}
                          </td>
                          <td className="px-3 md:px-4 py-2 border border-gray-300 text-[11px] md:text-xs">
                            {u.verified_at
                              ? new Date(u.verified_at).toLocaleString()
                              : "N/A"}
                          </td>
                          <td className="px-3 md:px-4 py-2 border border-gray-300 font-mono">
                            {u.username || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal for user details */}
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-md p-6 max-w-lg w-full border border-gray-300 relative">
              <button
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl font-bold focus:outline-none"
                onClick={() => setSelectedUser(null)}
                title="Close"
              >
                ×
              </button>
              <h2 className="text-lg font-semibold text-[#0A3A67] mb-4 text-center flex items-center justify-center gap-2">
                <FaUserCheck className="text-gray-700" />
                User Details
              </h2>
              <div className="border border-gray-200 rounded-md p-4 bg-[#f9fafb]">
                <table className="w-full text-xs md:text-sm border-separate border-spacing-y-2">
                  <tbody>
                    <tr>
                      <td className="font-medium text-gray-800 pr-3 align-top w-1/3">
                        Department Name
                      </td>
                      <td className="text-gray-700">
                        {selectedUser.department_name}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-medium text-gray-800 pr-3 align-top">
                        Type
                      </td>
                      <td className="text-gray-700">
                        {selectedUser.department_type}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-medium text-gray-800 pr-3 align-top">
                        State
                      </td>
                      <td className="text-gray-700">{selectedUser.state}</td>
                    </tr>
                    <tr>
                      <td className="font-medium text-gray-800 pr-3 align-top">
                        District
                      </td>
                      <td className="text-gray-700">{selectedUser.district}</td>
                    </tr>
                    <tr>
                      <td className="font-medium text-gray-800 pr-3 align-top">
                        Head
                      </td>
                      <td className="text-gray-700">
                        {selectedUser.head_name}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-medium text-gray-800 pr-3 align-top">
                        Email
                      </td>
                      <td className="text-gray-700">{selectedUser.email}</td>
                    </tr>
                    <tr>
                      <td className="font-medium text-gray-800 pr-3 align-top">
                        Contact
                      </td>
                      <td className="text-gray-700">
                        {selectedUser.contact_number}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-medium text-gray-800 pr-3 align-top">
                        Verified At
                      </td>
                      <td className="text-gray-700">
                        {selectedUser.verified_at
                          ? new Date(selectedUser.verified_at).toLocaleString()
                          : "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-medium text-gray-800 pr-3 align-top">
                        Username
                      </td>
                      <td className="text-gray-700">
                        {selectedUser.username || "-"}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-medium text-gray-800 pr-3 align-top">
                        Address
                      </td>
                      <td className="text-gray-700">{selectedUser.address}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
