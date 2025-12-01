// backend/models/zkUserModel.js
const db = require("../config/db");

// Find user by Aadhaar + password (for login)
async function findByAadhaarAndPassword(aadhaar, password) {
  const pool = await db.init();
  const [rows] = await pool.query(
    "SELECT aadhaar, name, dob, age, gender, mobile FROM zk_users WHERE aadhaar = ? AND password = ?",
    [aadhaar, password]
  );
  return rows[0]; // undefined if not found
}

// Find user by Aadhaar (for generating proof)
async function findByAadhaar(aadhaar) {
  const pool = await db.init();
  const [rows] = await pool.query(
    "SELECT aadhaar, name, dob, age, gender, mobile FROM zk_users WHERE aadhaar = ?",
    [aadhaar]
  );
  return rows[0];
}

module.exports = {
  findByAadhaarAndPassword,
  findByAadhaar,
};
