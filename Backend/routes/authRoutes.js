const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authMiddleware");
const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authenticate, authController.profile);
router.get("/profile", authenticate, authController.profile);
// government route to verify department accounts and assign credentials
router.post("/admin/verify-user", authenticate, authController.verifyUser);
router.get("/admin/pending-users", authenticate, authController.listPending);
router.get("/admin/verified-users", authenticate, authController.listVerified);

// Feedback routes
const feedbackController = require("../controllers/feedbackController");
router.post("/feedback", feedbackController.submitFeedback);
router.get("/feedbacks", feedbackController.getAllFeedbacks);

module.exports = router;
