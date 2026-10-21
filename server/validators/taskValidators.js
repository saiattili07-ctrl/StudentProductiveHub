import { body, param } from "express-validator";
import { TASK_PRIORITIES, TASK_STATUSES } from "../models/Task.js";

export const taskIdValidator = [
  param("id").isMongoId().withMessage("Invalid task id"),
];

const dueDateRule = body("dueDate")
  .optional({ values: "falsy" })
  .isISO8601()
  .withMessage("Due date must be a valid date");

export const createTaskValidator = [
  body("title")
    .isString()
    .withMessage("Title is required")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 120 })
    .withMessage("Title must be at most 120 characters"),
  body("description")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description must be at most 1000 characters"),
  body("subject")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 60 })
    .withMessage("Subject must be 1 to 60 characters"),
  body("priority")
    .optional()
    .isIn(TASK_PRIORITIES)
    .withMessage("Invalid priority"),
  body("status").optional().isIn(TASK_STATUSES).withMessage("Invalid status"),
  dueDateRule,
];

export const updateTaskValidator = [
  ...taskIdValidator,
  body("title")
    .optional()
    .isString()
    .withMessage("Title must be text")
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 120 })
    .withMessage("Title must be at most 120 characters"),
  body("description")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description must be at most 1000 characters"),
  body("subject")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 60 })
    .withMessage("Subject must be 1 to 60 characters"),
  body("priority")
    .optional()
    .isIn(TASK_PRIORITIES)
    .withMessage("Invalid priority"),
  body("status").optional().isIn(TASK_STATUSES).withMessage("Invalid status"),
  dueDateRule,
];
