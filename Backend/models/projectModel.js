const db = require("../config/db");

// Add a new project to the database
async function addProject(project) {
  // Adjust column names as per your projects table
  const sql = `INSERT INTO projects (
  project_name, department_id, type, location, budget, officer, contact, start_date, end_date, description, blockchain_verify, status, added_by
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    project.projectName,
    project.departmentId,
    project.type,
    project.location,
    project.budget,
    project.officer,
    project.contact,
    project.startDate,
    project.endDate,
    project.description,
    project.blockchainVerify,
    project.status,
    project.addedBy,
  ];
  const [result] = await db.query(sql, values);
  return result.insertId;
}

module.exports = {
  addProject,
};
