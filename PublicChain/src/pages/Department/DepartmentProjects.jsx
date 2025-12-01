// src/pages/Department/DepartmentProjects.jsx
import React, { useEffect, useState } from "react";
import DepartmentSidebar from "./DepartmentSidebar";
import api from "../../axios/api";

export default function DepartmentProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

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

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      <DepartmentSidebar />
      <main className="flex-1 p-8 max-w-6xl mx-auto bg-white border-l border-gray-200">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">
          Department Projects
        </h1>

        {loading && (
          <div className="mb-4 text-sm text-gray-700">Loading projects...</div>
        )}
        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-300 rounded px-3 py-2">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length === 0 ? (
              <div className="col-span-full text-sm text-gray-700">
                No projects found.
              </div>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-md p-5 shadow-sm border border-gray-200 cursor-pointer hover:border-blue-500 hover:shadow-md transition"
                  onClick={() => setSelectedProject(project)}
                  title="View details"
                >
                  <h2 className="text-lg font-medium text-gray-900 mb-2">
                    {project.project_name}
                  </h2>
                  <div className="text-xs text-gray-700 mb-1">
                    <span className="font-semibold">Department: </span>
                    {project.department_id}
                  </div>
                  <div className="text-xs text-gray-700 mb-1">
                    <span className="font-semibold">Type: </span>
                    {project.type}
                  </div>
                  <div className="text-xs text-gray-700 mb-1">
                    <span className="font-semibold">Location: </span>
                    {project.location}
                  </div>
                  <div className="text-xs text-gray-700 mb-1">
                    <span className="font-semibold">Budget: </span>₹
                    {project.budget}
                  </div>
                  <div className="text-xs text-gray-700 mb-1">
                    <span className="font-semibold">Officer: </span>
                    {project.officer}
                  </div>
                  <div className="text-xs text-gray-700 mb-1">
                    <span className="font-semibold">Contact: </span>
                    {project.contact}
                  </div>
                  <div className="text-xs text-gray-700 mb-1">
                    <span className="font-semibold">Status: </span>
                    {project.status}
                  </div>
                  <div className="text-xs text-gray-700 mb-1">
                    <span className="font-semibold">Start: </span>
                    {project.start_date}
                  </div>
                  <div className="text-xs text-gray-700 mb-1">
                    <span className="font-semibold">End: </span>
                    {project.end_date}
                  </div>
                  <div className="text-xs text-gray-700 mb-1">
                    <span className="font-semibold">Blockchain: </span>
                    {project.blockchain_verify === 1 ? "Yes" : "No"}
                  </div>
                  <div className="text-xs text-gray-700 mb-1">
                    <span className="font-semibold">Description: </span>
                    {project.description}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Modal for project details */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-md shadow-xl p-8 max-w-lg w-full border border-gray-300 relative">
              <button
                className="absolute top-3 right-3 text-gray-600 hover:text-red-600 text-2xl font-bold"
                onClick={() => setSelectedProject(null)}
                title="Close"
              >
                ×
              </button>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Project Details
              </h2>
              <table className="w-full text-sm text-gray-800 border-separate border-spacing-y-2">
                <tbody>
                  <tr>
                    <td className="font-medium w-1/3 align-top text-gray-700">
                      Project Name
                    </td>
                    <td>{selectedProject.project_name}</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700">Department</td>
                    <td>{selectedProject.department_id}</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700">Type</td>
                    <td>{selectedProject.type}</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700">Location</td>
                    <td>{selectedProject.location}</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700">Budget</td>
                    <td>₹{selectedProject.budget}</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700">Officer</td>
                    <td>{selectedProject.officer}</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700">Contact</td>
                    <td>{selectedProject.contact}</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700">Status</td>
                    <td>{selectedProject.status}</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700">Start Date</td>
                    <td>{selectedProject.start_date}</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700">End Date</td>
                    <td>{selectedProject.end_date}</td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700">
                      Blockchain Verified
                    </td>
                    <td>
                      {selectedProject.blockchain_verify === 1 ? "Yes" : "No"}
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium text-gray-700">Description</td>
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
