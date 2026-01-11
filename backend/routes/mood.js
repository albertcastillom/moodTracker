const { Router } = require("express");
const moodModel = require("../models/mood");

const router = Router();

// optional: welcome
router.get("/", (req, res) => {
  res.json({ message: "Moods API" });
});

// Get average rating
router.get("/average", (req, res, next) => {
  try {
    const average = moodModel.getAverage();
    res.json({ average });
  } catch (e) {
    next(e);
  }
});

// Submit a new rating
router.post("/submit", (req, res, next) => {
  try {
    const rating = Number(req.body.rating);

    if (!Number.isFinite(rating) || rating < 1 || rating > 10) {
      return res.status(400).json({ error: "Invalid rating" });
    }

    moodModel.addRating(rating);
    res.status(201).json({ success: true });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
