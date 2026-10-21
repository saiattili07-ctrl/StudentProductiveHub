import { body, param } from "express-validator";
import { SESSION_STATUSES, TIME_PATTERN } from "../models/StudySession.js";

export const studyIdValidator = [
  param("id").isMongoId().withMessage("Invalid session id"),
];

export const createStudyValidator = [
  body("subject")
    .isString()
    .withMessage("Subject is required")
    .trim()
    .notEmpty()
    .withMessage("Subject is required")
    .isLength({ max: 60 })
    .withMessage("Subject must be at most 60 characters"),
  body("date").isISO8601().withMessage("A valid date is required"),
  body("startTime")
    .matches(TIME_PATTERN)
    .withMessage("Start time must be HH:MM (24-hour)"),
  body("endTime")
    .matches(TIME_PATTERN)
    .withMessage("End time must be HH:MM (24-hour)"),
  body("notes")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes must be at most 500 characters"),
  body("status")
    .optional()
    .isIn(SESSION_STATUSES)
    .withMessage("Invalid status"),
];

export const updateStudyValidator = [
  ...studyIdValidator,
  body("subject")
    .optional()
    .isString()
    .withMessage("Subject must be text")
    .trim()
    .notEmpty()
    .withMessage("Subject cannot be empty")
    .isLength({ max: 60 })
    .withMessage("Subject must be at most 60 characters"),
  body("date").optional().isISO8601().withMessage("A valid date is required"),
  body("startTime")
    .optional()
    .matches(TIME_PATTERN)
    .withMessage("Start time must be HH:MM (24-hour)"),
  body("endTime")
    .optional()
    .matches(TIME_PATTERN)
    .withMessage("End time must be HH:MM (24-hour)"),
  body("notes")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes must be at most 500 characters"),
  body("status")
    .optional()
    .isIn(SESSION_STATUSES)
    .withMessage("Invalid status"),
];
