import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import api from "../../axios/api";
import {
  FaProjectDiagram,
  FaCheckCircle,
  FaSpinner,
  FaRupeeSign,
} from "react-icons/fa";

export default function ViewAllProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      try {
        const res = await api.get("/api/projects");
        setProjects(res.data.projects || []);
      } catch (err) {
        setError("Failed to load projects.");
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  // Widgets logic
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
  // New widgets
  const verifiedProjects = projects.filter(
    (p) => p.blockchain_verify === 1
  ).length;
  const departmentList = Array.from(
    new Set(projects.map((p) => p.department_id))
  ).filter((d) => d && d !== "");
  const departments = departmentList.length;

  // Search and sort logic
  let filteredProjects = projects.filter(
    (p) =>
      (selectedDepartment === "" || p.department_id === selectedDepartment) &&
      (p.project_name?.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase()) ||
        p.department_id?.toLowerCase().includes(search.toLowerCase()))
  );

  filteredProjects = filteredProjects.sort((a, b) => {
    let valA, valB;
    if (sortBy === "name") {
      valA = a.project_name?.toLowerCase() || "";
      valB = b.project_name?.toLowerCase() || "";
    } else if (sortBy === "date") {
      valA = new Date(a.start_date);
      valB = new Date(b.start_date);
    } else if (sortBy === "budget") {
      valA = parseFloat(a.budget) || 0;
      valB = parseFloat(b.budget) || 0;
    } else if (sortBy === "department") {
      valA = a.department_id?.toLowerCase() || "";
      valB = b.department_id?.toLowerCase() || "";
    }
    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="min-h-screen w-full flex flex-row bg-white text-blue-900">
      <Sidebar active="View All Projects" />
      <main className="flex-1 p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-blue-900">
          All Government Projects
        </h1>

        {/* Search and Sort Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center mb-8">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, department, description..."
            className="w-full md:w-1/2 px-4 py-2 rounded-2xl border-2 border-blue-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-white"
          />
          <div className="flex gap-2 items-center">
            <label className="font-semibold text-blue-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2 py-1 rounded border border-blue-200 bg-white"
            >
              <option value="name">Name</option>
              <option value="date">Start Date</option>
              <option value="budget">Budget</option>
              <option value="department">Department</option>
            </select>
            <button
              className="px-2 py-1 rounded border border-blue-200 bg-white"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              title="Toggle sort order"
            >
              {/* else if (sortBy === "department") {
                valA = a.department_id?.toLowerCase() || "";
                valB = b.department_id?.toLowerCase() || "";
              } */}

              {sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </div>
        </div>

        {/* Widgets */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="bg-blue-50 rounded-3xl shadow-xl p-6 flex flex-col items-center border-2 border-blue-100 hover:scale-105 transition-transform group">
            <FaProjectDiagram className="w-8 h-8 text-blue-500 mb-2" />
            <span className="text-2xl font-extrabold text-blue-600 mb-1">
              {totalProjects}
            </span>
            <span className="text-base text-gray-700 font-semibold group-hover:text-blue-700 transition-colors text-center">
              Total Projects
            </span>
          </div>
          <div className="bg-green-50 rounded-3xl shadow-xl p-6 flex flex-col items-center border-2 border-green-100 hover:scale-105 transition-transform group">
            <FaSpinner className="w-8 h-8 text-green-500 mb-2" />
            <span className="text-2xl font-extrabold text-green-600 mb-1">
              {ongoingProjects}
            </span>
            <span className="text-base text-gray-700 font-semibold group-hover:text-green-700 transition-colors text-center">
              Ongoing
            </span>
          </div>
          <div className="bg-indigo-50 rounded-3xl shadow-xl p-6 flex flex-col items-center border-2 border-indigo-100 hover:scale-105 transition-transform group">
            <FaCheckCircle className="w-8 h-8 text-indigo-500 mb-2" />
            <span className="text-2xl font-extrabold text-indigo-600 mb-1">
              {completedProjects}
            </span>
            <span className="text-base text-gray-700 font-semibold group-hover:text-indigo-700 transition-colors text-center">
              Completed
            </span>
          </div>
          <div className="bg-yellow-50 rounded-3xl shadow-xl p-6 flex flex-col items-center border-2 border-yellow-100 hover:scale-105 transition-transform group">
            <FaRupeeSign className="w-8 h-8 text-yellow-500 mb-2" />
            <span className="text-2xl font-extrabold text-yellow-500 mb-1">
              ₹{totalBudget.toLocaleString()}
            </span>
            <span className="text-base text-gray-700 font-semibold group-hover:text-yellow-600 transition-colors text-center">
              Total Budget
            </span>
          </div>
          <div className="bg-indigo-50 rounded-3xl shadow-xl p-6 flex flex-col items-center border-2 border-indigo-100 hover:scale-105 transition-transform group">
            <FaCheckCircle className="w-8 h-8 text-indigo-700 mb-2" />
            <span className="text-2xl font-extrabold text-indigo-700 mb-1">
              {verifiedProjects}
            </span>
            <span className="text-base text-gray-700 font-semibold group-hover:text-indigo-700 transition-colors text-center">
              Verified on Blockchain
            </span>
          </div>
        </div>

        {/* Extra Widget: Departments */}
        <div className="mb-8 flex gap-4 items-center">
          <div className="bg-blue-100 rounded-xl px-6 py-3 shadow text-blue-900 font-bold">
            Departments Involved: {departments}
          </div>
          <div className="flex gap-2 items-center">
            <label className="font-semibold text-blue-700">
              Filter by Department:
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-2 py-1 rounded border border-blue-200 bg-white"
            >
              <option value="">All</option>
              {departmentList.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {selectedDepartment && (
              <button
                className="px-2 py-1 rounded border border-blue-200 bg-white text-blue-700 font-semibold"
                onClick={() => setSelectedDepartment("")}
                title="Clear department filter"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {loading && <div className="mb-4">Loading projects...</div>}
        {error && <div className="mb-4 text-red-400">{error}</div>}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.length === 0 ? (
              <div className="col-span-full text-blue-300">
                No projects found.
              </div>
            ) : (
              filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-xl p-5 shadow border border-blue-400/20 cursor-pointer hover:ring-2 hover:ring-blue-400 transition"
                  onClick={() => setSelectedProject(project)}
                  title="View details"
                >
                  <h2 className="text-lg font-semibold text-blue-700 mb-2">
                    {project.project_name}
                  </h2>
                  <div className="text-xs text-blue-600 mb-1">
                    Department: {project.department_id}
                  </div>
                  <div className="text-xs text-blue-600 mb-1">
                    Type: {project.type}
                  </div>
                  <div className="text-xs text-blue-600 mb-1">
                    Location: {project.location}
                  </div>
                  <div className="text-xs text-blue-600 mb-1">
                    Budget: ₹{project.budget}
                  </div>
                  <div className="text-xs text-blue-600 mb-1">
                    Officer: {project.officer}
                  </div>
                  <div className="text-xs text-blue-600 mb-1">
                    Contact: {project.contact}
                  </div>
                  <div className="text-xs text-blue-600 mb-1">
                    Status: {project.status}
                  </div>
                  <div className="text-xs text-blue-600 mb-1">
                    Start: {project.start_date}
                  </div>
                  <div className="text-xs text-blue-600 mb-1">
                    End: {project.end_date}
                  </div>
                  <div className="text-xs text-blue-600 mb-1">
                    Blockchain: {project.blockchain_verify === 1 ? "Yes" : "No"}
                  </div>
                  <div className="text-xs text-blue-600 mb-1">
                    Description: {project.description}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Modal for project details */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full border border-blue-400/30 relative animate-fade-in text-blue-900">
              <button
                className="absolute top-3 right-3 text-blue-700 hover:text-red-400 text-2xl font-bold"
                onClick={() => setSelectedProject(null)}
                title="Close"
              >
                ×
              </button>
              <h2 className="text-xl font-bold text-blue-900 mb-4 text-center">
                Project Details
              </h2>
              <table className="w-full text-sm text-blue-900 border-separate border-spacing-y-2">
                <tbody>
                  <tr>
                    <td className="font-semibold">Project Name</td>
                    <td>{selectedProject.project_name}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Department</td>
                    <td>{selectedProject.department_id}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Type</td>
                    <td>{selectedProject.type}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Location</td>
                    <td>{selectedProject.location}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Budget</td>
                    <td>₹{selectedProject.budget}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Officer</td>
                    <td>{selectedProject.officer}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Contact</td>
                    <td>{selectedProject.contact}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Status</td>
                    <td>{selectedProject.status}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Start Date</td>
                    <td>{selectedProject.start_date}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">End Date</td>
                    <td>{selectedProject.end_date}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Blockchain Verified</td>
                    <td>
                      {selectedProject.blockchain_verify === 1 ? "Yes" : "No"}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold">Description</td>
                    <td>{selectedProject.description}</td>
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
