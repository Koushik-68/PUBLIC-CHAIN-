// Seed a default government admin user if none exists
// Usage: node scripts/seedGovernment.js
require("dotenv").config();
const bcrypt = require("bcrypt");
const db = require("../config/db");

async function run() {
  const pool = await db.init();
  const [rows] = await pool.query(
    "SELECT id FROM users WHERE role='government' LIMIT 1"
  );
  if (rows.length) {
    console.log("Government user already exists (id=" + rows[0].id + ")");
    process.exit(0);
  }
  const username = process.env.GOV_USERNAME || "govadmin";
  const plain = process.env.GOV_PASSWORD || "Admin@12345";
  const hashed = await bcrypt.hash(plain, 10);
  const [result] = await pool.query(
    `INSERT INTO users (name, email, username, password, verified, role, department_name) VALUES (?,?,?,?,1,'government','Government Admin')`,
    [
      "Government Admin",
      process.env.GOV_EMAIL || "gov@example.com",
      username,
      hashed,
    ]
  );
  console.log("Created government admin user:");
  console.log({ id: result.insertId, username, password: plain });
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
