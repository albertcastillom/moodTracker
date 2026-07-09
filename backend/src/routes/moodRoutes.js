const { Router } = require("express");
const { prisma } = require("../db");
const { requireAuth } = require("../middleware/auth");
const { toDateOnly } = require("../utils/dates");

const router = Router();

function cleanLocation(body) {
  const region = body.region ? String(body.region).trim() : "";
  return {
    city: String(body.city || region || "").trim(),
    region: region || null,
    country: body.country ? String(body.country).trim() : null,
  };
}

router.use(requireAuth);

router.get("/today", async (req, res, next) => {
  try {
    const entryDate = toDateOnly();
    const mood = await prisma.moodEntry.findUnique({
      where: { userId_entryDate: { userId: req.user.id, entryDate } },
    });
    res.json({ mood });
  } catch (err) {
    next(err);
  }
});

router.put("/today", async (req, res, next) => {
  try {
    const rating = Number(req.body.rating);
    const note = req.body.note ? String(req.body.note).trim() : null;
    const { city, region, country } = cleanLocation(req.body);
    const entryDate = toDateOnly();

    if (!Number.isInteger(rating) || rating < 1 || rating > 10) {
      return res.status(400).json({ error: "Mood rating must be between 1 and 10." });
    }
    if (!region) return res.status(400).json({ error: "State or region is required for mood check-ins." });

    const mood = await prisma.moodEntry.upsert({
      where: { userId_entryDate: { userId: req.user.id, entryDate } },
      create: { userId: req.user.id, rating, note, city, region, country, entryDate },
      update: { rating, note, city, region, country },
    });

    res.json({ mood });
  } catch (err) {
    next(err);
  }
});

router.get("/region-average", async (req, res, next) => {
  try {
    const region = String(req.query.region || "").trim();
    if (!region) return res.status(400).json({ error: "State or region is required." });

    const since = new Date();
    since.setUTCDate(since.getUTCDate() - 6);
    const fromDate = toDateOnly(since);

    const aggregate = await prisma.moodEntry.aggregate({
      where: {
        region: { equals: region, mode: "insensitive" },
        entryDate: { gte: fromDate },
      },
      _avg: { rating: true },
      _count: { rating: true },
    });

    res.json({
      region,
      average: aggregate._avg.rating,
      count: aggregate._count.rating,
      windowDays: 7,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/city-average", async (req, res, next) => {
  try {
    const city = String(req.query.city || "").trim();
    if (!city) return res.status(400).json({ error: "City is required." });

    const since = new Date();
    since.setUTCDate(since.getUTCDate() - 6);
    const fromDate = toDateOnly(since);

    const aggregate = await prisma.moodEntry.aggregate({
      where: {
        city: { equals: city, mode: "insensitive" },
        entryDate: { gte: fromDate },
      },
      _avg: { rating: true },
      _count: { rating: true },
    });

    res.json({
      city,
      average: aggregate._avg.rating,
      count: aggregate._count.rating,
      windowDays: 7,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
