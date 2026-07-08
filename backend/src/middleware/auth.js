const jwt = require("jsonwebtoken");
const { prisma } = require("../db");

const COOKIE_NAME = "moodtracker_session";

function getJwtSecret() {
  return process.env.JWT_SECRET || process.env.SESSION_SECRET || "dev-only-change-me";
}

function cookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  };
}

function signSession(user) {
  return jwt.sign({ sub: user.id }, getJwtSecret(), { expiresIn: "7d" });
}

function setSessionCookie(res, user) {
  res.cookie(COOKIE_NAME, signSession(user), cookieOptions());
}

function clearSessionCookie(res) {
  res.clearCookie(COOKIE_NAME, cookieOptions());
}

async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) return res.status(401).json({ error: "Authentication required" });

    const payload = jwt.verify(token, getJwtSecret());
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, displayName: true, createdAt: true },
    });

    if (!user) return res.status(401).json({ error: "Authentication required" });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: "Authentication required" });
  }
}

module.exports = {
  clearSessionCookie,
  requireAuth,
  setSessionCookie,
};
