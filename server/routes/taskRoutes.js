import { Router } from "express";
import {
  getTasks,
  getTaskSubjects,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  reopenTask,
} from "../controllers/taskController.js";
import {
  taskIdValidator,
  createTaskValidator,
  updateTaskValidator,
} from "../validators/taskValidators.js";
import validate from "../middleware/validateMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);

router.get("/subjects", getTaskSubjects);

router.route("/").get(getTasks).post(createTaskValidator, validate, createTask);

router
  .route("/:id")
  .get(taskIdValidator, validate, getTask)
  .put(updateTaskValidator, validate, updateTask)
  .delete(taskIdValidator, validate, deleteTask);

router.patch("/:id/complete", taskIdValidator, validate, completeTask);
router.patch("/:id/reopen", taskIdValidator, validate, reopenTask);

export default router;
