import { Router } from "express";
import {
  getCsrfToken,
  register,
  login,
  logout,
  getMe,
} from "../controllers/authController.js";
import {
  registerValidator,
  loginValidator,
} from "../validators/authValidators.js";
import validate from "../middleware/validateMiddleware.js";
import { loginLimiter } from "../middleware/rateLimiters.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/csrf-token", getCsrfToken);
router.post("/register", registerValidator, validate, register);
router.post("/login", loginLimiter, loginValidator, validate, login);
router.post("/logout", logout);
router.get("/me", protect, getMe);

export default router;
