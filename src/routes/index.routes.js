import { Router } from "express";
import upload from "../uploads/multer.js"; // corregido
import {
  renderTasks,
  createTask,
  renderTaskEdit,
  editTask,
  deleteTask,
  taskToggleDone,
} from "../controllers/task.controller.js"; // corregido

const router = Router();

router.get("/", renderTasks);

router.post("/tasks/add", upload.single("photo"), createTask);

router.get("/tasks/:id/toggleDone", taskToggleDone);

router.get("/tasks/:id/edit", renderTaskEdit);

router.post("/tasks/:id/edit", editTask);

router.get("/tasks/:id/delete", deleteTask);

export default router;
