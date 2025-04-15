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
import { buildPDF } from "../libs/pdfkit.js";
import Task from "../models/Task.js";

const router = Router();

router.get("/cv/pdf/:id", async (req, res) => {
  try {
    const cvData = await Task.findById(req.params.id).lean(); // Obtén los datos del CV desde la base de datos

    if (!cvData) {
      return res.status(404).send("No se encontró el CV");
    }

    const stream = res.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${cvData.name}_CV.pdf`,
    });

    buildPDF(
      (chunk) => stream.write(chunk),
      () => stream.end(),
      cvData // Pasa los datos del CV a la función buildPDF
    );
  } catch (error) {
    console.error("Error al generar el CV en PDF:", error.message);
    res.status(500).send("Error al generar el CV en PDF");
  }
});

router.get("/", renderTasks);

router.post("/tasks/add", upload.single("photo"), createTask);

router.get("/tasks/:id/toggleDone", taskToggleDone);

router.get("/tasks/:id/edit", renderTaskEdit);

router.post("/tasks/:id/edit", editTask);

router.get("/tasks/:id/delete", deleteTask);

export default router;
