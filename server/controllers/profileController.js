import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.js';
import { signToken, setAuthCookie } from '../utils/tokenUtils.js';

const ALLOWED_FIELDS = ['name', 'institution', 'course', 'bio'];

export const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const data = {};
  for (const field of ALLOWED_FIELDS) {
    if (req.body[field] !== undefined) data[field] = req.body[field];
  }

  req.user.set(data);
  await req.user.save();

  res.status(200).json({ success: true, user: req.user });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.comparePassword(currentPassword))) {
    res.status(400);
    throw new Error('Current password is incorrect');
  }

  if (currentPassword === newPassword) {
    res.status(400);
    throw new Error('New password must be different from the current password');
  }

  user.password = newPassword;
  await user.save();

  setAuthCookie(res, signToken(user._id));

  res.status(200).json({ success: true, message: 'Password changed successfully' });
});