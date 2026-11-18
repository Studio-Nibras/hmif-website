require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./config/database");
const { sessionMiddleware } = require("./config/session");
const authRoutes = require("./features/auth/auth.routes");
const newsRoutes = require("./features/news/news.routes");
const publicNewsRoutes = require("./features/public-news/publicNews.routes");
const errorHandler = require("./middleware/errorHandler");
const overviewRoutes = require("./features/overview/overview.routes");
const programsRoutes = require("./features/programs/programs.routes");
const publicProgramsRoutes = require("./features/public-programs/publicPrograms.routes");
const organizationRoutes = require("./features/organization/organization.routes");
const publicOrganizationRoutes = require("./features/organization/publicOrganization.routes");
const settingsRoutes = require("./features/settings/settings.routes");
const publicSettingsRoutes = require("./features/settings/publicSettings.routes");

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
app.use("/api/programs", publicProgramsRoutes);
app.use("/api/organization", publicOrganizationRoutes);
app.use("/api/settings", publicSettingsRoutes);

app.use("/api/admin/news", newsRoutes);
app.use("/api/admin/overview", overviewRoutes);
app.use("/api/admin/programs", programsRoutes);
app.use("/api/admin/organization", organizationRoutes);
app.use("/api/admin/settings", settingsRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`HMIF API running at http://localhost:${PORT}`);
});
