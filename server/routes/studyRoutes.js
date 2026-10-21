import { Router } from "express";
import {
  getSessions,
  getSession,
  createSession,
  updateSession,
  deleteSession,
  completeSession,
} from "../controllers/studyController.js";
import {
  studyIdValidator,
  createStudyValidator,
  updateStudyValidator,
} from "../validators/studyValidators.js";
import validate from "../middleware/validateMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);

router
  .route("/")
  .get(getSessions)
  .post(createStudyValidator, validate, createSession);

router
  .route("/:id")
  .get(studyIdValidator, validate, getSession)
  .put(updateStudyValidator, validate, updateSession)
  .delete(studyIdValidator, validate, deleteSession);

router.patch("/:id/complete", studyIdValidator, validate, completeSession);

export default router;
