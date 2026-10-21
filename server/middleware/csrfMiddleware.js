import crypto from "crypto";

const SAFE_METHODS = ["GET", "HEAD", "OPTIONS"];

export const csrfProtection = (req, res, next) => {
  if (SAFE_METHODS.includes(req.method)) return next();

  const cookieToken = req.cookies?.csrf_token;
  const headerToken = req.get("x-csrf-token");

  if (!cookieToken || !headerToken) {
    res.status(403);
    return next(new Error("Missing CSRF token"));
  }

  const a = Buffer.from(cookieToken);
  const b = Buffer.from(headerToken);

  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    res.status(403);
    return next(new Error("Invalid CSRF token"));
  }

  next();
};
