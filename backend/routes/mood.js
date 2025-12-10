const { Router } = require("express");
const mood = Router();

mood.get("/", (req, res) => {
  res.send("Welcome to the Mood Tracker API");
});

// Get average rating
mood.get("/average", (req, res) => {
  if (!fs.existsSync(DATA_FILE)) return res.send({ average: 0 });

  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  const average = data.reduce((sum, r) => sum + r, 0) / data.length;
  res.send({ average });
});

// Submit a new rating
mood.post("/submit", (req, res) => {
  const rating = req.body.rating;
  if (typeof rating !== "number" || rating < 1 || rating > 10) {
    return res.status(400).send({ error: "Invalid rating" });
  }

  let data = [];
  if (fs.existsSync(DATA_FILE)) {
    data = JSON.parse(fs.readFileSync(DATA_FILE));
  }

  data.push(rating);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data));
  res.send({ success: true });
});

module.exports = mood;
