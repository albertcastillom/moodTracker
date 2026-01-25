const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "..", "journal.json");

function readJournalEntries() {
  if (!fs.existsSync(DATA_FILE)) return [];
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw || "[]");
  } catch {
    return [];
  }
}

function writeJournalEntry(journalEntries) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(journalEntries, null, 2));
}
exports.readJournalEntries = readJournalEntries;
exports.writeJournalEntry = writeJournalEntry;
