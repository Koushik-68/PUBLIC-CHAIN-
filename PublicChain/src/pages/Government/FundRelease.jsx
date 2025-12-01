import React, { useState } from "react";
import api from "../../axios/api";
import GovernmentSidebar from "./GovernmentSidebar";

export default function FundRelease() {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    department: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      // Send to blockchain API
      const res = await api.post("/api/blockchain/release-fund", {
        title: form.title,
        amount: Number(form.amount),
        department: form.department,
        description: form.description,
      });
      if (res.data.success) {
        setSuccess("Fund released and block added to blockchain!");
        setForm({ title: "", amount: "", department: "", description: "" });
      } else {
        setError("Failed to release fund.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Error releasing fund.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-[#f5f6fa] text-gray-900 font-sans">
      <GovernmentSidebar />

      {/* Full width main content area */}
      <div className="flex-1 w-full p-10">
        <div className="w-full h-full bg-white border border-gray-300 rounded-md p-10 shadow">
          <h2 className="text-2xl font-semibold text-[#0A3A67] mb-8">
            Release Fund
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Fund Title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Amount"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Department
              </label>
              <input
                type="text"
                name="department"
                value={form.department}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Department Name"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Description (optional)"
                rows={4}
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-[#0A3A67] text-white font-semibold py-3 rounded hover:bg-[#0c467f] transition"
                disabled={loading}
              >
                {loading ? "Releasing..." : "Release Fund"}
              </button>

              {success && (
                <div className="text-green-600 text-sm mt-3 text-center">
                  {success}
                </div>
              )}

              {error && (
                <div className="text-red-600 text-sm mt-3 text-center">
                  {error}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
