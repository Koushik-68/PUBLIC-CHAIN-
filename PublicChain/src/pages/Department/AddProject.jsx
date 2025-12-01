// src/pages/Department/AddProject.jsx
import { useEffect, useState, useRef } from "react";
import DepartmentSidebar from "./DepartmentSidebar";
import api from "../../axios/api";
import { useNavigate } from "react-router-dom";

export default function AddProject() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(true);

  const [form, setForm] = useState({
    projectName: "",
    departmentId: "",
    type: "Development", // Development / Maintenance / Scholarship / Other
    location: "",
    budget: "",
    officer: "",
    contact: "",
    startDate: "",
    endDate: "",
    description: "",
    blockchainVerify: true,
    status: "Draft", // Draft / Pending / Active / Completed
  });

  const [files, setFiles] = useState([]); // File objects
  const [filePreviews, setFilePreviews] = useState([]); // preview URLs
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    async function fetchDepartments() {
      setLoadingDepts(true);
      try {
        const res = await api.get("/api/departments");
        if (!mounted) return;
        setDepartments(res.data.departments || []);
      } catch (err) {
        if (mounted) {
          // fallback data
          setDepartments([
            { id: "pwd", name: "Public Works Department" },
            { id: "edu", name: "Education Department" },
            { id: "health", name: "Health Department" },
          ]);
        }
      } finally {
        if (mounted) setLoadingDepts(false);
      }
    }

    fetchDepartments();

    return () => {
      mounted = false;
      filePreviews.forEach((u) => u && URL.revokeObjectURL(u));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // auto-generate simple project id preview (not persisted)
  const projectIdPreview = form.projectName
    ? `PRJ-${form.projectName.replace(/\s+/g, "-").slice(0, 12).toUpperCase()}`
    : "PRJ-XXXX";

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleFilesChange(e) {
    const chosen = Array.from(e.target.files || []);
    const maxFiles = 6;
    const allowed = chosen.slice(0, maxFiles - files.length);
    const newFiles = [...files, ...allowed];
    setFiles(newFiles);

    const newPreviews = allowed.map((f) =>
      f.type.startsWith("image/") ? URL.createObjectURL(f) : null
    );
    setFilePreviews((p) => [...p, ...newPreviews]);
  }

  function removeFile(index) {
    setFiles((old) => old.filter((_, i) => i !== index));
    setFilePreviews((old) => {
      const toRevoke = old[index];
      if (toRevoke) URL.revokeObjectURL(toRevoke);
      return old.filter((_, i) => i !== index);
    });
  }

  function clearForm() {
    setForm({
      projectName: "",
      departmentId: "",
      type: "Development",
      location: "",
      budget: "",
      officer: "",
      contact: "",
      startDate: "",
      endDate: "",
      description: "",
      blockchainVerify: true,
      status: "Draft",
    });
    setFiles([]);
    filePreviews.forEach((u) => u && URL.revokeObjectURL(u));
    setFilePreviews([]);
  }

  async function handleSubmit(e, publish = false) {
    e.preventDefault();

    // basic validation
    if (!form.projectName || !form.departmentId || !form.budget) {
      setMessage({ type: "error", text: "Please fill required fields." });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const payload = new FormData();
      payload.append("projectName", form.projectName);
      payload.append("departmentId", form.departmentId);
      payload.append("type", form.type);
      payload.append("location", form.location);
      payload.append("budget", form.budget);
      payload.append("officer", form.officer);
      payload.append("contact", form.contact);
      payload.append("startDate", form.startDate || "");
      payload.append("endDate", form.endDate || "");
      payload.append("description", form.description || "");
      payload.append("blockchainVerify", form.blockchainVerify ? "1" : "0");
      payload.append("status", publish ? "Pending" : form.status);

      files.forEach((f) => {
        payload.append("documents", f, f.name);
      });

      const res = await api.post("/api/projects", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Add project to blockchain after DB add
      try {
        // Prepare project data for blockchain (no files)
        const blockchainData = {
          projectName: form.projectName,
          departmentId: form.departmentId,
          type: form.type,
          location: form.location,
          budget: form.budget,
          officer: form.officer,
          contact: form.contact,
          startDate: form.startDate,
          endDate: form.endDate,
          description: form.description,
          blockchainVerify: form.blockchainVerify,
          status: publish ? "Pending" : form.status,
        };

        // ✅ Correct API path (with /api prefix)
        await api.post("/api/blockchain/project/add", blockchainData);
      } catch (err) {
        // Optionally show blockchain error, but don't block UI
        console.error("Blockchain add error", err);
      }

      setMessage({
        type: "success",
        text: res.data.message || "Project submitted successfully.",
      });

      clearForm();

      if (publish) {
        setTimeout(() => navigate("/department/projects"), 900);
      }
    } catch (err) {
      console.error("Add project error", err);
      setMessage({
        type: "error",
        text:
          err?.response?.data?.message ||
          "Something went wrong while submitting the project.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  // ---------- JSX RETURN ----------
  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      <DepartmentSidebar />

      <main className="flex-1 p-6 lg:p-10 max-w-6xl mx-auto bg-white border-l border-gray-200">
        {/* header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Add New Project
            </h1>
            <p className="text-xs text-gray-600 mt-1">
              Fill in project details, attach documents, and submit for
              approval.
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-600">Project ID (preview)</div>
            <div className="font-mono text-sm bg-gray-100 px-3 py-1 rounded border border-gray-300 inline-block mt-1">
              {projectIdPreview}
            </div>
          </div>
        </div>

        {/* messages */}
        {message && (
          <div
            className={`mb-6 p-4 rounded border text-sm ${
              message.type === "error"
                ? "bg-red-50 border-red-400 text-red-800"
                : "bg-green-50 border-green-400 text-green-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* left: form */}
          <section className="lg:col-span-2 bg-white rounded-md p-6 shadow-sm border border-gray-200">
            <form
              onSubmit={(e) => handleSubmit(e, false)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-800 font-medium">
                    Project Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    name="projectName"
                    value={form.projectName}
                    onChange={handleChange}
                    className="mt-2 w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600"
                    placeholder="E.g., Primary School Lab Upgrade - District X"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-800 font-medium">
                    Department <span className="text-red-600">*</span>
                  </label>
                  <select
                    name="departmentId"
                    value={form.departmentId}
                    onChange={handleChange}
                    className="mt-2 w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm"
                    required
                  >
                    <option value="">-- Select Department --</option>
                    {loadingDepts ? (
                      <option>Loading...</option>
                    ) : (
                      departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-800 font-medium">
                    Type
                  </label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="mt-2 w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option>Development</option>
                    <option>Maintenance</option>
                    <option>Scholarship</option>
                    <option>Digital Learning</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-800 font-medium">
                    Location
                  </label>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="mt-2 w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm"
                    placeholder="District / City / Village"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-gray-800 font-medium">
                    Budget (₹) <span className="text-red-600">*</span>
                  </label>
                  <input
                    name="budget"
                    value={form.budget}
                    onChange={handleChange}
                    type="number"
                    min="0"
                    step="0.01"
                    className="mt-2 w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm"
                    placeholder="Amount in INR"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-800 font-medium">
                    Officer In Charge
                  </label>
                  <input
                    name="officer"
                    value={form.officer}
                    onChange={handleChange}
                    className="mt-2 w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm"
                    placeholder="Name of the officer"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-800 font-medium">
                    Contact
                  </label>
                  <input
                    name="contact"
                    value={form.contact}
                    onChange={handleChange}
                    className="mt-2 w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm"
                    placeholder="Phone / Email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-800 font-medium">
                    Start Date
                  </label>
                  <input
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    type="date"
                    className="mt-2 w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-800 font-medium">
                    End Date
                  </label>
                  <input
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    type="date"
                    className="mt-2 w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-800 font-medium">
                  Project Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  className="mt-2 w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm"
                  placeholder="Short description, objectives, and expected outcomes"
                />
              </div>

              {/* Upload area */}
              <div className="border-dashed border-2 border-gray-300 rounded-md p-4 bg-gray-50">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <div className="text-sm text-gray-800 font-medium">
                      Upload Documents & Photos
                    </div>
                    <div className="text-xs text-gray-600">
                      PDFs, images, reports (max 6 files)
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFilesChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-2 rounded border border-blue-600 bg-white text-sm text-blue-700 hover:bg-blue-50"
                    >
                      Choose Files
                    </button>
                  </div>
                </div>

                {/* previews */}
                <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
                  {files.length === 0 && (
                    <div className="text-sm text-gray-600">
                      No files uploaded yet.
                    </div>
                  )}
                  {files.map((f, i) => (
                    <div
                      key={i}
                      className="relative bg-white rounded border border-gray-300 p-2"
                    >
                      {filePreviews[i] ? (
                        <img
                          src={filePreviews[i]}
                          alt={f.name}
                          className="w-full h-28 object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-28 flex items-center justify-center text-xs text-gray-700">
                          <div className="text-center">
                            <div className="font-medium break-all">
                              {f.name}
                            </div>
                            <div className="text-xs mt-1 text-gray-500">
                              {(f.size / 1024).toFixed(0)} KB
                            </div>
                          </div>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                        title="Remove file"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4 flex-wrap">
                  <label className="inline-flex items-center gap-2 text-sm text-gray-800">
                    <input
                      type="checkbox"
                      checked={form.blockchainVerify}
                      onChange={(e) =>
                        setForm((s) => ({
                          ...s,
                          blockchainVerify: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 border-gray-400"
                    />
                    <span>Record hash on blockchain</span>
                  </label>

                  <label className="inline-flex items-center gap-2 text-sm text-gray-800">
                    <input
                      type="checkbox"
                      checked={form.status === "Active"}
                      onChange={(e) =>
                        setForm((s) => ({
                          ...s,
                          status: e.target.checked ? "Active" : "Draft",
                        }))
                      }
                      className="h-4 w-4 border-gray-400"
                    />
                    <span>Set Active</span>
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e, false)}
                    disabled={submitting}
                    className="px-4 py-2 rounded border border-gray-400 bg.white text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-70"
                  >
                    Save Draft
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e, true)}
                    disabled={submitting}
                    className="px-4 py-2 rounded bg-blue-700 text-sm text-white font-medium hover:bg-blue-800 disabled:opacity-70"
                  >
                    {submitting ? "Submitting..." : "Submit & Verify"}
                  </button>
                </div>
              </div>
            </form>
          </section>

          {/* right: quick stats / recent projects */}
          <aside className="bg-white rounded-md p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Quick Actions
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded border border-gray-200">
                <div>
                  <div className="text-sm text-gray-700">Your Projects</div>
                  <div className="font-semibold text-xl text-gray-900">24</div>
                </div>
                <button
                  onClick={() => navigate("/department/projects")}
                  className="px-3 py-1 rounded bg-blue-700 text-white text-sm hover:bg-blue-800"
                >
                  Manage
                </button>
              </div>

              <div className="flex items-center justify-between bg-gray-50 p-3 rounded border border-gray-200">
                <div>
                  <div className="text-sm text-gray-700">
                    Pending Verifications
                  </div>
                  <div className="font-semibold text-xl text-orange-700">3</div>
                </div>
                <button
                  onClick={() => navigate("/department/verification")}
                  className="px-3 py-1 rounded bg-orange-600 text-white text-sm hover:bg-orange-700"
                >
                  Verify
                </button>
              </div>

              <div className="flex items-center justify-between bg-gray-50 p-3 rounded border border-gray-200">
                <div>
                  <div className="text-sm text-gray-700">Recent Alerts</div>
                  <div className="font-semibold text-lg text-red-700">1</div>
                </div>
                <button
                  onClick={() => navigate("/department/alerts")}
                  className="px-3 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700"
                >
                  View
                </button>
              </div>
            </div>

            <hr className="my-4 border-gray-200" />

            <div>
              <h4 className="text-sm text-gray-800 font-medium mb-2">Tips</h4>
              <ul className="text-xs text-gray-700 space-y-1 list-disc list-inside">
                <li>Use clear project names for easy search.</li>
                <li>Attach photos & receipts for records.</li>
                <li>Keep budgets and timelines realistic.</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
