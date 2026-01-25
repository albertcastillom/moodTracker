const { Router } = require("express");
const JournalModel = require("../models/journalModel");

const router = Router();

router.get("/", (req, res, next) => {
  try {
    const journalEntries = JournalModel.readJournalEntries();
    res.json(journalEntries);
  } catch (e) {
    next(e);
  }
});

router.post("/", (req, res, next) => {
  try {
    const { entry } = req.body;
    if (typeof entry !== "string" || entry.trim() === "") {
      return res.status(400).json({ error: "Invalid Journal entry" });
    }

    const newEntry = {
      id: Date.now().toString(),
      entry: entry.trim(),
    };

    const journalEntry = JournalModel.readJournalEntries();
    journalEntry.push(newEntry);
    JournalModel.writeJournalEntry(journalEntry);
    res.status(201).json(newEntry);
  } catch (e) {
    next(e);
  }
});

/*
router.post("/habits/:id/logs", (req, res, next) => {
  try {
    const { id } = req.params;
    const { done } = req.body; // boolean

    const habits = HabitsModel.readHabits();
    const habit = habits.find((h) => h.id === id);
    if (!habit) return res.status(404).json({ error: "Habit not found" });

    // simplest v1: store done flag on habit
    habit.completed = !!done;

    HabitsModel.writeHabits(habits);
    res.json(habit);
  } catch (e) {
    next(e);
  }
});
*/
module.exports = router;
