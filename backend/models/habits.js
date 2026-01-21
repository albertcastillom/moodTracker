const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "..", "habits.json");

function readHabits() {
  if (!fs.existsSync(DATA_FILE)) return [];
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw || "[]");
  } catch {
    return [];
  }
}

function writeHabits(habits) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(habits, null, 2));
}
exports.readHabits = readHabits;
exports.writeHabits = writeHabits;
