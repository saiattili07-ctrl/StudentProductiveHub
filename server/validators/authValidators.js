import { body } from "express-validator";

export const registerValidator = [
  body("name")
    .isString()
    .withMessage("Name is required")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be 2 to 50 characters"),
  body("email")
    .isString()
    .withMessage("Email is required")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email")
    .toLowerCase(),
  body("password")
    .isString()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 72 })
    .withMessage("Password must be 8 to 72 characters")
    .matches(/[A-Za-z]/)
    .withMessage("Password must contain at least one letter")
    .matches(/\d/)
    .withMessage("Password must contain at least one number"),
];

export const loginValidator = [
  body("email")
    .isString()
    .withMessage("Email is required")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email")
    .toLowerCase(),
  body("password")
    .isString()
    .withMessage("Password is required")
    .notEmpty()
    .withMessage("Password is required"),
];
