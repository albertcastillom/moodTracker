const { Router } = require("express");
const { prisma } = require("../db");
const { requireAuth } = require("../middleware/auth");
const { dateKey, toDateOnly } = require("../utils/dates");

const router = Router();

router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const habits = await prisma.habit.findMany({
      where: { userId: req.user.id, active: true },
      orderBy: { createdAt: "asc" },
    });
    res.json({ habits });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const name = String(req.body.name || "").trim();
    if (!name) return res.status(400).json({ error: "Habit name is required." });

    const habit = await prisma.habit.create({
      data: { userId: req.user.id, name },
    });
    res.status(201).json({ habit });
  } catch (err) {
    next(err);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const name = String(req.body.name || "").trim();
    if (!name) return res.status(400).json({ error: "Habit name is required." });

    const habit = await prisma.habit.update({
      where: { id: req.params.id, userId: req.user.id },
      data: { name },
    });
    res.json({ habit });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Habit not found." });
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const habit = await prisma.habit.update({
      where: { id: req.params.id, userId: req.user.id },
      data: { active: false },
    });
    res.json({ habit });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Habit not found." });
    next(err);
  }
});

router.get("/today", async (req, res, next) => {
  try {
    const date = toDateOnly(req.query.date || new Date());
    const habits = await prisma.habit.findMany({
      where: { userId: req.user.id, active: true },
      include: {
        completions: {
          where: { userId: req.user.id, date },
          select: { id: true, date: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    res.json({
      date: dateKey(date),
      habits: habits.map((habit) => ({
        id: habit.id,
        name: habit.name,
        completed: habit.completions.length > 0,
      })),
    });
  } catch (err) {
    next(err);
  }
});

router.post("/:id/completions", async (req, res, next) => {
  try {
    const date = toDateOnly(req.body.date || new Date());
    const habit = await prisma.habit.findFirst({
      where: { id: req.params.id, userId: req.user.id, active: true },
    });
    if (!habit) return res.status(404).json({ error: "Habit not found." });

    const completion = await prisma.habitCompletion.upsert({
      where: { habitId_date: { habitId: habit.id, date } },
      create: { habitId: habit.id, userId: req.user.id, date },
      update: {},
    });
    res.status(201).json({ completion });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id/completions/:date", async (req, res, next) => {
  try {
    const date = toDateOnly(req.params.date);
    const habit = await prisma.habit.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      select: { id: true },
    });
    if (!habit) return res.status(404).json({ error: "Habit not found." });

    await prisma.habitCompletion.delete({
      where: { habitId_date: { habitId: habit.id, date } },
    });
    res.json({ ok: true });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Completion not found." });
    next(err);
  }
});

module.exports = router;
