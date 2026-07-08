require("dotenv").config();

const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const { prisma } = require("./src/db");
const authRoutes = require("./src/routes/authRoutes");
const habitRoutes = require("./src/routes/habitRoutes");
const journalRoutes = require("./src/routes/journalRoutes");
const moodRoutes = require("./src/routes/moodRoutes");

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const distPath = path.join(__dirname, "..", "dist");

app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? true : CLIENT_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/moods", moodRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/journal", journalRoutes);

app.use("/api", (req, res) =>
  res.status(404).json({ error: "API route not found" }),
);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(distPath));
  app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
});
