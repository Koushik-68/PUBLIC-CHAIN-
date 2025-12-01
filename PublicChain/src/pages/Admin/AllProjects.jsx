import { useState, useEffect } from "react";
import api from "../../axios/api";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import { FaProjectDiagram, FaSyncAlt, FaMapMarkerAlt } from "react-icons/fa";

export default function AllProjects() {
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchProjectsAdmin();
  }, []);

  async function fetchProjectsAdmin() {
    setLoadingProjects(true);
    try {
      const res = await api.get("/api/projects");
      setProjects(res.data.projects || []);
    } catch (err) {
      setProjects([]);
    } finally {
      setLoadingProjects(false);
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
                  <FaProjectDiagram className="text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-semibold text-[#0A3A67]">
                    All Projects
                  </h2>
                  <p className="text-xs md:text-sm text-gray-600 mt-1">
                    List of all registered public projects with budget and
                    status.
                  </p>
                </div>
              </div>

              <button
                className="px-4 md:px-6 py-2 rounded border border-[#0A3A67] bg-[#0A3A67] text-white text-sm md:text-base font-medium hover:bg-[#0c467f] focus:outline-none inline-flex items-center gap-2"
                onClick={fetchProjectsAdmin}
              >
                <FaSyncAlt className={loadingProjects ? "animate-spin" : ""} />
                {loadingProjects ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            {/* Content */}
            {loadingProjects ? (
              <div className="text-center py-10 text-gray-700 text-sm md:text-base">
                Loading projects...
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-10 text-gray-600 border border-dashed border-gray-300 rounded bg-white">
                <p className="text-sm md:text-base">No projects found.</p>
                <p className="text-xs mt-1 text-gray-500">
                  Once departments add projects, they will appear here.
                </p>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-md">
                <div className="px-4 md:px-6 py-3 border-b border-gray-200 flex items-center justify-between text-sm">
                  <span className="text-gray-700">
                    Total projects:{" "}
                    <span className="font-semibold text-[#0A3A67]">
                      {projects.length}
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
                          Project Name
                        </th>
                        <th className="px-3 md:px-4 py-2 border border-gray-300">
                          Department
                        </th>
                        <th className="px-3 md:px-4 py-2 border border-gray-300">
                          Type
                        </th>
                        <th className="px-3 md:px-4 py-2 border border-gray-300">
                          Location
                        </th>
                        <th className="px-3 md:px-4 py-2 border border-gray-300">
                          Budget
                        </th>
                        <th className="px-3 md:px-4 py-2 border border-gray-300">
                          Status
                        </th>
                        <th className="px-3 md:px-4 py-2 border border-gray-300">
                          Start
                        </th>
                        <th className="px-3 md:px-4 py-2 border border-gray-300">
                          End
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((p) => (
                        <tr
                          key={p.id}
                          className="bg-white hover:bg-[#f1f4f8] cursor-pointer"
                          onClick={() => setSelectedProject(p)}
                          title="View details"
                        >
                          <td className="px-3 md:px-4 py-2 border border-gray-300 font-medium truncate max-w-[260px]">
                            {p.project_name}
                          </td>
                          <td className="px-3 md:px-4 py-2 border border-gray-300">
                            {p.department_id}
                          </td>
                          <td className="px-3 md:px-4 py-2 border border-gray-300">
                            {p.type}
                          </td>
                          <td className="px-3 md:px-4 py-2 border border-gray-300">
                            <span className="inline-flex items-center gap-1">
                              <FaMapMarkerAlt className="text-gray-600" />
                              <span>{p.location}</span>
                            </span>
                          </td>
                          <td className="px-3 md:px-4 py-2 border border-gray-300">
                            ₹{p.budget}
                          </td>
                          <td className="px-3 md:px-4 py-2 border border-gray-300">
                            {p.status}
                          </td>
                          <td className="px-3 md:px-4 py-2 border border-gray-300">
                            {p.start_date}
                          </td>
                          <td className="px-3 md:px-4 py-2 border border-gray-300">
                            {p.end_date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Modal for project details */}
          {selectedProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-md p-6 max-w-lg w-full border border-gray-300 relative">
                <button
                  className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl font-bold focus:outline-none"
                  onClick={() => setSelectedProject(null)}
                  title="Close"
                >
                  ×
                </button>
                <h2 className="text-lg font-semibold text-[#0A3A67] mb-4 text-center flex items-center justify-center gap-2">
                  <FaProjectDiagram className="text-gray-700" />
                  Project Details
                </h2>
                <div className="border border-gray-200 rounded-md p-4 bg-[#f9fafb]">
                  <table className="w-full text-xs md:text-sm border-separate border-spacing-y-2">
                    <tbody>
                      <tr>
                        <td className="font-medium text-gray-800 pr-3 align-top w-1/3">
                          Project Name
                        </td>
                        <td className="text-gray-700">
                          {selectedProject.project_name}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-medium text-gray-800 pr-3 align-top">
                          Department
                        </td>
                        <td className="text-gray-700">
                          {selectedProject.department_id}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-medium text-gray-800 pr-3 align-top">
                          Type
                        </td>
                        <td className="text-gray-700">
                          {selectedProject.type}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-medium text-gray-800 pr-3 align-top">
                          Location
                        </td>
                        <td className="text-gray-700">
                          {selectedProject.location}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-medium text-gray-800 pr-3 align-top">
                          Budget
                        </td>
                        <td className="text-gray-700">
                          ₹{selectedProject.budget}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-medium text-gray-800 pr-3 align-top">
                          Status
                        </td>
                        <td className="text-gray-700">
                          {selectedProject.status}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-medium text-gray-800 pr-3 align-top">
                          Start Date
                        </td>
                        <td className="text-gray-700">
                          {selectedProject.start_date}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-medium text-gray-800 pr-3 align-top">
                          End Date
                        </td>
                        <td className="text-gray-700">
                          {selectedProject.end_date}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-medium text-gray-800 pr-3 align-top">
                          Description
                        </td>
                        <td className="text-gray-700">
                          {selectedProject.description}
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
