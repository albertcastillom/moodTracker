const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const moodRouter = require("./routes/mood");

const app = express();
const PORT = 3000;

const DATA_FILE = path.join(__dirname, "results.json");

app.use(cors());
app.use(express.json());

app.use("/", moodRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
