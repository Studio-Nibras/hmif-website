require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./config/database");
const { sessionMiddleware } = require("./config/session");
const authRoutes = require("./routes/auth");
const newsRoutes = require("./routes/news");
const publicNewsRoutes = require("./routes/publicNews");

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is required");
}

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(sessionMiddleware);

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.json({
      success: true,
      message: "HMIF API and database are running",
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/news", publicNewsRoutes);
app.use("/api/admin/news", newsRoutes);

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  console.error("Request error:", error.message);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`HMIF API running at http://localhost:${PORT}`);
});
