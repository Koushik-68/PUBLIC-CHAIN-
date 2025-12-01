import { useState, useEffect } from "react";
import api from "../../axios/api";
import AdminSidebar from "../../components/Admin/AdminSidebar";

export default function FundRequests() {
  const [fundRequests, setFundRequests] = useState([]);
  const [loadingFundRequests, setLoadingFundRequests] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchFundRequestsAdmin();
  }, []);

  async function fetchFundRequestsAdmin() {
    setLoadingFundRequests(true);
    try {
      const res = await api.get("/api/fund-requests");
      setFundRequests(res.data.requests || []);
    } catch (err) {
      setFundRequests([]);
    } finally {
      setLoadingFundRequests(false);
    }
  }

  return (
    <div className="flex min-h-screen w-screen bg-[#f5f6fa] text-gray-900 font-sans overflow-x-hidden">
      <AdminSidebar />

      {/* Main area – full width after sidebar */}
      <div className="flex-1 flex flex-col">
        <div className="w-full px-4 md:px-8 py-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-3">
            <h2 className="text-2xl font-semibold text-[#0A3A67]">
              All Fund Requests
            </h2>
            <button
              className="px-4 md:px-6 py-2 rounded border border-[#0A3A67] bg-[#0A3A67] text-white text-sm md:text-base font-medium hover:bg-[#0c467f] focus:outline-none"
              onClick={fetchFundRequestsAdmin}
            >
              <span className="inline-flex items-center gap-2">
                <svg
                  className={`w-4 h-4 md:w-5 md:h-5 ${
                    loadingFundRequests ? "animate-spin" : ""
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
                {loadingFundRequests ? "Refreshing..." : "Refresh"}
              </span>
            </button>
          </div>

          {/* Content */}
          {loadingFundRequests ? (
            <div className="text-center py-8 text-gray-700 text-sm md:text-base">
              Loading fund requests...
            </div>
          ) : fundRequests.length === 0 ? (
            <div className="text-center py-6 text-gray-600 border border-dashed border-gray-300 rounded bg-white">
              <p className="text-sm md:text-base">No fund requests found.</p>
            </div>
          ) : (
            <div
              className="overflow-x-auto"
              style={{ maxHeight: "70vh", overflowY: "auto" }}
            >
              <table className="w-full text-xs md:text-sm text-left border border-gray-300 border-collapse min-w-[1100px]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 md:px-4 py-2 border border-gray-300">
                      Department
                    </th>
                    <th className="px-3 md:px-4 py-2 border border-gray-300">
                      Title
                    </th>
                    <th className="px-3 md:px-4 py-2 border border-gray-300">
                      Amount
                    </th>
                    <th className="px-3 md:px-4 py-2 border border-gray-300">
                      Urgency
                    </th>
                    <th className="px-3 md:px-4 py-2 border border-gray-300">
                      Status
                    </th>
                    <th className="px-3 md:px-4 py-2 border border-gray-300">
                      Date
                    </th>
                    <th className="px-3 md:px-4 py-2 border border-gray-300">
                      Request ID
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {fundRequests.map((r) => (
                    <tr
                      key={r.id}
                      className="bg-white hover:bg-[#f1f4f8] cursor-pointer"
                      onClick={() => setSelectedRequest(r)}
                      title="View details"
                    >
                      <td className="px-3 md:px-4 py-2 border border-gray-300">
                        {r.department}
                      </td>
                      <td className="px-3 md:px-4 py-2 border border-gray-300">
                        {r.title}
                      </td>
                      <td className="px-3 md:px-4 py-2 border border-gray-300">
                        ₹{r.amount}
                      </td>
                      <td className="px-3 md:px-4 py-2 border border-gray-300">
                        {r.urgency}
                      </td>
                      <td className="px-3 md:px-4 py-2 border border-gray-300">
                        {r.status}
                      </td>
                      <td className="px-3 md:px-4 py-2 border border-gray-300">
                        {r.created_at &&
                          new Date(r.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-3 md:px-4 py-2 border border-gray-300">
                        {r.generated_id}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Modal for fund request details */}
          {selectedRequest && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-md shadow-md p-6 max-w-lg w-full border border-gray-300 relative">
                <button
                  className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl font-bold focus:outline-none"
                  onClick={() => setSelectedRequest(null)}
                  title="Close"
                >
                  ×
                </button>
                <h2 className="text-lg font-semibold text-[#0A3A67] mb-4 text-center">
                  Fund Request Details
                </h2>
                <table className="w-full text-xs md:text-sm border-separate border-spacing-y-2">
                  <tbody>
                    <tr>
                      <td className="font-medium text-gray-800 pr-3 align-top w-1/3">
                        Department
                      </td>
                      <td className="text-gray-700">
                        {selectedRequest.department}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-medium text-gray-800 pr-3 align-top">
                        Title
                      </td>
                      <td className="text-gray-700">{selectedRequest.title}</td>
                    </tr>
                    <tr>
                      <td className="font-medium text-gray-800 pr-3 align-top">
                        Amount
                      </td>
                      <td className="text-gray-700">
                        ₹{selectedRequest.amount}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-medium text-gray-800 pr-3 align-top">
                        Urgency
                      </td>
                      <td className="text-gray-700">
                        {selectedRequest.urgency}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-medium text-gray-800 pr-3 align-top">
                        Reason
                      </td>
                      <td className="text-gray-700">
                        {selectedRequest.reason}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-medium text-gray-800 pr-3 align-top">
                        Contact
                      </td>
                      <td className="text-gray-700">
                        {selectedRequest.contact}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-medium text-gray-800 pr-3 align-top">
                        Impact Estimate
                      </td>
                      <td className="text-gray-700">
                        {selectedRequest.impact_estimate}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-medium text-gray-800 pr-3 align-top">
                        Status
                      </td>
                      <td className="text-gray-700">
                        {selectedRequest.status}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-medium text-gray-800 pr-3 align-top">
                        Request ID
                      </td>
                      <td className="text-gray-700">
                        {selectedRequest.generated_id}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-medium text-gray-800 pr-3 align-top">
                        Date
                      </td>
                      <td className="text-gray-700">
                        {selectedRequest.created_at &&
                          new Date(selectedRequest.created_at).toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-medium text-gray-800 pr-3 align-top">
                        Files
                      </td>
                      <td className="text-gray-700">
                        {selectedRequest.files
                          ? JSON.parse(selectedRequest.files)
                              .map((f) => f.name)
                              .join(", ")
                          : "No files"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
