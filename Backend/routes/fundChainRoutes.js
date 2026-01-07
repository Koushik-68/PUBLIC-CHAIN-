const express = require("express");
const router = express.Router();
const fundChain = require("../models/fundChainModel");

// Add a new block when government releases a fund
router.post("/blockchain/release-fund", async (req, res) => {
  try {
    const fundData = req.body;
    const block = await fundChain.addBlock(fundData);
    res.json({ success: true, block });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get the blockchain
router.get("/blockchain/chain", async (req, res) => {
  try {
    const chain = await fundChain.getChain();
    res.json({ success: true, chain });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Verify the blockchain integrity
router.get("/blockchain/verify", async (req, res) => {
  try {
    const valid = await fundChain.verifyChain();
    res.json({ success: true, valid });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Detailed verify (break index and mismatch info)
router.get("/blockchain/verify-detail", async (req, res) => {
  try {
    const info = await fundChain.verifyChainDetailed();
    res.json({ success: true, ...info });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
