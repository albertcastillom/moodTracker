const bcrypt = require("bcryptjs");
const { Router } = require("express");
const { prisma } = require("../db");
const { clearSessionCookie, requireAuth, setSessionCookie } = require("../middleware/auth");

const router = Router();

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    createdAt: user.createdAt,
  };
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

router.post("/register", async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");
    const displayName = String(req.body.displayName || "").trim();

    if (!email.includes("@")) return res.status(400).json({ error: "Enter a valid email." });
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        displayName: displayName || email.split("@")[0],
      },
    });

    setSessionCookie(res, user);
    res.status(201).json({ user: publicUser(user) });
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "An account with that email already exists." });
    }
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");

    const user = await prisma.user.findUnique({ where: { email } });
    const isValid = user ? await bcrypt.compare(password, user.passwordHash) : false;
    if (!isValid) return res.status(401).json({ error: "Invalid email or password." });

    setSessionCookie(res, user);
    res.json({ user: publicUser(user) });
  } catch (err) {
    next(err);
  }
});

router.post("/logout", (req, res) => {
  clearSessionCookie(res);
  res.json({ ok: true });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
