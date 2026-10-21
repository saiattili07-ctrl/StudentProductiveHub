import jwt from "jsonwebtoken";
import crypto from "crypto";

const isProduction = () => process.env.NODE_ENV === "production";
const cookieDays = () => Number(process.env.COOKIE_EXPIRES_DAYS) || 7;

const baseCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction(),
  sameSite: isProduction() ? "none" : "lax",
});

export const signToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined. Add it to server/.env");
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

export const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    ...baseCookieOptions(),
    maxAge: cookieDays() * 24 * 60 * 60 * 1000,
  });
};

export const clearAuthCookie = (res) => {
  res.clearCookie("token", baseCookieOptions());
};

// Reuse the existing CSRF cookie if present, otherwise create one
export const issueCsrfToken = (req, res) => {
  let token = req.cookies?.csrf_token;
  if (!token) {
    token = crypto.randomBytes(32).toString("hex");
    res.cookie("csrf_token", token, {
      ...baseCookieOptions(),
      maxAge: cookieDays() * 24 * 60 * 60 * 1000,
    });
  }
  return token;
};
