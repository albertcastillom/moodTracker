const express = require("express");
const cors = require("cors");
const moodRouter = require("./routes/mood");

const app = express();
const PORT = 3000;

app.use(cors({ origin: "http://localhost:8080" }));
app.use(express.json());

//health check
app.get("/api/health", (req, res) => res.json({ ok: "true" }));

//api routes
app.use("/api/moods", moodRouter);

// API 404
app.use("/api", (req, res) =>
  res.status(404).json({ error: "API route not found" })
);

// Error handler (return JSON)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
