import Sidebar from "../../components/Sidebar";
import { useState, useEffect } from "react";
import api from "../../axios/api";

export default function TrackByLocationDept() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [projects, setProjects] = useState([]);
  const [departments, setDepartments] = useState(["All Departments"]);
  const [states, setStates] = useState(["All States"]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      try {
        const res = await api.get("/api/projects");
        const data = res.data.projects || [];
        setProjects(data);
        // Extract unique departments and states
        const deptSet = new Set(
          data.map((p) => p.department || p.department_name).filter(Boolean)
        );
        setDepartments(["All Departments", ...Array.from(deptSet)]);
        const stateSet = new Set(data.map((p) => p.state).filter(Boolean));
        setStates(["All States", ...Array.from(stateSet)]);
      } catch {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  // Analytics: count projects per department and state
  const deptCounts = departments.slice(1).map((dept) => ({
    name: dept,
    count: projects.filter((p) => {
      return (
        p.department === dept ||
        p.department_name === dept ||
        p.department_id === dept
      );
    }).length,
  }));
  const stateCounts = states.slice(1).map((stateName) => ({
    name: stateName,
    count: projects.filter((p) => {
      return p.state === stateName || p.location === stateName;
    }).length,
  }));

  // Filtered computation based on search & filters
  const filtered = projects.filter((p) => {
    const pname = p.name || p.project_name || "";
    // search by project name (case-insensitive)
    if (search && !pname.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    // department filter
    const deptVal = p.department || p.department_name;
    if (
      department &&
      department !== "All Departments" &&
      deptVal !== department
    ) {
      return false;
    }
    // state filter
    if (state && state !== "All States" && p.state !== state) {
      return false;
    }
    // district filter (partial match)
    if (
      district &&
      !(p.district || "").toLowerCase().includes(district.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen w-full flex flex-row">
      <Sidebar active="Track by Location/Dept" />
      <main className="flex-1 flex flex-col items-center justify-start py-12 px-8 bg-gradient-to-br from-[#e9eafc] to-[#f3f6ff]">
        <div className="w-full max-w-6xl">
          <h2 className="text-3xl font-bold text-[#16213E] mb-6">
            Track Projects by Location / Department
          </h2>
          {/* Analytics charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6">
              <h4 className="text-lg font-semibold text-indigo-700 mb-4">
                Projects by Department
              </h4>
              <div className="flex gap-4 items-end h-24">
                {deptCounts.map((d, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className="w-8 bg-blue-400 rounded-t-xl"
                      style={{ height: `${d.count * 30}px` }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-2">{d.name}</span>
                    <span className="text-xs text-indigo-700 font-bold">
                      {d.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <h4 className="text-lg font-semibold text-indigo-700 mb-4">
                Projects by State
              </h4>
              <div className="flex gap-4 items-end h-24">
                {stateCounts.map((s, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className="w-8 bg-indigo-400 rounded-t-xl"
                      style={{ height: `${s.count * 30}px` }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-2">{s.name}</span>
                    <span className="text-xs text-indigo-700 font-bold">
                      {s.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Search and filter bar */}
          <div className="flex flex-wrap gap-4 mb-8 items-center">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="px-4 py-2 rounded-xl border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-white"
            />
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-white"
            >
              {departments.map((d, i) => (
                <option key={i} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <select
              value={state}
              onChange={(e) => setState(Karnataka)}
              className="px-4 py-2 rounded-xl border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-white"
            >
              {states.map((s, i) => (
                <option key={i} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="District..."
              className="px-4 py-2 rounded-xl border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-white"
            />
          </div>
          {/* Project cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-3 text-center text-indigo-400 text-lg py-12">
                Loading projects...
              </div>
            ) : filtered.length === 0 ? (
              <div className="col-span-3 text-center text-indigo-400 text-lg py-12">
                No projects found.
              </div>
            ) : (
              filtered.map((project, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-2"
                >
                  <h3 className="text-xl font-bold text-blue-700 mb-1">
                    {project.name || project.project_name}
                  </h3>
                  <div className="text-sm text-indigo-700">
                    Department:{" "}
                    {project.department ||
                      project.department_name ||
                      project.department_id ||
                      "-"}
                  </div>
                  <div className="text-sm text-gray-700">
                    State: {project.state || project.location || "-"}
                  </div>
                  <div className="text-sm text-gray-700">
                    District: {project.district || project.location || "-"}
                  </div>
                  <div className="text-sm text-gray-700">
                    Status:{" "}
                    <span
                      className={`font-semibold ${
                        project.status === "Ongoing"
                          ? "text-green-600"
                          : "text-gray-600"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <button
                    className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow hover:scale-105 transition-transform"
                    onClick={() => setSelectedProject(project)}
                  >
                    View Details
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Modal for project details */}
          {selectedProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-md p-6 max-w-lg w-full border border-gray-300 relative">
                <button
                  className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl font-bold"
                  onClick={() => setSelectedProject(null)}
                  title="Close"
                >
                  ×
                </button>
                <h2 className="text-lg font-semibold text-blue-900 mb-4 text-center">
                  Project Details
                </h2>
                <div className="border border-gray-200 rounded-md p-4 bg-[#f9fafb]">
                  <table className="w-full text-xs md:text-sm border-separate border-spacing-y-2 text-gray-800">
                    <tbody>
                      <tr>
                        <td className="font-medium pr-3 align-top w-1/3">
                          Name
                        </td>
                        <td>
                          {selectedProject.name ||
                            selectedProject.project_name ||
                            "-"}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-medium pr-3 align-top">
                          Department
                        </td>
                        <td>
                          {selectedProject.department ||
                            selectedProject.department_name ||
                            "-"}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-medium pr-3 align-top">State</td>
                        <td>{selectedProject.state || "-"}</td>
                      </tr>
                      <tr>
                        <td className="font-medium pr-3 align-top">District</td>
                        <td>{selectedProject.district || "-"}</td>
                      </tr>
                      <tr>
                        <td className="font-medium pr-3 align-top">Status</td>
                        <td>{selectedProject.status || "-"}</td>
                      </tr>
                      <tr>
                        <td className="font-medium pr-3 align-top">Budget</td>
                        <td>
                          {selectedProject.budget
                            ? `₹${selectedProject.budget}`
                            : "-"}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-medium pr-3 align-top">Officer</td>
                        <td>{selectedProject.officer || "-"}</td>
                      </tr>
                      <tr>
                        <td className="font-medium pr-3 align-top">Contact</td>
                        <td>{selectedProject.contact || "-"}</td>
                      </tr>
                      <tr>
                        <td className="font-medium pr-3 align-top">
                          Start Date
                        </td>
                        <td>{selectedProject.start_date || "-"}</td>
                      </tr>
                      <tr>
                        <td className="font-medium pr-3 align-top">End Date</td>
                        <td>{selectedProject.end_date || "-"}</td>
                      </tr>
                      <tr>
                        <td className="font-medium pr-3 align-top">
                          Description
                        </td>
                        <td>{selectedProject.description || "-"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
