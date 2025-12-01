const db = require("../config/db");

async function addRiseFundRequest(request) {
  const sql = `INSERT INTO rise_fund_requests (
    department, title, amount, urgency, reason, contact, files, impact_estimate, status, generated_id
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    request.department,
    request.title,
    request.amount,
    request.urgency,
    request.reason,
    request.contact,
    request.files,
    request.impactEstimate,
    request.status || "Pending",
    request.generatedId || null,
  ];
  const [result] = await db.query(sql, values);
  return result.insertId;
}

module.exports = {
  addRiseFundRequest,
};
