const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "..", "results.json");

function readRatings() {
  if (!fs.existsSync(DATA_FILE)) return [];
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw || "[]");
  } catch {
    return [];
  }
}

function writeRatings(ratings) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(ratings, null, 2));
}

exports.getAverage = () => {
  const ratings = readRatings();
  if (!ratings.length) return 0;
  return ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
};

exports.addRating = (rating) => {
  const ratings = readRatings();
  ratings.push(rating);
  writeRatings(ratings);
  return true;
};
