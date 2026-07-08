const { Router } = require("express");
const { prisma } = require("../db");
const { requireAuth } = require("../middleware/auth");
const { toDateOnly } = require("../utils/dates");

const router = Router();

router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const entries = await prisma.journalEntry.findMany({
      where: { userId: req.user.id },
      orderBy: [{ entryDate: "desc" }, { createdAt: "desc" }],
    });
    res.json({ entries });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const body = String(req.body.body || "").trim();
    const title = req.body.title ? String(req.body.title).trim() : null;
    const entryDate = toDateOnly(req.body.entryDate || new Date());
    if (!body) return res.status(400).json({ error: "Journal body is required." });

    const entry = await prisma.journalEntry.create({
      data: { userId: req.user.id, title, body, entryDate },
    });
    res.status(201).json({ entry });
  } catch (err) {
    next(err);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const body = String(req.body.body || "").trim();
    const title = req.body.title ? String(req.body.title).trim() : null;
    const entryDate = req.body.entryDate ? toDateOnly(req.body.entryDate) : undefined;
    if (!body) return res.status(400).json({ error: "Journal body is required." });

    const entry = await prisma.journalEntry.update({
      where: { id: req.params.id, userId: req.user.id },
      data: { title, body, ...(entryDate ? { entryDate } : {}) },
    });
    res.json({ entry });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Journal entry not found." });
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await prisma.journalEntry.delete({
      where: { id: req.params.id, userId: req.user.id },
    });
    res.json({ ok: true });
  } catch (err) {
    if (err.code === "P2025") return res.status(404).json({ error: "Journal entry not found." });
    next(err);
  }
});

module.exports = router;
