const express = require("express");
const router = express.Router();
// Feedback route for admin modal
const feedbackController = require("../controllers/feedbackController");
router.get("/feedback", feedbackController.getAllFeedbacks);
const { authenticate } = require("../middleware/authMiddleware");
const projectModel = require("../models/projectModel");
const multer = require("multer");
const upload = multer();
const riseFundRequestController = require("../controllers/riseFundRequestController");
router.post("/rise-fund-request", riseFundRequestController.submitRequest);

// Get all fund requests
router.get("/fund-requests", async (req, res) => {
  try {
    const db = require("../config/db");
    const [rows] = await db.query(
      "SELECT * FROM rise_fund_requests ORDER BY created_at DESC"
    );
    res.json({ requests: rows });
  } catch (err) {
    console.error("Fetch fund requests error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all projects
router.get("/projects", async (req, res) => {
  try {
    const db = require("../config/db");
    const [rows] = await db.query("SELECT * FROM projects");
    res.json({ projects: rows });
  } catch (err) {
    console.error("Fetch projects error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Sample departments list (replace with DB query if needed)
router.get("/departments", (req, res) => {
  res.json({
    departments: [
      { id: "pwd", name: "Public Works Department" },
      { id: "edu", name: "Education Department" },
      { id: "health", name: "Health Department" },
    ],
  });
});

router.post(
  "/projects",
  authenticate,
  upload.array("documents", 6),
  async (req, res) => {
    try {
      console.log("AddProject raw req.body:", req.body);
      const body = req.body || {}; // ✅ prevent crash

      // Required fields
      const projectName = body.projectName || null;
      const departmentId = body.departmentId || null;
      const type = body.type || null;
      const location = body.location || null;
      const budget = body.budget || null;
      const officer = body.officer || null;
      const contact = body.contact || null;
      const startDate = body.startDate || null;
      const endDate = body.endDate || null;
      // Optional fields
      const description = body.description || null;
      const blockchainVerify = body.blockchainVerify || null;
      const status = body.status || null;
      const files = body.files || null;

      // Only check required fields
      if (
        !projectName ||
        !departmentId ||
        !type ||
        !location ||
        !budget ||
        !officer ||
        !contact ||
        !startDate ||
        !endDate
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const addedBy = req.user.id;
      const project = {
        projectName,
        departmentId,
        type,
        location,
        budget,
        officer,
        contact,
        startDate,
        endDate,
        description,
        blockchainVerify,
        status,
        files,
        addedBy,
      };
      const id = await projectModel.addProject(project);
      return res
        .status(201)
        .json({ id, message: "Project added successfully" });
    } catch (err) {
      console.error("Add project error", err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
