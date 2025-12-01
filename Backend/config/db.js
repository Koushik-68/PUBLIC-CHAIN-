// db.js
const mysql = require("mysql2/promise");
require("dotenv").config();

function getConfig() {
  const primary = {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "kalleshwar", // ← your password
    database: process.env.DB_NAME || "publicchain",
  };

  const fallbackOld = {
    host: process.env.OLD_DB_HOST,
    port: process.env.OLD_DB_PORT,
    user: process.env.OLD_DB_USER,
    password: process.env.OLD_DB_PASS,
    database: process.env.OLD_DB_NAME,
  };

  return primary.host ? primary : fallbackOld;
}

const DB_CONFIG = getConfig();
let pool;

async function init() {
  if (pool) return pool;
  pool = mysql.createPool({
    ...DB_CONFIG,
    waitForConnections: true,
    connectionLimit: 10,
  });

  // Ensure 'fund_chain' table exists for blockchain blocks
  await pool.query(`
    CREATE TABLE IF NOT EXISTS fund_chain (
      id INT AUTO_INCREMENT PRIMARY KEY,
      block_hash VARCHAR(128) NOT NULL,
      prev_hash VARCHAR(128),
      fund_data JSON NOT NULL,
      signature TEXT,
      timestamp BIGINT NOT NULL
    ) ENGINE=InnoDB;
  `);

  // Ensure timestamp column is BIGINT (in case table already exists)
  try {
    await pool.query(`ALTER TABLE fund_chain MODIFY timestamp BIGINT NOT NULL`);
  } catch (err) {
    // Ignore error if column is already BIGINT or table doesn't exist yet
  }

  // Ensure 'users' table exists (verified_at column already present)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NULL,
      username VARCHAR(128) NULL UNIQUE,
      verified TINYINT(1) NOT NULL DEFAULT 0,
      verified_at DATETIME DEFAULT NULL,
      role VARCHAR(32) NOT NULL DEFAULT 'department',
      department_name VARCHAR(255),
      department_type VARCHAR(128),
      state VARCHAR(128),
      district VARCHAR(128),
      contact_number VARCHAR(64),
      head_name VARCHAR(255),
      address TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `);

  // Ensure 'project_chain' table exists for project blockchain blocks
  await pool.query(`
    CREATE TABLE IF NOT EXISTS project_chain (
      id INT AUTO_INCREMENT PRIMARY KEY,
      block_hash VARCHAR(128) NOT NULL,
      prev_hash VARCHAR(128),
      project_data JSON NOT NULL,
      signature VARCHAR(128) NOT NULL,
      timestamp BIGINT NOT NULL
    ) ENGINE=InnoDB;
  `);

  // Ensure 'departments' table exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS departments (
      id VARCHAR(32) PRIMARY KEY,
      name VARCHAR(128) NOT NULL
    ) ENGINE=InnoDB;
  `);

  // Insert default departments if not present
  const [deptRows] = await pool.query(
    `SELECT COUNT(*) as count FROM departments`
  );
  if (deptRows[0].count === 0) {
    await pool.query(`INSERT INTO departments (id, name) VALUES
      ('pwd', 'Public Works Department'),
      ('edu', 'Education Department'),
      ('health', 'Health Department')
    `);
  }

  // Ensure 'projects' table exists and department_id is VARCHAR(32)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id INT AUTO_INCREMENT PRIMARY KEY,
      project_name VARCHAR(255) NOT NULL,
      department_id VARCHAR(32) NOT NULL,
      type VARCHAR(128) NOT NULL,
      location VARCHAR(255) NOT NULL,
      budget DECIMAL(18,2) NOT NULL,
      officer VARCHAR(255) NOT NULL,
      contact VARCHAR(128) NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      description TEXT,
      blockchain_verify TINYINT(1) DEFAULT 1,
      status VARCHAR(32) DEFAULT 'Draft',
      files TEXT,
      added_by INT NOT NULL,
      added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (added_by) REFERENCES users(id)
    ) ENGINE=InnoDB;
  `);

  // Drop foreign key on department_id if exists (MySQL workaround)
  try {
    await pool.query(`ALTER TABLE projects DROP FOREIGN KEY projects_ibfk_1`);
  } catch (err) {
    // Ignore error if foreign key doesn't exist
  }

  // Ensure 'feedback' table exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS feedback (
      id INT AUTO_INCREMENT PRIMARY KEY,
      project VARCHAR(255) NOT NULL,
      feedback TEXT NOT NULL,
      rating INT NOT NULL,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `);

  // Ensure 'rise_fund_requests' table exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS rise_fund_requests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      department VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      amount DECIMAL(18,2) NOT NULL,
      urgency VARCHAR(32) NOT NULL,
      reason TEXT NOT NULL,
      contact VARCHAR(128) NOT NULL,
      files TEXT,
      impact_estimate TEXT,
      status VARCHAR(32) DEFAULT 'Pending',
      generated_id VARCHAR(64),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `);

  // ...existing code...

  // Test connection
  try {
    const conn = await pool.getConnection();
    conn.release();
    console.log("✅ Connected to MySQL Database!");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }

  return pool;
}

async function query(sql, params) {
  if (!pool) await init();
  return pool.query(sql, params);
}

module.exports = { init, config: DB_CONFIG, query };
