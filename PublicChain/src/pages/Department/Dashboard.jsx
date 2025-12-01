import DepartmentSidebar from "./DepartmentSidebar";
import { useEffect, useState } from "react";
import api from "../../axios/api";
import { useNavigate } from "react-router-dom";

export default function DepartmentDashboard() {
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  // NEW: project details modal state
  const [selectedProject, setSelectedProject] = useState(null); // NEW

  // NEW: feedback modal state
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [activeFeedback, setActiveFeedback] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    async function fetchProfile() {
      try {
        const res = await api.get("/api/me");
        if (mounted) setUser(res.data.user);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    async function fetchDepartmentProjects() {
      try {
        if (!user || !user.department_name) return;
        const res = await api.get(
          `/api/projects?department=${encodeURIComponent(user.department_name)}`
        );
        setProjects(res.data.projects || []);
      } catch (err) {
        console.error(err);
        setProjects([]);
      }
    }

    async function fetchDepartmentFeedbacks() {
      try {
        if (!user || !user.department_name) return;
        const res = await api.get(
          `/api/feedbacks?department=${encodeURIComponent(
            user.department_name
          )}`
        );
        setFeedbacks(res.data.feedbacks || []);
      } catch (err) {
        console.error(err);
        setFeedbacks([]);
      }
    }

    fetchProfile();

    // When user is loaded, fetch projects + feedbacks
    if (user && user.department_name) {
      fetchDepartmentProjects();
      fetchDepartmentFeedbacks();
    }

    return () => {
      mounted = false;
    };
  }, [navigate, user]);

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  // ---- Stats ----
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
  const verifiedProjects = projects.filter(
    (p) => p.blockchain_verify === 1
  ).length;
  const unresolvedFeedbacks = feedbacks.filter((f) => !f.resolved).length;
  const resolvedFeedbacks = feedbacks.filter((f) => f.resolved).length;

  // Use ViewAllProjects logic for sorting and filtering
  const recentProjects = [...projects]
    .sort((a, b) => {
      // Sort by start_date (desc), fallback to created_at
      const da = a.start_date
        ? new Date(a.start_date).getTime()
        : a.created_at
        ? new Date(a.created_at).getTime()
        : 0;
      const db = b.start_date
        ? new Date(b.start_date).getTime()
        : b.created_at
        ? new Date(b.created_at).getTime()
        : 0;
      return db - da;
    })
    .slice(0, 5);

  const recentFeedbacks = [...feedbacks]
    .sort((a, b) => {
      const da = a.created_at ? new Date(a.created_at).getTime() : 0;
      const db = b.created_at ? new Date(b.created_at).getTime() : 0;
      return db - da;
    })
    .slice(0, 5);

  // open feedback details modal
  function handleViewFeedbackDetails(fb) {
    setActiveFeedback(fb);
    setShowFeedbackModal(true);
  }

  // NEW: open project details modal
  function handleViewProjectDetails(project) {
    setSelectedProject(project);
  }

  // helper to get feedback text
  function getFeedbackText(f) {
    return f.feedback || f.message || f.comment || "No message provided.";
  }

  return (
    <div className="flex w-full min-h-screen bg-gray-100 text-gray-900">
      <DepartmentSidebar />

      {/* Main area fills remaining space (full width next to sidebar) */}
      <main className="flex-1 w-full max-w-full p-8 overflow-x-hidden bg-white border-l border-gray-200">
        <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">
              Department Dashboard
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Government of India &middot; Department Portal
            </p>
          </div>
          <button
            className="ml-4 p-2 rounded-full border border-gray-300 bg-white hover:bg-gray-100 focus:outline-none"
            onClick={() => setShowProfile(true)}
            title="View Profile"
          >
            <svg
              className="w-8 h-8 text-gray-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="8" r="4" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 20c0-2.5 3-4 6-4s6 1.5 6 4"
              />
            </svg>
          </button>
        </div>

        {/* Profile Popup Modal */}
        {showProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg border border-gray-300 relative">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold focus:outline-none"
                onClick={() => setShowProfile(false)}
                title="Close"
              >
                &times;
              </button>
              <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                Profile Details
              </h2>
              {loading ? (
                <div className="text-gray-600">Loading profile...</div>
              ) : user ? (
                <div className="space-y-4 text-gray-800">
                  <div className="flex items-center gap-4">
                    <svg
                      className="w-14 h-14 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="8" r="4" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 20c0-2.5 3-4 6-4s6 1.5 6 4"
                      />
                    </svg>
                    <div>
                      <div className="font-semibold text-lg text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-gray-600 text-sm">{user.email}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                    <div>
                      <span className="font-medium">Role: </span>
                      {user.role}
                    </div>
                    <div>
                      <span className="font-medium">Department: </span>
                      {user.department_name}
                    </div>
                    <div>
                      <span className="font-medium">Type: </span>
                      {user.department_type}
                    </div>
                    <div>
                      <span className="font-medium">Contact: </span>
                      {user.contact_number}
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 mt-4 text-center">
                    Member since:{" "}
                    {user.created_at
                      ? new Date(user.created_at).toLocaleString()
                      : "N/A"}
                  </div>
                  <button
                    onClick={logout}
                    className="w-full mt-6 text-sm font-semibold px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="text-red-600">No user data</div>
              )}
            </div>
          </div>
        )}

        {/* ---- Stats widgets ---- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-md p-5 shadow-sm border border-gray-200">
            <h2 className="text-sm font-medium text-gray-600 mb-1">
              Total Projects
            </h2>
            <p className="text-3xl font-semibold text-gray-900 mb-1">
              {totalProjects}
            </p>
            <p className="text-xs text-gray-600">
              All projects under this department.
            </p>
          </div>

          <div className="bg-white rounded-md p-5 shadow-sm border border-gray-200">
            <h2 className="text-sm font-medium text-gray-600 mb-1">
              Ongoing Projects
            </h2>
            <p className="text-3xl font-semibold text-gray-900 mb-1">
              {ongoingProjects}
            </p>
            <p className="text-xs text-gray-600">
              Projects currently in progress.
            </p>
          </div>

          <div className="bg-white rounded-md p-5 shadow-sm border border-gray-200">
            <h2 className="text-sm font-medium text-gray-600 mb-1">
              Completed Projects
            </h2>
            <p className="text-3xl font-semibold text-gray-900 mb-1">
              {completedProjects}
            </p>
            <p className="text-xs text-gray-600">
              Projects marked as completed.
            </p>
          </div>

          <div className="bg-white rounded-md p-5 shadow-sm border border-gray-200">
            <h2 className="text-sm font-medium text-gray-600 mb-1">
              Total Budget (₹)
            </h2>
            <p className="text-3xl font-semibold text-gray-900 mb-1">
              ₹{totalBudget.toLocaleString()}
            </p>
            <p className="text-xs text-gray-600">
              Total budget allocated to department projects.
            </p>
          </div>

          <div className="bg-white rounded-md p-5 shadow-sm border border-gray-200">
            <h2 className="text-sm font-medium text-gray-600 mb-1">
              Verified Projects
            </h2>
            <p className="text-3xl font-semibold text-gray-900 mb-1">
              {verifiedProjects}
            </p>
            <p className="text-xs text-gray-600">
              Projects verified on the blockchain.
            </p>
          </div>

          <div className="bg-white rounded-md p-5 shadow-sm border border-gray-200">
            <h2 className="text-sm font-medium text-gray-600 mb-1">
              Unresolved Feedbacks
            </h2>
            <p className="text-3xl font-semibold text-gray-900 mb-1">
              {unresolvedFeedbacks}
            </p>
            <p className="text-xs text-gray-600">
              Feedbacks/issues pending resolution.
            </p>
          </div>

          <div className="bg-white rounded-md p-5 shadow-sm border border-gray-200">
            <h2 className="text-sm font-medium text-gray-600 mb-1">
              Resolved Feedbacks
            </h2>
            <p className="text-3xl font-semibold text-gray-900 mb-1">
              {resolvedFeedbacks}
            </p>
            <p className="text-xs text-gray-600">
              Feedbacks/issues marked as resolved.
            </p>
          </div>
        </div>

        {/* Recent Projects + Recent Feedbacks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Projects */}
          <div className="bg-white rounded-md p-5 shadow-sm border border-gray-200">
            {/* header with View All Projects button */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-800">
                Recent Projects
              </h2>
              <button
                className="text-xs text-blue-700 underline hover:text-blue-900"
                onClick={() => navigate("/department/projects")} // adjust path if needed
              >
                View All
              </button>
            </div>

            {recentProjects.length === 0 ? (
              <p className="text-gray-600 text-sm">
                No projects found for this department.
              </p>
            ) : (
              <ul className="space-y-3">
                {recentProjects.map((p) => (
                  <li
                    key={p.id}
                    className="border-b border-gray-200 pb-2 last:border-none"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium text-gray-900 text-sm">
                          {p.title ||
                            p.name ||
                            p.project_name ||
                            "Untitled Project"}
                        </div>
                        <div className="text-xs text-gray-600">
                          {p.location ? p.location + " • " : ""}
                          {p.created_at
                            ? new Date(p.created_at).toLocaleDateString()
                            : "No date"}
                        </div>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border ${
                          p.status && p.status.toLowerCase() === "completed"
                            ? "bg-green-50 text-green-800 border-green-300"
                            : p.status && p.status.toLowerCase() === "ongoing"
                            ? "bg-yellow-50 text-yellow-800 border-yellow-300"
                            : "bg-gray-50 text-gray-800 border-gray-300"
                        }`}
                      >
                        {p.status || "Unknown"}
                      </span>
                    </div>

                    {/* View details button for project */}
                    <div className="flex items-center justify-between mt-1">
                      <div className="text-[11px] text-gray-500">
                        {p.start_date && `Start: ${p.start_date}`}
                      </div>
                      <button
                        onClick={() => handleViewProjectDetails(p)}
                        className="text-[11px] underline text-blue-700 hover:text-blue-900"
                      >
                        View details
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Recent Feedbacks */}
          <div className="bg-white rounded-md p-5 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-800">
                Recent Feedbacks
              </h2>
            </div>
            {recentFeedbacks.length === 0 ? (
              <p className="text-gray-600 text-sm">
                No feedback received yet for this department.
              </p>
            ) : (
              <ul className="space-y-3">
                {recentFeedbacks.map((f) => (
                  <li
                    key={f.id}
                    className="border-b border-gray-200 pb-2 last:border-none"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm text-gray-900 font-medium">
                          {f.citizen_name || "Public User"}
                        </div>
                        <div className="text-xs text-gray-700 mt-1 line-clamp-2">
                          {getFeedbackText(f)}
                        </div>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border ${
                          f.resolved
                            ? "bg-green-50 text-green-800 border-green-300"
                            : "bg-red-50 text-red-800 border-red-300"
                        }`}
                      >
                        {f.resolved ? "Resolved" : "Pending"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <div className="text-[11px] text-gray-500">
                        {(f.created_at || f.submitted_at) &&
                          new Date(
                            f.created_at || f.submitted_at
                          ).toLocaleString()}
                      </div>
                      <button
                        onClick={() => handleViewFeedbackDetails(f)}
                        className="text-[11px] underline text-blue-700 hover:text-blue-900"
                      >
                        View details
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Project Details Modal (tabular, like DepartmentProjects) */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full border border-gray-300 relative">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold"
                onClick={() => setSelectedProject(null)}
                title="Close"
              >
                ×
              </button>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Project Details
              </h2>
              <table className="w-full text-sm text-gray-800 border-separate border-spacing-y-2">
                <tbody>
                  <tr>
                    <td className="font-medium w-1/3 align-top text-gray-700">
                      Project Name
                    </td>
                    <td>
                      {selectedProject.project_name ||
                        selectedProject.title ||
                        selectedProject.name ||
                        "Untitled Project"}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700">Department</td>
                    <td>
                      {selectedProject.department_name ||
                        selectedProject.department_id ||
                        "-"}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700">Type</td>
                    <td>{selectedProject.type || "-"}</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700">Location</td>
                    <td>{selectedProject.location || "-"}</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700">Budget</td>
                    <td>
                      {selectedProject.budget
                        ? `₹${selectedProject.budget}`
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700">Officer</td>
                    <td>{selectedProject.officer || "-"}</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700">Contact</td>
                    <td>{selectedProject.contact || "-"}</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700">Status</td>
                    <td>{selectedProject.status || "-"}</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700">Start Date</td>
                    <td>{selectedProject.start_date || "-"}</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700">End Date</td>
                    <td>{selectedProject.end_date || "-"}</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700">
                      Blockchain Verified
                    </td>
                    <td>
                      {selectedProject.blockchain_verify === 1 ||
                      selectedProject.blockchain_verify === true
                        ? "Yes"
                        : "No"}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700">Description</td>
                    <td>{selectedProject.description || "-"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Feedback Details Modal (table style like SubmitFeedback) */}
        {showFeedbackModal && activeFeedback && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white text-gray-900 rounded-lg shadow-lg p-8 max-w-3xl w-full relative border border-gray-300">
              <button
                className="absolute top-4 right-4 text-xl text-gray-500 hover:text-gray-800"
                onClick={() => {
                  setShowFeedbackModal(false);
                  setActiveFeedback(null);
                }}
              >
                &times;
              </button>

              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Feedback Details
              </h3>

              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 rounded-md text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 border border-gray-300 text-left">
                        Project
                      </th>
                      <th className="px-4 py-2 border border-gray-300 text-left">
                        Citizen
                      </th>
                      <th className="px-4 py-2 border border-gray-300 text-left">
                        Feedback
                      </th>
                      <th className="px-4 py-2 border border-gray-300 text-center">
                        Rating
                      </th>
                      <th className="px-4 py-2 border border-gray-300 text-center">
                        Status
                      </th>
                      <th className="px-4 py-2 border border-gray-300 text-center">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white">
                      <td className="px-4 py-2 border border-gray-300 align-top">
                        {activeFeedback.project ||
                          activeFeedback.project_name ||
                          "-"}
                      </td>
                      <td className="px-4 py-2 border border-gray-300 align-top">
                        {activeFeedback.citizen_name || "Anonymous Citizen"}
                      </td>
                      <td className="px-4 py-2 border border-gray-300 align-top">
                        {getFeedbackText(activeFeedback)}
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-center align-top">
                        {activeFeedback.rating != null
                          ? activeFeedback.rating
                          : "-"}
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-center align-top">
                        {activeFeedback.resolved ? "Resolved" : "Pending"}
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-center align-top">
                        {activeFeedback.created_at ||
                        activeFeedback.submitted_at
                          ? new Date(
                              activeFeedback.created_at ||
                                activeFeedback.submitted_at
                            ).toLocaleString()
                          : "No date"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
