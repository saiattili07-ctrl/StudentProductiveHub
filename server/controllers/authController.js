import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";
import {
  signToken,
  setAuthCookie,
  clearAuthCookie,
  issueCsrfToken,
} from "../utils/tokenUtils.js";

export const getCsrfToken = asyncHandler(async (req, res) => {
  const csrfToken = issueCsrfToken(req, res);
  res.status(200).json({ success: true, csrfToken });
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409);
    throw new Error("An account with that email already exists");
  }

  const user = await User.create({ name, email, password });
  setAuthCookie(res, signToken(user._id));

  res.status(201).json({ success: true, user });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  const passwordOk = user ? await user.comparePassword(password) : false;

  if (!user || !passwordOk) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  setAuthCookie(res, signToken(user._id));

  res.status(200).json({ success: true, user });
});

export const logout = asyncHandler(async (req, res) => {
  clearAuthCookie(res);
  res.status(200).json({ success: true, message: "Logged out" });
});

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});
