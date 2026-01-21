const { Router } = require("express");
const HabitsModel = require("../models/habits");

const router = Router();

router.get("/", (req, res, next) => {
  try {
    const habits = HabitsModel.readHabits();
    res.json(habits);
  } catch (e) {
    next(e);
  }
});

router.post("/", (req, res, next) => {
  try {
    const { name } = req.body;
    if (typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({ error: "Invalid habit name" });
    }

    const newHabit = {
      id: Date.now().toString(),
      name: name.trim(),
      completed: false,
    };

    const habits = HabitsModel.readHabits();
    habits.push(newHabit);
    HabitsModel.writeHabits(habits);
    res.status(201).json(newHabit);
  } catch (e) {
    next(e);
  }
});

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

module.exports = router;
