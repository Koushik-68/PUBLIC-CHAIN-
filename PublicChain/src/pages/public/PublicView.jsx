import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import api from "../../axios/api";
import { useNavigate } from "react-router-dom";

export default function PublicView() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const navigate = useNavigate();

  // Get all projects from backend
  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await api.get("/api/projects");
        setProjects(res.data.projects || []);
      } catch (err) {
        console.error("Failed to load projects", err);
      }
    }
    fetchProjects();
  }, []);

  // ---- Stats ----
  const totalProjects = projects.length;

  const ongoingProjects = projects.filter(
    (p) => p.status && p.status.toLowerCase() === "ongoing"
  ).length;

  const verifiedProjects = projects.filter(
    (p) => p.blockchain_verify === 1
  ).length;

  const totalBudget = projects.reduce(
    (sum, p) => sum + (parseFloat(p.budget) || 0),
    0
  );

  const stats = [
    { label: "Total Projects", value: totalProjects },
    { label: "Funds Allocated", value: `₹${totalBudget.toLocaleString()}` },
    { label: "Ongoing Projects", value: ongoingProjects },
    { label: "Verified on Blockchain", value: verifiedProjects },
  ];

  const icons = [
    // Total Projects
    <svg
      key="icon-0"
      className="w-8 h-8 text-sky-700"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M4 6h16M4 12h10M4 18h6" />
    </svg>,

    // Funds Allocated
    <svg
      key="icon-1"
      className="w-8 h-8 text-emerald-700"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M12 8c-2.21 0-4 .79-4 3s1.79 3 4 3 4 .79 4 3-1.79 3-4 3" />
      <path d="M12 3v3m0 12v3" />
    </svg>,

    // Ongoing
    <svg
      key="icon-2"
      className="w-8 h-8 text-indigo-700"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l3 3" />
    </svg>,

    // Verified on Blockchain
    <svg
      key="icon-3"
      className="w-8 h-8 text-amber-600"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M5 12l4 4L19 6" />
    </svg>,
  ];

  // Latest updates: show last 3 projects (by start date)
  const filteredUpdates = [...projects]
    .filter(
      (p) =>
        (selectedDepartment === "" || p.department_id === selectedDepartment) &&
        (p.project_name?.toLowerCase().includes(search.toLowerCase()) ||
          p.description?.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
    .slice(0, 4); // latest 3

  // Department-wise fund data
  const departmentTotals = {};
  projects.forEach((p) => {
    const dept = p.department_id || "Unknown";
    const amt = parseFloat(p.budget) || 0;
    departmentTotals[dept] = (departmentTotals[dept] || 0) + amt;
  });
  const departmentLabels = Object.keys(departmentTotals);
  const departmentValues = departmentLabels.map(
    (d) => departmentTotals[d] / 10000000 // just to shrink bar height
  );

  // ---- JSX Part ----
  return (
    <div className="min-h-screen w-full flex flex-row bg-slate-100">
      <Sidebar active="Dashboard" />
      <main className="flex-1 flex flex-col items-center justify-start py-10 px-8">
        <div className="w-full max-w-6xl">
          {/* Page Header */}
          <header className="mb-8 border-b border-slate-200 pb-4">
            <h2 className="text-3xl font-semibold text-slate-900 tracking-tight">
              PublicChain – Public Project Transparency Portal
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-3xl">
              A unified view of public works, funds allocation, and blockchain
              verified projects for citizens.
            </p>
          </header>

          {/* Search Bar */}
          <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-1/2">
              <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
                Search Projects
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by project name or description"
                className="mt-1 w-full px-4 py-2 rounded-lg border border-slate-300 bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-600 focus:border-sky-600 text-slate-800 text-sm"
              />
            </div>
          </div>

          {/* Overview Cards */}
          <section className="mb-10">
            <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">
              Key Indicators
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col items-start justify-between hover:shadow-md transition-shadow"
                >
                  <div className="mb-4 rounded-full bg-slate-50 p-2">
                    {icons[i]}
                  </div>
                  <span
                    className={`text-2xl font-semibold mb-1 ${
                      i === 1
                        ? "text-emerald-700"
                        : i === 2
                        ? "text-indigo-700"
                        : i === 3
                        ? "text-amber-700"
                        : "text-slate-900"
                    }`}
                  >
                    {stat.value}
                  </span>
                  <span className="text-xs text-slate-600 font-medium">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Latest Updates Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-sky-700"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                </svg>
                Latest Project Updates
              </h3>
            </div>

            {/* Department Filter for Updates */}
            <div className="mb-4 flex flex-wrap gap-3 items-center text-sm">
              <label className="font-medium text-slate-700">
                Filter by Department:
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-3 py-1.5 rounded-md border border-slate-300 bg-white text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-sky-600"
              >
                <option value="">All Departments</option>
                {departmentLabels.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {selectedDepartment && (
                <button
                  className="px-3 py-1.5 rounded-md border border-slate-300 bg-slate-50 text-sky-700 font-medium text-xs hover:bg-slate-100"
                  onClick={() => setSelectedDepartment("")}
                  title="Clear department filter"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredUpdates.length === 0 ? (
                <div className="col-span-full text-sm text-slate-500">
                  No recent updates found.
                </div>
              ) : (
                filteredUpdates.map((u, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-2 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="flex items-center gap-2 text-base font-semibold text-slate-900">
                        <svg
                          className="w-4 h-4 text-sky-700"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 8v4l3 3" />
                        </svg>
                        {u.project_name}
                      </span>
                      <span className="text-xs text-slate-500">
                        {u.start_date}
                      </span>
                    </div>
                    <span className="text-sm text-slate-700 line-clamp-3">
                      {u.description}
                    </span>
                    <div className="flex flex-wrap gap-3 text-[11px] text-slate-600 mt-1">
                      <span className="px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200">
                        Department: {u.department_id}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200">
                        Status: {u.status}
                      </span>
                    </div>
                    <button
                      className="mt-3 inline-flex items-center justify-center px-4 py-1.5 rounded-md bg-sky-700 text-white text-xs font-medium shadow-sm hover:bg-sky-800"
                      onClick={() => setSelectedUpdate(u)}
                    >
                      View Details
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Project Details Modal */}
            {selectedUpdate && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-xl shadow-2xl p-6 max-w-lg w-full border border-slate-200 relative text-slate-900">
                  <button
                    className="absolute top-3 right-3 text-slate-500 hover:text-red-500 text-xl font-bold"
                    onClick={() => setSelectedUpdate(null)}
                    title="Close"
                  >
                    ×
                  </button>
                  <h2 className="text-lg font-semibold text-slate-900 mb-4 text-center">
                    Project Details
                  </h2>
                  <table className="w-full text-sm text-slate-800 border-separate border-spacing-y-2">
                    <tbody>
                      <tr>
                        <td className="font-semibold w-1/3">Project Name</td>
                        <td>{selectedUpdate.project_name}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">Department</td>
                        <td>{selectedUpdate.department_id}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">Type</td>
                        <td>{selectedUpdate.type}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">Location</td>
                        <td>{selectedUpdate.location}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">Budget</td>
                        <td>₹{selectedUpdate.budget}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">Officer</td>
                        <td>{selectedUpdate.officer}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">Contact</td>
                        <td>{selectedUpdate.contact}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">Status</td>
                        <td>{selectedUpdate.status}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">Start Date</td>
                        <td>{selectedUpdate.start_date}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">End Date</td>
                        <td>{selectedUpdate.end_date}</td>
                      </tr>
                      <tr>
                        <td className="font-semibold">Blockchain Verified</td>
                        <td>
                          {selectedUpdate.blockchain_verify === 1
                            ? "Yes"
                            : "No"}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-semibold align-top">Description</td>
                        <td>{selectedUpdate.description}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>

          {/* Charts Row */}
          <section className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fund Distribution by Department */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h4 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
                  <svg
                    className="w-4 h-4 text-sky-700"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 7h18M3 12h18M3 17h18" />
                  </svg>
                  Fund Distribution by Department
                </h4>
                <div className="flex items-end h-40 gap-4">
                  {departmentValues.length === 0 ? (
                    <div className="text-sm text-slate-500">
                      No department data available.
                    </div>
                  ) : (
                    departmentValues.map((v, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div
                          className={`w-8 rounded-t-md ${
                            [
                              "bg-sky-600",
                              "bg-emerald-600",
                              "bg-indigo-600",
                              "bg-amber-600",
                              "bg-pink-500",
                              "bg-orange-500",
                              "bg-teal-600",
                              "bg-slate-500",
                            ][i % 8]
                          }`}
                          style={{ height: `${Math.max(20, v * 10)}px` }}
                        ></div>
                        <span className="text-[11px] text-slate-600 mt-2 text-center">
                          {departmentLabels[i]}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Top Budget Project */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h4 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
                  <svg
                    className="w-4 h-4 text-indigo-700"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4l3 3" />
                  </svg>
                  Top Budget Project
                </h4>
                <div className="flex flex-col items-center justify-center h-40">
                  {projects.length > 0 ? (
                    (() => {
                      const topProject = [...projects].sort(
                        (a, b) => parseFloat(b.budget) - parseFloat(a.budget)
                      )[0];
                      return (
                        <div className="text-center">
                          <div className="font-semibold text-base text-slate-900 mb-1">
                            {topProject.project_name}
                          </div>
                          <div className="text-sm text-slate-700 mb-1">
                            <b>
                              Budget: <u>₹{topProject.budget}</u>
                            </b>
                          </div>
                          <div className="text-sm text-slate-700">
                            <b>Department: {topProject.department_id}</b>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="text-sm text-slate-500">No data.</div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action & Feedback */}
          <section className="mt-10 border-t border-slate-200 pt-8">
            <div className="flex flex-col items-center text-center">
              <h3 className="text-xl font-semibold text-emerald-800 mb-2 flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-emerald-700"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 12l2 2l4-4" />
                </svg>
                Transparency & Public Accountability
              </h3>
              <p className="text-sm text-slate-700 mb-4 max-w-xl">
                All verified projects are recorded on the blockchain for public
                audit. Use the options below to explore transparency reports or
                share your feedback as a citizen.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  className="px-6 py-2.5 rounded-md bg-slate-900 text-white text-sm font-medium shadow-sm hover:bg-black inline-flex items-center gap-2"
                  onClick={() => navigate("/public/blockchain-explorer")}
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 12l2 2l4-4" />
                  </svg>
                  Verify on Blockchain
                </button>
                <button
                  className="px-6 py-2.5 rounded-md bg-sky-700 text-white text-sm font-medium shadow-sm hover:bg-sky-800 inline-flex items-center gap-2"
                  onClick={() => navigate("/public/submit-feedback")}
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 20h9" />
                    <path d="M12 4v16" />
                  </svg>
                  Submit Feedback
                </button>
              </div>

              {showFeedback && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                  <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full border border-slate-200 relative text-slate-900">
                    <button
                      className="absolute top-3 right-3 text-slate-500 hover:text-red-500 text-xl font-bold"
                      onClick={() => setShowFeedback(false)}
                      title="Close"
                    >
                      ×
                    </button>
                    <h2 className="text-lg font-semibold text-slate-900 mb-4 text-center">
                      Submit Feedback
                    </h2>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        setShowFeedback(false);
                        alert("Thank you for your feedback!");
                      }}
                    >
                      <textarea
                        className="w-full p-2 border border-slate-300 rounded-md mb-4 text-sm focus:outline-none focus:ring-1 focus:ring-sky-600"
                        rows={4}
                        placeholder="Your feedback..."
                        required
                      />
                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-md bg-sky-700 text-white font-medium text-sm hover:bg-sky-800"
                      >
                        Submit
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
