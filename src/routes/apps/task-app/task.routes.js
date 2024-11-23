import { Router } from "express";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";
import { createTaskValidator } from "../../../validators/common/task.validator.js";
import { validate } from "../../../validators/validate.js";
import {
  createTask,
  deleteTask,
  editTask,
  getTasksbyCategories,
  markTaskasCompleted,
  viewAllTask,
  viewTaskDetails,
} from "../../../controllers/apps/task-app/task.controllers.js";
import { mongoIdPathVariableValidator } from "../../../validators/common/mongodb.validators.js";

const router = Router();
router.use(verifyJWT);

router
  .route("/")
  .post(createTaskValidator, validate, createTask)
  .get(viewAllTask);
router
  .route("/:taskId")
  .get(mongoIdPathVariableValidator("taskId"), validate, viewTaskDetails)
  .patch(mongoIdPathVariableValidator("taskId"), validate, editTask)
  .post(mongoIdPathVariableValidator("taskId"), validate, markTaskasCompleted)
  .delete(mongoIdPathVariableValidator("taskId"), validate, deleteTask);

router.route("/category/:categoryId").get(getTasksbyCategories);
export default router;
