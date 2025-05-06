import { Router } from "express";
import upload from "../uploads/multer.js";
import {
  renderTasks,
  createTask,
  renderTaskEdit,
  editTask,
  deleteTask,
  taskToggleDone,
} from "../controllers/task.controller.js";

import { buildPDF } from "../libs/pdfKit.js"; // Corregido: ruta relativa
import Task from "../models/Task.js";

const router = Router();

router.get("/cv/pdf/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).send("CV no encontrado");

    const cvData = task; // Le pasamos los datos del CV

    // Creamos el flujo de respuesta para el PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=cv-${task._id}.pdf`);
    
    // Llamamos a buildPDF pasando el flujo de respuesta de Express
    buildPDF(
      (chunk) => res.write(chunk), // Enviamos los datos al cliente en trozos
      () => res.end(), // Cerramos la respuesta al finalizar
      cvData // Los datos del CV
    );
  } catch (err) {
    console.error("Error en la ruta:", err);
    res.status(500).send("Error interno");
  }
});

router.get("/", renderTasks);

router.post("/tasks/add", upload.single("photo"), createTask);

router.get("/tasks/:id/toggleDone", taskToggleDone);

router.get("/tasks/:id/edit", renderTaskEdit);

router.post("/tasks/:id/edit", upload.single("photo"), editTask);

router.get("/tasks/:id/delete", deleteTask);

export default router;
