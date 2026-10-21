import { body } from 'express-validator';

export const updateProfileValidator = [
  body('name')
    .optional()
    .isString().withMessage('Name must be text')
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2 to 50 characters'),
  body('institution').optional().isString().trim().isLength({ max: 100 })
    .withMessage('Institution must be at most 100 characters'),
  body('course').optional().isString().trim().isLength({ max: 100 })
    .withMessage('Course must be at most 100 characters'),
  body('bio').optional().isString().trim().isLength({ max: 300 })
    .withMessage('Bio must be at most 300 characters'),
];

export const changePasswordValidator = [
  body('currentPassword')
    .isString().withMessage('Current password is required')
    .notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isString().withMessage('New password is required')
    .isLength({ min: 8, max: 72 }).withMessage('New password must be 8 to 72 characters')
    .matches(/[A-Za-z]/).withMessage('New password must contain at least one letter')
    .matches(/\d/).withMessage('New password must contain at least one number'),
];