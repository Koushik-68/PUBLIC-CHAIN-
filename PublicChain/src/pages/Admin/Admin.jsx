import { useEffect, useState, useRef } from "react";
import api from "../../axios/api";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import {
  FaUsersCog,
  FaUserClock,
  FaProjectDiagram,
  FaMoneyBillWave,
  FaCommentDots,
  FaTasks,
  FaCheckCircle,
  FaChartPie,
  FaSyncAlt,
} from "react-icons/fa";

export default function Admin() {
  const [pending, setPending] = useState([]);
  const [verified, setVerified] = useState([]);
  const [projects, setProjects] = useState([]);
  const [fundRequests, setFundRequests] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showPending, setShowPending] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [showFundRequests, setShowFundRequests] = useState(false);
  const [showFeedbacks, setShowFeedbacks] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingFundRequests, setLoadingFundRequests] = useState(false);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);
  const pollingRef = useRef();

  // Real-time polling every 10s
  useEffect(() => {
    fetchAllData();
    pollingRef.current = setInterval(fetchAllData, 10000);
    return () => clearInterval(pollingRef.current);
  }, []);

  async function fetchAllData() {
    setLoading(true);
    try {
      const [pendingRes, verifiedRes, projectsRes, fundRes, feedbackRes] =
        await Promise.all([
          api.get("/api/admin/pending-users"),
          api.get("/api/admin/verified-users"),
          api.get("/api/projects"),
          api.get("/api/fund-requests"),
          api.get("/api/feedback"),
        ]);
      setPending(pendingRes.data.users || []);
      setVerified(verifiedRes.data.users || []);
      setProjects(projectsRes.data.projects || []);
      setFundRequests(fundRes.data.requests || []);
      setFeedbacks(feedbackRes.data.feedbacks || []);
    } catch (err) {
      setMessage("Failed to load some data");
    } finally {
      setLoading(false);
    }
  }

  async function verify(userId) {
    setMessage(null);
    try {
      const res = await api.post("/api/admin/verify-user", { userId });
      const { username, password } = res.data;
      setMessage(
        `Verified user ${userId}. Username: ${username} Password: ${password}`
      );
      setPending((p) => p.filter((u) => u.id !== userId));
      fetchAllData();
    } catch (err) {
      setMessage(err.response?.data?.message || "Verify failed");
    }
  }

  // --- Widgets ---
  const totalPending = pending.length;
  const totalVerified = verified.length;
  const totalProjects = projects.length;
  const ongoingProjects = projects.filter(
    (p) => p.status && p.status.toLowerCase() === "ongoing"
  ).length;
  const completedProjects = projects.filter(
    (p) => p.status && p.status.toLowerCase() === "completed"
  ).length;
  const totalBudget = projects.reduce(
    (sum, p) => sum + (parseFloat(p.budget) || 0),
    0
  );
  const totalFundRequests = fundRequests.length;
  const totalFeedbacks = feedbacks.length;
  const unresolvedFeedbacks = feedbacks.filter((f) => !f.resolved).length;
  const resolvedFeedbacks = feedbacks.filter((f) => f.resolved).length;

  // --- Recent Activity Log ---
  const recentActivity = [
    ...pending.slice(0, 2).map((u) => ({
      type: "Pending Registration",
      text: `${u.department_name} (${u.state})`,
    })),
    ...fundRequests.slice(0, 2).map((r) => ({
      type: "Fund Request",
      text: `${r.title} - ₹${r.amount}`,
    })),
    ...feedbacks
      .slice(0, 2)
      .map((f) => ({ type: "Feedback", text: `${f.project}: ${f.feedback}` })),
    ...projects.slice(0, 2).map((p) => ({
      type: "Project",
      text: `${p.project_name} (${p.status})`,
    })),
  ];

  return (
    <div className="flex min-h-screen bg-[#f5f6fa] text-gray-900 font-sans">
      <AdminSidebar />
      <div className="flex-1">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 border-b border-gray-200 pb-4">
            <div>
              <h2 className="flex items-center gap-3 text-2xl md:text-3xl font-semibold text-[#0A3A67]">
                <span className="h-10 w-10 rounded bg-[#0A3A67] text-white flex items-center justify-center text-lg font-bold">
                  A
                </span>
                Admin Portal
              </h2>
              <p className="text-sm md:text-base text-gray-600 mt-2 max-w-xl">
                Central dashboard for monitoring department registrations,
                projects, fund requests and citizen feedback in real time.
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button
                onClick={fetchAllData}
                className="inline-flex items-center gap-2 px-4 py-2 border border-[#0A3A67] bg-[#0A3A67] text-white text-xs md:text-sm font-medium rounded hover:bg-[#0c467f] focus:outline-none"
              >
                <FaSyncAlt className={loading ? "animate-spin" : ""} />
                {loading ? "Refreshing data..." : "Refresh"}
              </button>
              {/* Status line (optional) */}
              {/* <div className="text-xs text-gray-500">
                Data refreshed automatically every few seconds.
              </div> */}
            </div>
          </div>

          {/* Widgets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Pending */}
            <div className="bg-white border border-gray-200 rounded-md p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <FaUserClock className="text-gray-600" />
                  <span>Pending Registrations</span>
                </div>
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  Departments
                </span>
              </div>
              <div className="text-2xl font-semibold text-[#0A3A67]">
                {totalPending}
              </div>
              <button
                className="mt-3 w-full px-3 py-2 text-sm border border-[#0A3A67] bg-[#0A3A67] text-white rounded hover:bg-[#0c467f] focus:outline-none"
                onClick={() => setShowPending(true)}
              >
                Review Pending
              </button>
            </div>

            {/* Verified */}
            <div className="bg-white border border-gray-200 rounded-md p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <FaUsersCog className="text-gray-600" />
                  <span>Verified Departments</span>
                </div>
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  Users
                </span>
              </div>
              <div className="text-2xl font-semibold text-[#0A3A67]">
                {totalVerified}
              </div>
              <button
                className="mt-3 w-full px-3 py-2 text-sm border border-[#0A3A67] bg-[#0A3A67] text-white rounded hover:bg-[#0c467f] focus:outline-none"
                onClick={() => (window.location.href = "/admin/verified-users")}
              >
                Open List
              </button>
            </div>

            {/* Projects */}
            <div className="bg-white border border-gray-200 rounded-md p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <FaProjectDiagram className="text-gray-600" />
                  <span>Projects</span>
                </div>
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  Overview
                </span>
              </div>
              <div className="text-2xl font-semibold text-[#0A3A67]">
                {totalProjects}
              </div>
              <button
                className="mt-3 w-full px-3 py-2 text-sm border border-[#0A3A67] bg-[#0A3A67] text-white rounded hover:bg-[#0c467f] focus:outline-none"
                onClick={() => setShowProjects(true)}
              >
                View Projects
              </button>
            </div>

            {/* Fund Requests */}
            <div className="bg-white border border-gray-200 rounded-md p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <FaMoneyBillWave className="text-gray-600" />
                  <span>Fund Requests</span>
                </div>
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  Finance
                </span>
              </div>
              <div className="text-2xl font-semibold text-[#0A3A67]">
                {totalFundRequests}
              </div>
              <button
                className="mt-3 w-full px-3 py-2 text-sm border border-[#0A3A67] bg-[#0A3A67] text-white rounded hover:bg-[#0c467f] focus:outline-none"
                onClick={() => setShowFundRequests(true)}
              >
                Review Requests
              </button>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white border border-gray-200 rounded-md p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-1 text-sm text-gray-700">
                <FaTasks className="text-gray-600" />
                <span>Ongoing Projects</span>
              </div>
              <div className="text-xl font-semibold text-[#0A3A67]">
                {ongoingProjects}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-md p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-1 text-sm text-gray-700">
                <FaCheckCircle className="text-gray-600" />
                <span>Completed</span>
              </div>
              <div className="text-xl font-semibold text-[#0A3A67]">
                {completedProjects}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-md p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-1 text-sm text-gray-700">
                <FaChartPie className="text-gray-600" />
                <span>Total Budget</span>
              </div>
              <div className="text-xl font-semibold text-[#0A3A67]">
                ₹{totalBudget.toLocaleString()}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-md p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-1 text-sm text-gray-700">
                <FaCommentDots className="text-gray-600" />
                <span>Unresolved Feedbacks</span>
              </div>
              <div className="text-xl font-semibold text-[#0A3A67]">
                {unresolvedFeedbacks}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <button
              className="px-4 py-2 text-sm border border-[#0A3A67] bg-[#0A3A67] text-white rounded hover:bg-[#0c467f] focus:outline-none"
              onClick={() => setShowPending(true)}
            >
              Verify Pending Registrations
            </button>
            <button
              className="px-4 py-2 text-sm border border-[#0A3A67] bg-white text-[#0A3A67] rounded hover:bg-[#e6edf4] focus:outline-none"
              onClick={() => setShowProjects(true)}
            >
              View All Projects
            </button>
            <button
              className="px-4 py-2 text-sm border border-[#0A3A67] bg-white text-[#0A3A67] rounded hover:bg-[#e6edf4] focus:outline-none"
              onClick={() => setShowFundRequests(true)}
            >
              View Fund Requests
            </button>
            <button
              className="px-4 py-2 text-sm border border-[#0A3A67] bg-white text-[#0A3A67] rounded hover:bg-[#e6edf4] focus:outline-none"
              onClick={() => setShowFeedbacks(true)}
            >
              View Feedbacks ({totalFeedbacks})
            </button>
          </div>

          {/* Recent Activity Log */}
          <div className="bg-white border border-gray-200 rounded-md p-4 mb-6">
            <h3 className="text-base font-semibold text-[#0A3A67] mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#0A3A67]" />
              Recent Activity
            </h3>
            <ul className="space-y-2 text-sm">
              {recentActivity.length === 0 ? (
                <li className="text-gray-500">No recent activity recorded.</li>
              ) : (
                recentActivity.map((a, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gray-500" />
                    <div>
                      <div className="font-medium text-gray-800">{a.type}</div>
                      <div className="text-gray-600">{a.text}</div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Message Box for Errors/Success */}
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

          {/* Modal: Pending Registrations */}
          {showPending && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-md p-6 max-w-2xl w-full border border-gray-300 relative">
                <button
                  className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl font-bold focus:outline-none"
                  onClick={() => setShowPending(false)}
                  title="Close"
                >
                  &times;
                </button>
                <h3 className="text-lg font-semibold text-[#0A3A67] mb-4 border-b border-gray-200 pb-2">
                  Pending Department Registrations ({pending.length})
                </h3>
                {loading ? (
                  <div className="text-center py-8 text-gray-600">
                    Loading registrations...
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                    {pending.length === 0 && (
                      <div className="text-center py-6 text-gray-500 border border-dashed border-gray-300 rounded">
                        All clear. No pending registrations.
                      </div>
                    )}
                    {pending.map((u) => (
                      <div
                        key={u.id}
                        className="border border-gray-200 rounded p-4 text-sm bg-gray-50"
                      >
                        <div className="font-semibold text-gray-900 mb-1">
                          {u.department_name}
                        </div>
                        <div className="text-gray-700 mb-1">
                          {u.department_type} -{" "}
                          <span className="text-gray-600">
                            {u.state}, {u.district}
                          </span>
                        </div>
                        <div className="text-gray-700 space-y-0.5">
                          <p>
                            <span className="font-medium">Head: </span>
                            {u.head_name}
                          </p>
                          <p>
                            <span className="font-medium">Email: </span>
                            {u.email}
                          </p>
                          <p>
                            <span className="font-medium">Contact: </span>
                            {u.contact_number}
                          </p>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          Registered:{" "}
                          {u.created_at
                            ? new Date(u.created_at).toLocaleString()
                            : "N/A"}
                        </div>
                        <div className="mt-3">
                          <button
                            onClick={() => verify(u.id)}
                            className="px-3 py-2 text-sm border border-[#0A3A67] bg-[#0A3A67] text-white rounded hover:bg-[#0c467f] focus:outline-none"
                          >
                            Verify &amp; Generate Credentials
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Modal: All Projects */}
          {showProjects && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-md shadow-md p-6 max-w-4xl w-full border border-gray-300 relative">
                <button
                  className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl font-bold focus:outline-none"
                  onClick={() => setShowProjects(false)}
                  title="Close"
                >
                  ×
                </button>
                <h2 className="text-lg font-semibold text-[#0A3A67] mb-4 text-center">
                  All Projects
                </h2>
                {loadingProjects ? (
                  <div className="text-center py-8 text-gray-600">
                    Loading projects...
                  </div>
                ) : (
                  <div className="overflow-x-auto max-h-[60vh]">
                    <table className="w-full text-xs md:text-sm border border-gray-300 border-collapse">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="border border-gray-300 px-2 py-2 text-left">
                            Project Name
                          </th>
                          <th className="border border-gray-300 px-2 py-2 text-left">
                            Department
                          </th>
                          <th className="border border-gray-300 px-2 py-2 text-left">
                            Type
                          </th>
                          <th className="border border-gray-300 px-2 py-2 text-left">
                            Status
                          </th>
                          <th className="border border-gray-300 px-2 py-2 text-left">
                            Budget
                          </th>
                          <th className="border border-gray-300 px-2 py-2 text-left">
                            Start
                          </th>
                          <th className="border border-gray-300 px-2 py-2 text-left">
                            End
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects.map((p) => (
                          <tr key={p.id} className="bg-white">
                            <td className="border border-gray-300 px-2 py-1">
                              {p.project_name}
                            </td>
                            <td className="border border-gray-300 px-2 py-1">
                              {p.department_id}
                            </td>
                            <td className="border border-gray-300 px-2 py-1">
                              {p.type}
                            </td>
                            <td className="border border-gray-300 px-2 py-1">
                              {p.status}
                            </td>
                            <td className="border border-gray-300 px-2 py-1">
                              ₹{p.budget}
                            </td>
                            <td className="border border-gray-300 px-2 py-1">
                              {p.start_date}
                            </td>
                            <td className="border border-gray-300 px-2 py-1">
                              {p.end_date}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Modal: Fund Requests */}
          {showFundRequests && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-md shadow-md p-6 max-w-3xl w-full border border-gray-300 relative">
                <button
                  className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl font-bold focus:outline-none"
                  onClick={() => setShowFundRequests(false)}
                  title="Close"
                >
                  ×
                </button>
                <h2 className="text-lg font-semibold text-[#0A3A67] mb-4 text-center">
                  All Fund Requests
                </h2>
                {loadingFundRequests ? (
                  <div className="text-center py-8 text-gray-600">
                    Loading fund requests...
                  </div>
                ) : (
                  <div className="overflow-x-auto max-h-[60vh]">
                    <table className="w-full text-xs md:text-sm border border-gray-300 border-collapse">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="border border-gray-300 px-2 py-2 text-left">
                            Department
                          </th>
                          <th className="border border-gray-300 px-2 py-2 text-left">
                            Title
                          </th>
                          <th className="border border-gray-300 px-2 py-2 text-left">
                            Amount
                          </th>
                          <th className="border border-gray-300 px-2 py-2 text-left">
                            Urgency
                          </th>
                          <th className="border border-gray-300 px-2 py-2 text-left">
                            Status
                          </th>
                          <th className="border border-gray-300 px-2 py-2 text-left">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {fundRequests.map((r) => (
                          <tr key={r.id}>
                            <td className="border border-gray-300 px-2 py-1">
                              {r.department}
                            </td>
                            <td className="border border-gray-300 px-2 py-1">
                              {r.title}
                            </td>
                            <td className="border border-gray-300 px-2 py-1">
                              ₹{r.amount}
                            </td>
                            <td className="border border-gray-300 px-2 py-1">
                              {r.urgency}
                            </td>
                            <td className="border border-gray-300 px-2 py-1">
                              {r.status}
                            </td>
                            <td className="border border-gray-300 px-2 py-1">
                              {r.created_at &&
                                new Date(r.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Modal: Feedbacks */}
          {showFeedbacks && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-md shadow-md p-6 max-w-2xl w-full border border-gray-300 relative">
                <button
                  className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl font-bold focus:outline-none"
                  onClick={() => setShowFeedbacks(false)}
                  title="Close"
                >
                  ×
                </button>
                <h2 className="text-lg font-semibold text-[#0A3A67] mb-4 text-center">
                  All Feedbacks
                </h2>
                {loadingFeedbacks ? (
                  <div className="text-center py-8 text-gray-600">
                    Loading feedbacks...
                  </div>
                ) : (
                  <div className="overflow-x-auto max-h-[60vh]">
                    <table className="w-full text-xs md:text-sm border border-gray-300 border-collapse">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="border border-gray-300 px-2 py-2 text-left">
                            Project
                          </th>
                          <th className="border border-gray-300 px-2 py-2 text-left">
                            Feedback
                          </th>
                          <th className="border border-gray-300 px-2 py-2 text-left">
                            Rating
                          </th>
                          <th className="border border-gray-300 px-2 py-2 text-left">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {feedbacks.map((f) => (
                          <tr key={f.id}>
                            <td className="border border-gray-300 px-2 py-1">
                              {f.project}
                            </td>
                            <td className="border border-gray-300 px-2 py-1">
                              {f.feedback}
                            </td>
                            <td className="border border-gray-300 px-2 py-1">
                              {f.rating}
                            </td>
                            <td className="border border-gray-300 px-2 py-1">
                              {f.submitted_at &&
                                new Date(f.submitted_at).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-6 text-center text-xs md:text-sm text-gray-500">
            <p>PublicChain – Administrative Dashboard &amp; Audit Log</p>
          </div>
        </div>
      </div>
    </div>
  );
}
