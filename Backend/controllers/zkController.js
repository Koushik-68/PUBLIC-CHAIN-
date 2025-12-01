const users = require("./zkModel");
const crypto = require("crypto");

// Login
exports.login = (req, res) => {
  const { aadhaar, password } = req.body;

  const user = users.find(
    (u) => u.aadhaar === aadhaar && u.password === password
  );

  if (!user)
    return res.status(401).json({ message: "Invalid Aadhaar or Password" });

  res.json({ success: true, user });
};

// Generate Proof (ZKP Concept)
exports.generateProof = (req, res) => {
  const { aadhaar, selectedFields } = req.body;

  const user = users.find((u) => u.aadhaar === aadhaar);
  if (!user) return res.status(404).json({ message: "User not found" });

  let proofData = {};
  selectedFields.forEach((field) => {
    proofData[field] = user[field];
  });

  const hash = crypto
    .createHash("sha256")
    .update(JSON.stringify(proofData))
    .digest("hex");

  res.json({
    proof: proofData,
    hash,
    verifiedBy: "DigiLocker",
  });
};

// Verify Proof
exports.verifyProof = (req, res) => {
  const { proof, hash } = req.body;

  const newHash = crypto
    .createHash("sha256")
    .update(JSON.stringify(proof))
    .digest("hex");

  if (newHash === hash) {
    res.json({ success: true, message: "Verified by DigiLocker", proof });
  } else {
    res.status(400).json({ success: false, message: "Invalid Proof" });
  }
};
