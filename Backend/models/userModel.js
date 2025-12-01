const db = require("../config/db");

async function createUser(
  name,
  email,
  hashedPassword = null,
  role = "department",
  department_name = null,
  department_type = null,
  state = null,
  district = null,
  contact_number = null,
  head_name = null,
  address = null
) {
  const pool = await db.init();
  const [result] = await pool.query(
    `INSERT INTO users (name, email, password, role, department_name, department_type, state, district, contact_number, head_name, address)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      email,
      hashedPassword,
      role,
      department_name,
      department_type,
      state,
      district,
      contact_number,
      head_name,
      address,
    ]
  );
  return result.insertId;
}

async function findByEmail(email) {
  const pool = await db.init();
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows[0];
}

async function findByUsername(username) {
  const pool = await db.init();
  const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [
    username,
  ]);
  return rows[0];
}

async function findPendingUsers() {
  const pool = await db.init();
  const [rows] = await pool.query(
    `SELECT id, name, email, department_name, department_type, state, district, contact_number, head_name, address, created_at
     FROM users WHERE verified = 0 AND role = 'department' ORDER BY created_at ASC`
  );
  return rows;
}

async function findById(id) {
  const pool = await db.init();
  const [rows] = await pool.query(
    `SELECT id, name, email, username, verified, role, department_name, department_type, state, district, contact_number, head_name, address, created_at
     FROM users WHERE id = ?`,
    [id]
  );
  return rows[0];
}

module.exports = {
  createUser,
  findByEmail,
  findById,
  findByUsername,
  async setCredentials(userId, username, hashedPassword) {
    const pool = await db.init();
    const [result] = await pool.query(
      `UPDATE users SET username = ?, password = ?, verified = 1, verified_at = NOW() WHERE id = ?`,
      [username, hashedPassword, userId]
    );
    return result.affectedRows > 0;
  },
  findPendingUsers,
  async findVerifiedUsers() {
    const pool = await db.init();
    const [rows] = await pool.query(
      `SELECT id, name, email, username, verified, verified_at, role, department_name, department_type, state, district, contact_number, head_name, address, created_at
       FROM users WHERE verified = 1 AND role = 'department' ORDER BY verified_at DESC`
    );
    return rows;
  },
};
