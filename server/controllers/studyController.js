import asyncHandler from "../utils/asyncHandler.js";
import StudySession, { SESSION_STATUSES } from "../models/StudySession.js";

const ALLOWED_FIELDS = [
  "subject",
  "date",
  "startTime",
  "endTime",
  "notes",
  "status",
];

const pickAllowed = (body) => {
  const data = {};
  for (const field of ALLOWED_FIELDS) {
    if (body[field] !== undefined) data[field] = body[field];
  }
  return data;
};

const asString = (value) => (typeof value === "string" ? value.trim() : "");

const parseDate = (value) => {
  const text = asString(value);
  if (!text) return null;
  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? null : date;
};

const findOwnedSession = async (req, res) => {
  const session = await StudySession.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!session) {
    res.status(404);
    throw new Error("Study session not found");
  }
  return session;
};

export const getSessions = asyncHandler(async (req, res) => {
  const q = req.query;
  const filter = { user: req.user._id };

  const status = asString(q.status);
  if (SESSION_STATUSES.includes(status)) filter.status = status;

  const subject = asString(q.subject);
  if (subject) filter.subject = subject;

  const from = parseDate(q.from);
  const to = parseDate(q.to);
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = from;
    if (to) filter.date.$lte = to;
  }

  const order = q.order === "asc" ? 1 : -1;
  const page = Math.max(parseInt(q.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(q.limit, 10) || 10, 1), 50);

  const [sessions, total] = await Promise.all([
    StudySession.find(filter)
      .sort({ date: order, startTime: order, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    StudySession.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    sessions,
    pagination: {
      page,
      limit,
      total,
      pages: Math.max(Math.ceil(total / limit), 1),
    },
  });
});

export const getSession = asyncHandler(async (req, res) => {
  const session = await findOwnedSession(req, res);
  res.status(200).json({ success: true, session });
});

export const createSession = asyncHandler(async (req, res) => {
  const session = await StudySession.create({
    ...pickAllowed(req.body),
    user: req.user._id,
  });
  res.status(201).json({ success: true, session });
});

export const updateSession = asyncHandler(async (req, res) => {
  const session = await findOwnedSession(req, res);
  session.set(pickAllowed(req.body));
  await session.save();
  res.status(200).json({ success: true, session });
});

export const deleteSession = asyncHandler(async (req, res) => {
  const session = await findOwnedSession(req, res);
  await session.deleteOne();
  res.status(200).json({ success: true, message: "Study session deleted" });
});

export const completeSession = asyncHandler(async (req, res) => {
  const session = await findOwnedSession(req, res);
  session.status = "completed";
  await session.save();
  res.status(200).json({ success: true, session });
});
