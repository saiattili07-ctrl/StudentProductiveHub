import asyncHandler from "../utils/asyncHandler.js";
import escapeRegex from "../utils/escapeRegex.js";
import Task, { TASK_PRIORITIES, TASK_STATUSES } from "../models/Task.js";

const ALLOWED_FIELDS = [
  "title",
  "description",
  "subject",
  "priority",
  "status",
  "dueDate",
];
const SORT_FIELDS = ["createdAt", "updatedAt", "dueDate", "title"];

const pickAllowed = (body) => {
  const data = {};
  for (const field of ALLOWED_FIELDS) {
    if (body[field] !== undefined) data[field] = body[field];
  }
  return data;
};

// Query values must be plain strings (blocks ?status[$ne]=x style injection)
const asString = (value) => (typeof value === "string" ? value.trim() : "");

const findOwnedTask = async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }
  return task;
};

export const getTasks = asyncHandler(async (req, res) => {
  const q = req.query;
  const filter = { user: req.user._id };

  const search = asString(q.search);
  if (search) {
    const rx = new RegExp(escapeRegex(search), "i");
    filter.$or = [{ title: rx }, { description: rx }, { subject: rx }];
  }

  const status = asString(q.status);
  if (TASK_STATUSES.includes(status)) filter.status = status;

  const priority = asString(q.priority);
  if (TASK_PRIORITIES.includes(priority)) filter.priority = priority;

  const subject = asString(q.subject);
  if (subject) filter.subject = subject;

  const sortBy = SORT_FIELDS.includes(q.sortBy) ? q.sortBy : "createdAt";
  const order = q.order === "asc" ? 1 : -1;

  const page = Math.max(parseInt(q.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(q.limit, 10) || 10, 1), 50);

  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .sort({ [sortBy]: order, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Task.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    tasks,
    pagination: {
      page,
      limit,
      total,
      pages: Math.max(Math.ceil(total / limit), 1),
    },
  });
});

export const getTaskSubjects = asyncHandler(async (req, res) => {
  const subjects = await Task.distinct("subject", { user: req.user._id });
  subjects.sort((a, b) => a.localeCompare(b));
  res.status(200).json({ success: true, subjects });
});

export const getTask = asyncHandler(async (req, res) => {
  const task = await findOwnedTask(req, res);
  res.status(200).json({ success: true, task });
});

export const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create({
    ...pickAllowed(req.body),
    user: req.user._id,
  });
  res.status(201).json({ success: true, task });
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await findOwnedTask(req, res);
  task.set(pickAllowed(req.body));
  await task.save();
  res.status(200).json({ success: true, task });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await findOwnedTask(req, res);
  await task.deleteOne();
  res.status(200).json({ success: true, message: "Task deleted" });
});

export const completeTask = asyncHandler(async (req, res) => {
  const task = await findOwnedTask(req, res);
  task.status = "completed";
  await task.save();
  res.status(200).json({ success: true, task });
});

export const reopenTask = asyncHandler(async (req, res) => {
  const task = await findOwnedTask(req, res);
  task.status = "pending";
  await task.save();
  res.status(200).json({ success: true, task });
});
