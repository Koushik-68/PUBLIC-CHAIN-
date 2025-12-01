import { useState, useEffect } from "react";
import api from "../../axios/api";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import { FaCommentDots, FaSyncAlt, FaEye } from "react-icons/fa";

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  useEffect(() => {
    fetchFeedbacksAdmin();
  }, []);

  async function fetchFeedbacksAdmin() {
    setLoadingFeedbacks(true);
    try {
      const res = await api.get("/api/feedback");
      setFeedbacks(res.data.feedbacks || []);
    } catch (err) {
      setFeedbacks([]);
    } finally {
      setLoadingFeedbacks(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f5f6fa] text-gray-900 font-sans">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-start pt-8 pb-10">
          <div className="w-full max-w-5xl px-4 md:px-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 border-b border-gray-200 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded bg-[#0A3A67] text-white flex items-center justify-center">
                  <FaCommentDots className="text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-semibold text-[#0A3A67]">
                    All Feedbacks ({feedbacks.length})
                  </h2>
                  <p className="text-xs md:text-sm text-gray-600 mt-1">
                    Citizens’ feedback on public projects for transparency and
                    improvement.
                  </p>
                </div>
              </div>

              <button
                className="px-4 md:px-6 py-2 rounded border border-[#0A3A67] bg-[#0A3A67] text-white text-sm md:text-base font-medium hover:bg-[#0c467f] focus:outline-none inline-flex items-center gap-2"
                onClick={fetchFeedbacksAdmin}
              >
                <FaSyncAlt className={loadingFeedbacks ? "animate-spin" : ""} />
                {loadingFeedbacks ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            {/* Content */}
            {loadingFeedbacks ? (
              <div className="text-center py-10 text-gray-700 text-sm md:text-base">
                Loading feedbacks...
              </div>
            ) : feedbacks.length === 0 ? (
              <div className="text-center py-10 text-gray-600 border border-dashed border-gray-300 rounded bg-white">
                <p className="text-sm md:text-base">No feedbacks found.</p>
                <p className="text-xs mt-1 text-gray-500">
                  Once citizens submit feedback on projects, they will appear
                  here.
                </p>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-md">
                <div className="px-4 md:px-6 py-3 border-b border-gray-200 flex items-center justify-between text-sm">
                  <span className="text-gray-700">
                    Total feedbacks:{" "}
                    <span className="font-semibold text-[#0A3A67]">
                      {feedbacks.length}
                    </span>
                  </span>
                </div>
                <div
                  className="overflow-x-auto"
                  style={{ maxHeight: "70vh", overflowY: "auto" }}
                >
                  <table className="w-full text-xs md:text-sm text-left border border-gray-300 border-collapse min-w-[900px] mx-auto">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-3 md:px-4 py-2 border border-gray-300">
                          Project
                        </th>
                        <th className="px-3 md:px-4 py-2 border border-gray-300">
                          Feedback
                        </th>
                        <th className="px-3 md:px-4 py-2 border border-gray-300">
                          Rating
                        </th>
                        <th className="px-3 md:px-4 py-2 border border-gray-300">
                          Date
                        </th>
                        <th className="px-3 md:px-4 py-2 border border-gray-300 text-center">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {feedbacks.map((f) => (
                        <tr
                          key={f.id}
                          className="bg-white hover:bg-[#f1f4f8] cursor-pointer"
                          onClick={() => setSelectedFeedback(f)}
                          title="View details"
                        >
                          <td className="px-3 md:px-4 py-2 border border-gray-300 font-medium truncate max-w-[220px]">
                            {f.project}
                          </td>
                          <td className="px-3 md:px-4 py-2 border border-gray-300 truncate max-w-[320px]">
                            {f.feedback}
                          </td>
                          <td className="px-3 md:px-4 py-2 border border-gray-300">
                            {f.rating}
                          </td>
                          <td className="px-3 md:px-4 py-2 border border-gray-300">
                            {f.submitted_at &&
                              new Date(f.submitted_at).toLocaleString()}
                          </td>
                          <td className="px-3 md:px-4 py-2 border border-gray-300 text-center">
                            <span className="inline-flex items-center gap-1 text-[#0A3A67] text-xs md:text-sm">
                              <FaEye />
                              <span>View</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Modal for feedback details */}
          {selectedFeedback && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-md shadow-md p-6 max-w-lg w-full border border-gray-300 relative">
                <button
                  className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl font-bold focus:outline-none"
                  onClick={() => setSelectedFeedback(null)}
                  title="Close"
                >
                  ×
                </button>
                <h2 className="text-lg font-semibold text-[#0A3A67] mb-4 text-center flex items-center justify-center gap-2">
                  <FaCommentDots className="text-gray-700" />
                  Feedback Details
                </h2>
                <div className="border border-gray-200 rounded-md p-4 bg-[#f9fafb]">
                  <table className="w-full text-xs md:text-sm border-separate border-spacing-y-2">
                    <tbody>
                      <tr>
                        <td className="font-medium text-gray-800 pr-3 align-top w-1/3">
                          Project
                        </td>
                        <td className="text-gray-700">
                          {selectedFeedback.project}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-medium text-gray-800 pr-3 align-top">
                          Feedback
                        </td>
                        <td className="text-gray-700">
                          {selectedFeedback.feedback}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-medium text-gray-800 pr-3 align-top">
                          Rating
                        </td>
                        <td className="text-gray-700">
                          {selectedFeedback.rating}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-medium text-gray-800 pr-3 align-top">
                          Date
                        </td>
                        <td className="text-gray-700">
                          {selectedFeedback.submitted_at &&
                            new Date(
                              selectedFeedback.submitted_at
                            ).toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
