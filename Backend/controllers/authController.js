const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const JWT_SECRET = process.env.JWT_SECRET || "devsecret";

async function register(req, res) {
  const {
    name,
    email,
    department_name,
    department_type,
    state,
    district,
    contact_number,
    head_name,
    address,
  } = req.body;
  // For public department registration we do NOT require a password.
  // Departments register with their details and the account remains unverified
  // until a government administrator verifies and assigns username/password.
  if (!name || !email || !department_name)
    return res
      .status(400)
      .json({
        message: "Missing fields: name, email and department_name are required",
      });

  try {
    const existing = await userModel.findByEmail(email);
    if (existing)
      return res.status(409).json({ message: "Email already registered" });

    // Registration allowed only for departments via public form.
    // No password assigned yet; account will be verified by government admin.
    const role = "department";
    const id = await userModel.createUser(
      name,
      email,
      null, // password is null until government verifies and sets credentials
      role,
      department_name,
      department_type,
      state,
      district,
      contact_number,
      head_name,
      address
    );

    return res
      .status(201)
      .json({ id, message: "Registered — pending government verification" });
  } catch (err) {
    console.error("register error", err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function login(req, res) {
  // Accept an identifier (id / username / email) and password
  const { identifier, password } = req.body;
  if (!identifier || !password)
    return res
      .status(400)
      .json({ message: "Missing fields: identifier and password required" });
  try {
    let user = null;

    // numeric identifier -> treat as id
    if (/^\d+$/.test(String(identifier))) {
      user = await userModel.findById(parseInt(identifier, 10));
    }
    // if not found, try email
    if (!user) user = await userModel.findByEmail(identifier);
    // if still not found, try username
    if (!user) user = await userModel.findByUsername(identifier);

    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    // require user to be verified by government before allowing login
    if (!user.verified)
      return res.status(403).json({ message: "Account not verified" });
    if (!user.password)
      return res.status(401).json({ message: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    // if client provides expected role, ensure it matches user's role
    const expectedRole = req.body.role;
    if (expectedRole && user.role && expectedRole !== user.role) {
      return res.status(401).json({ message: "Invalid role for this user" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "8h",
    });
    return res.json({ token });
  } catch (err) {
    console.error("login error", err);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  register,
  login,
  async verifyUser(req, res) {
    try {
      const requester = await require("../models/userModel").findById(
        req.user.id
      );
      if (!requester || requester.role !== "government") {
        return res
          .status(403)
          .json({ message: "Only government users can verify accounts" });
      }

      const { userId, username, password } = req.body;
      if (!userId)
        return res.status(400).json({ message: "userId is required" });

      // generate username/password if not provided
      const genUsername = username || `dept${userId}`;
      const genPassword = password || Math.random().toString(36).slice(-10);

      const hashed = await bcrypt.hash(genPassword, 10);
      const ok = await require("../models/userModel").setCredentials(
        userId,
        genUsername,
        hashed
      );
      if (!ok) return res.status(404).json({ message: "User not found" });

      // return credentials to the government portal so they can display/copy them to the department
      return res.json({ userId, username: genUsername, password: genPassword });
    } catch (err) {
      console.error("verifyUser error", err);
      return res.status(500).json({ message: "Server error" });
    }
  },
  async listPending(req, res) {
    try {
      const requester = await require("../models/userModel").findById(
        req.user.id
      );
      if (!requester || requester.role !== "government") {
        return res
          .status(403)
          .json({ message: "Only government users can list pending accounts" });
      }
      const users = await require("../models/userModel").findPendingUsers();
      return res.json({ users });
    } catch (err) {
      console.error("listPending error", err);
      return res.status(500).json({ message: "Server error" });
    }
  },
  async listVerified(req, res) {
    try {
      const requester = await require("../models/userModel").findById(
        req.user.id
      );
      if (!requester || requester.role !== "government") {
        return res
          .status(403)
          .json({
            message: "Only government users can list verified accounts",
          });
      }
      const users = await require("../models/userModel").findVerifiedUsers();
      return res.json({ users });
    } catch (err) {
      console.error("listVerified error", err);
      return res.status(500).json({ message: "Server error" });
    }
  },
  // returns user profile without password
  async profile(req, res) {
    try {
      const id = req.user?.id;
      if (!id) return res.status(401).json({ message: "Not authenticated" });
      const user = await require("../models/userModel").findById(id);
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.json({ user });
    } catch (err) {
      console.error("profile error", err);
      return res.status(500).json({ message: "Server error" });
    }
  },
};
