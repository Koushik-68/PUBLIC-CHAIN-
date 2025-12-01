import React, { useEffect, useState } from "react";
import DepartmentSidebar from "./DepartmentSidebar";
import api from "../../axios/api";

export default function ViewAllFundRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    async function fetchRequests() {
      setLoading(true);
      try {
        const res = await api.get("/api/fund-requests");
        setRequests(res.data.requests || []);
      } catch (err) {
        setError("Failed to load fund requests.");
      } finally {
        setLoading(false);
      }
    }
    fetchRequests();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      <DepartmentSidebar />
      <main className="flex-1 p-8 max-w-6xl mx-auto bg-white border-l border-gray-200">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">
          All Fund Requests
        </h1>

        {loading && (
          <div className="mb-4 text-sm text-gray-700">
            Loading fund requests...
          </div>
        )}
        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-300 rounded px-3 py-2">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.length === 0 ? (
              <div className="col-span-full text-sm text-gray-700">
                No fund requests found.
              </div>
            ) : (
              requests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white rounded-md p-5 shadow-sm border border-gray-200 cursor-pointer hover:border-blue-500 hover:shadow-md transition"
                  onClick={() => setSelectedRequest(request)}
                  title="View details"
                >
                  <h2 className="text-lg font-medium text-gray-900 mb-2">
                    {request.title}
                  </h2>
                  <div className="text-xs text-gray-700 mb-1">
                    <span className="font-semibold">Department: </span>
                    {request.department}
                  </div>
                  <div className="text-xs text-gray-700 mb-1">
                    <span className="font-semibold">Amount: </span>₹
                    {request.amount}
                  </div>
                  <div className="text-xs text-gray-700 mb-1">
                    <span className="font-semibold">Urgency: </span>
                    {request.urgency}
                  </div>
                  <div className="text-xs text-gray-700 mb-1">
                    <span className="font-semibold">Status: </span>
                    {request.status}
                  </div>
                  <div className="text-xs text-gray-700 mb-1">
                    <span className="font-semibold">Request ID: </span>
                    {request.generated_id}
                  </div>
                  <div className="text-xs text-gray-700 mb-1">
                    <span className="font-semibold">Date: </span>
                    {request.created_at &&
                      new Date(request.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Modal for fund request details */}
        {selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-md shadow-xl p-8 max-w-lg w-full border border-gray-300 relative">
              <button
                className="absolute top-3 right-3 text-gray-600 hover:text-red-600 text-2xl font-bold"
                onClick={() => setSelectedRequest(null)}
                title="Close"
              >
                ×
              </button>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Fund Request Details
              </h2>
              <table className="w-full text-sm text-gray-800 border-separate border-spacing-y-2">
                <tbody>
                  <tr>
                    <td className="font-medium w-1/3 align-top text-gray-700">
                      Department
                    </td>
                    <td>{selectedRequest.department}</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700">Title</td>
                    <td>{selectedRequest.title}</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700">Amount</td>
                    <td>₹{selectedRequest.amount}</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700">Urgency</td>
                    <td>{selectedRequest.urgency}</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700">Reason</td>
                    <td>{selectedRequest.reason}</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700">Contact</td>
                    <td>{selectedRequest.contact}</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700">
                      Impact Estimate
                    </td>
                    <td>{selectedRequest.impact_estimate}</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700">Status</td>
                    <td>{selectedRequest.status}</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700">Request ID</td>
                    <td>{selectedRequest.generated_id}</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700">Date</td>
                    <td>
                      {selectedRequest.created_at &&
                        new Date(selectedRequest.created_at).toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700 align-top">
                      Files
                    </td>
                    <td>
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
      </main>
    </div>
  );
}
