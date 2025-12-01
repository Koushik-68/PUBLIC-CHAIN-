// backend/routes/zkRoutes.js
const express = require("express");
const crypto = require("crypto");
const zkUserModel = require("../models/zkUserModel");

const router = express.Router();

/**
 * POST /api/zk/login
 * body: { aadhaar, password }
 */
router.post("/zk/login", async (req, res) => {
  try {
    const { aadhaar, password } = req.body;

    if (!aadhaar || !password) {
      return res
        .status(400)
        .json({ message: "Aadhaar and password are required" });
    }

    const user = await zkUserModel.findByAadhaarAndPassword(aadhaar, password);

    if (!user) {
      return res.status(401).json({ message: "Invalid Aadhaar or password" });
    }

    // 👉 No JWT, no password in response – only basic info for DigiLocker UI
    return res.json({ success: true, user });
  } catch (err) {
    console.error("Error in /zk/login:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/zk/generate-proof
 * body: { aadhaar, selectedFields: ["name","dob",...] }
 */
router.post("/zk/generate-proof", async (req, res) => {
  try {
    const { aadhaar, selectedFields } = req.body;

    if (
      !aadhaar ||
      !Array.isArray(selectedFields) ||
      selectedFields.length === 0
    ) {
      return res
        .status(400)
        .json({
          message: "Aadhaar and at least one selected field are required",
        });
    }

    const user = await zkUserModel.findByAadhaar(aadhaar);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Build object with only selected fields
    const proofData = {};
    selectedFields.forEach((field) => {
      if (user[field] !== undefined) {
        proofData[field] = user[field];
      }
    });

    if (Object.keys(proofData).length === 0) {
      return res
        .status(400)
        .json({ message: "No valid fields selected for proof" });
    }

    const hash = crypto
      .createHash("sha256")
      .update(JSON.stringify(proofData))
      .digest("hex");

    return res.json({
      success: true,
      proof: proofData,
      hash,
      verifiedBy: "DigiLocker (Demo)",
    });
  } catch (err) {
    console.error("Error in /zk/generate-proof:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/zk/verify-proof
 * body: { proof, hash }
 */
router.post("/zk/verify-proof", async (req, res) => {
  try {
    const { proof, hash } = req.body;

    if (!proof || !hash) {
      return res
        .status(400)
        .json({ message: "Proof object and hash are required" });
    }

    const newHash = crypto
      .createHash("sha256")
      .update(JSON.stringify(proof))
      .digest("hex");

    if (newHash !== hash) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or tampered proof" });
    }

    return res.json({
      success: true,
      message: "Verified by DigiLocker (Demo)",
      proof,
    });
  } catch (err) {
    console.error("Error in /zk/verify-proof:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
