import Sidebar from "../../components/Sidebar";
import React, { useState } from "react";
import axios from "../../axios/api";
import {
  FaStar,
  FaRegStar,
  FaCheckCircle,
  FaChartBar,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaUsers,
  FaCommentDots,
  FaFolderOpen,
} from "react-icons/fa";

export default function SubmitFeedback() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showFeedbacks, setShowFeedbacks] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);

  // Fetch projects from backend
  React.useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await axios.get("/api/projects");
        setProjects(res.data.projects || []);
      } catch (err) {
        setProjects([]);
      }
    }
    fetchProjects();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await axios.post("/api/feedback", {
        project: selectedProject,
        feedback,
        rating,
      });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setFeedback("");
      setRating(0);
      setSelectedProject("");
    } catch (err) {
      alert("Failed to submit feedback. Please try again.");
    }
  }

  async function handleViewFeedbacks() {
    setShowFeedbacks(true);
    setLoadingFeedbacks(true);
    try {
      const res = await axios.get("/api/feedbacks");
      setFeedbacks(res.data.feedbacks || []);
    } catch (err) {
      setFeedbacks([]);
    }
    setLoadingFeedbacks(false);
  }

  return (
    <div className="min-h-screen w-full flex flex-row bg-gradient-to-br from-[#e9eafc] to-[#f3f6ff] scroll-smooth">
      <Sidebar active="Submit Feedback" />
      <main className="flex-1 flex flex-col items-center justify-start py-12 px-8">
        <div className="w-full max-w-xl">
          <h2 className="text-3xl font-bold text-[#16213E] mb-6 flex items-center gap-3">
            <FaCommentDots className="text-indigo-400 w-8 h-8" /> Submit
            Feedback
            <button
              type="button"
              onClick={handleViewFeedbacks}
              className="px-5 py-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold shadow-lg hover:scale-105 transition-transform text-sm"
            >
              View Feedbacks
            </button>
          </h2>
          <form
            onSubmit={handleSubmit}
            className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-10 flex flex-col gap-8 border-2 border-blue-100"
          >
            <div>
              <label className="block text-sm font-semibold text-indigo-700 mb-2 flex items-center gap-2">
                <FaFolderOpen className="text-blue-400 w-5 h-5" /> Select
                Project
              </label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-2xl border-2 border-blue-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-white"
              >
                <option value="">Choose a project...</option>
                {projects.length === 0 ? (
                  <option disabled>Loading projects...</option>
                ) : (
                  projects.map((p) => (
                    <option key={p.id} value={p.project_name}>
                      {p.project_name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-indigo-700 mb-2 flex items-center gap-2">
                <FaChartBar className="text-indigo-400 w-5 h-5" /> Your Feedback
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
                rows={4}
                placeholder="Share your thoughts, issues, or suggestions..."
                className="w-full px-4 py-2 rounded-2xl border-2 border-blue-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-indigo-700 mb-2 flex items-center gap-2">
                <FaStar className="text-yellow-400 w-5 h-5" /> Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-3xl transition-transform duration-150 ${
                      star <= rating
                        ? "text-yellow-400 scale-110"
                        : "text-gray-300"
                    }`}
                  >
                    {star <= rating ? <FaStar /> : <FaRegStar />}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold shadow-lg hover:scale-105 transition-transform text-lg"
              >
                <FaCheckCircle className="inline-block mr-2 text-green-300" />{" "}
                Submit Feedback
              </button>
            </div>
            {submitted && (
              <div className="text-green-600 font-semibold text-center mt-2 animate-bounce flex items-center justify-center gap-2">
                <FaCheckCircle className="text-green-400 w-5 h-5" /> Thank you
                for your feedback!
              </div>
            )}
          </form>
          {/* Feedbacks Modal */}
          {showFeedbacks && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white text-gray-800 rounded-2xl shadow-2xl p-8 max-w-2xl w-full relative max-h-[80vh] overflow-y-auto scroll-smooth">
                <button
                  className="absolute top-4 right-4 text-xl text-gray-500 hover:text-red-500"
                  onClick={() => setShowFeedbacks(false)}
                >
                  &times;
                </button>

                <h3 className="text-2xl font-bold text-indigo-700 mb-4">
                  All Feedbacks
                </h3>

                {loadingFeedbacks ? (
                  <div className="text-center text-indigo-500 font-medium">
                    Loading...
                  </div>
                ) : feedbacks.length === 0 ? (
                  <div className="text-center text-gray-500">
                    No feedbacks found.
                  </div>
                ) : (
                  <div className="overflow-x-auto scroll-smooth">
                    <table className="min-w-full border border-blue-200 rounded-xl text-sm text-gray-800">
                      <thead className="bg-blue-50">
                        <tr>
                          <th className="px-4 py-2 border text-left">
                            Project
                          </th>
                          <th className="px-4 py-2 border text-left">
                            Feedback
                          </th>
                          <th className="px-4 py-2 border text-center">
                            Rating
                          </th>
                          <th className="px-4 py-2 border text-center">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {feedbacks.map((fb) => (
                          <tr
                            key={fb.id}
                            className="odd:bg-white even:bg-blue-50/60"
                          >
                            <td className="px-4 py-2 border align-top">
                              {fb.project}
                            </td>
                            <td className="px-4 py-2 border align-top">
                              {fb.feedback}
                            </td>
                            <td className="px-4 py-2 border text-center align-top">
                              {fb.rating}
                            </td>
                            <td className="px-4 py-2 border text-center align-top">
                              {new Date(fb.submitted_at).toLocaleString()}
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
        </div>
      </main>
    </div>
  );
}
