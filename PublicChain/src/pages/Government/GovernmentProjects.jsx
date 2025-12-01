// src/pages/Government/GovernmentProjects.jsx
import React, { useEffect, useState } from "react";
import GovernmentSidebar from "./GovernmentSidebar";
import api from "../../axios/api";

export default function GovernmentProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      try {
        // Government can view all projects
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

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <GovernmentSidebar />

      <main className="flex-1 p-8 max-w-6xl mx-auto bg-white border-l border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              All Projects
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              View and review all projects registered under various departments.
            </p>
          </div>
          {projects.length > 0 && !loading && !error && (
            <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              Total Projects: {projects.length}
            </span>
          )}
        </div>

        {loading && (
          <div className="mb-4 text-sm text-slate-700">Loading projects...</div>
        )}

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-300 rounded px-3 py-2">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length === 0 ? (
              <div className="col-span-full text-sm text-slate-700">
                No projects found.
              </div>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-md p-5 shadow-sm border border-slate-200 cursor-pointer hover:border-blue-600 hover:shadow-md transition"
                  onClick={() => setSelectedProject(project)}
                  title="View details"
                >
                  <h2 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2">
                    {project.project_name}
                  </h2>

                  <div className="text-xs text-slate-700 mb-1">
                    <span className="font-semibold">Department: </span>
                    {project.department_id}
                  </div>
                  <div className="text-xs text-slate-700 mb-1">
                    <span className="font-semibold">Type: </span>
                    {project.type}
                  </div>
                  <div className="text-xs text-slate-700 mb-1">
                    <span className="font-semibold">Location: </span>
                    {project.location}
                  </div>
                  <div className="text-xs text-slate-700 mb-1">
                    <span className="font-semibold">Budget: </span>₹
                    {project.budget}
                  </div>
                  <div className="text-xs text-slate-700 mb-1">
                    <span className="font-semibold">Officer: </span>
                    {project.officer}
                  </div>
                  <div className="text-xs text-slate-700 mb-1">
                    <span className="font-semibold">Status: </span>
                    {project.status}
                  </div>
                  <div className="text-xs text-slate-700 mb-1">
                    <span className="font-semibold">Duration: </span>
                    {project.start_date} – {project.end_date}
                  </div>
                  <div className="text-xs text-slate-700 mb-1">
                    <span className="font-semibold">Blockchain: </span>
                    {project.blockchain_verify === 1
                      ? "Verified"
                      : "Not Verified"}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Modal for project details */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-md shadow-xl p-8 max-w-lg w-full border border-slate-300 relative">
              <button
                className="absolute top-3 right-3 text-slate-600 hover:text-red-600 text-2xl font-bold"
                onClick={() => setSelectedProject(null)}
                title="Close"
              >
                ×
              </button>
              <h2 className="text-xl font-semibold text-slate-900 mb-4 text-center">
                Project Details
              </h2>
              <table className="w-full text-sm text-slate-800 border-separate border-spacing-y-2">
                <tbody>
                  <tr>
                    <td className="font-medium w-1/3 align-top text-slate-700">
                      Project Name
                    </td>
                    <td>{selectedProject.project_name}</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-slate-700">Department</td>
                    <td>{selectedProject.department_id}</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-slate-700">Type</td>
                    <td>{selectedProject.type}</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-slate-700">Location</td>
                    <td>{selectedProject.location}</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-slate-700">Budget</td>
                    <td>₹{selectedProject.budget}</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-slate-700">Officer</td>
                    <td>{selectedProject.officer}</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-slate-700">Contact</td>
                    <td>{selectedProject.contact}</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-slate-700">Status</td>
                    <td>{selectedProject.status}</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-slate-700">Start Date</td>
                    <td>{selectedProject.start_date}</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-slate-700">End Date</td>
                    <td>{selectedProject.end_date}</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-slate-700">
                      Blockchain Verified
                    </td>
                    <td>
                      {selectedProject.blockchain_verify === 1 ? "Yes" : "No"}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium text-slate-700">Description</td>
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
