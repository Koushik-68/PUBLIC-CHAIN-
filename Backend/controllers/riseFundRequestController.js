const riseFundRequestModel = require("../models/riseFundRequestModel");

exports.submitRequest = async (req, res) => {
  try {
    const {
      department,
      title,
      amount,
      urgency,
      reason,
      contact,
      files,
      impactEstimate,
      status,
      generatedId,
    } = req.body;
    if (!department || !title || !amount || !urgency || !reason || !contact) {
      return res.status(400).json({ error: "Missing required fields." });
    }
    const request = {
      department,
      title,
      amount,
      urgency,
      reason,
      contact,
      files: files || null,
      impactEstimate: impactEstimate || null,
      status: status || "Pending",
      generatedId: generatedId || null,
    };
    const id = await riseFundRequestModel.addRiseFundRequest(request);
    res
      .status(201)
      .json({ id, message: "Fund request submitted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to submit fund request." });
  }
};
