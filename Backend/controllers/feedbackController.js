exports.getAllFeedbacks = async (req, res) => {
  try {
    const pool = await require("../config/db").init();
    const [rows] = await pool.query(
      "SELECT * FROM feedback ORDER BY submitted_at DESC"
    );
    res.json({ feedbacks: rows });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch feedbacks." });
  }
};
const db = require("../config/db");

exports.submitFeedback = async (req, res) => {
  try {
    const { project, feedback, rating } = req.body;
    if (!project || !feedback || !rating) {
      return res.status(400).json({ error: "All fields are required." });
    }
    const pool = await db.init();
    await pool.query(
      `INSERT INTO feedback (project, feedback, rating, submitted_at) VALUES (?, ?, ?, NOW())`,
      [project, feedback, rating]
    );
    res.json({ success: true, message: "Feedback submitted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to submit feedback." });
  }
};
