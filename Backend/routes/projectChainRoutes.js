const express = require("express");
const router = express.Router();
const projectChain = require("../models/projectChainModel");

// Add a new block when department adds a project
router.post("/blockchain/project/add", async (req, res) => {
  try {
    const projectData = req.body;
    const block = await projectChain.addBlock(projectData);
    res.json({ success: true, block });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get the project blockchain
router.get("/blockchain/project/chain", async (req, res) => {
  try {
    const chain = await projectChain.getChain();
    res.json({ success: true, chain });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Verify the project blockchain integrity
router.get("/blockchain/project/verify", async (req, res) => {
  try {
    const valid = await projectChain.verifyChain();
    res.json({ success: true, valid });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
