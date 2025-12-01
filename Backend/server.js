require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db");
// import init() from db.js

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routes
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const fundChainRoutes = require("./routes/fundChainRoutes");
const projectChainRoutes = require("./routes/projectChainRoutes");
app.use("/api", authRoutes);
app.use("/api", projectRoutes);
app.use("/api", fundChainRoutes);
app.use("/api", projectChainRoutes);

// Basic route
app.get("/", (req, res) => res.send("Node.js server is running 🚀"));

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  // Try to connect to MySQL when server starts
  try {
    await db.init();
    console.log("✅ MySQL connection initialized successfully!");
    console.log(`Connected to database: ${db.config.database}`);
  } catch (err) {
    console.error("❌ Failed to connect to MySQL on startup:", err.message);
  }
});
