import Task from "../models/Task.js";
import dayjs from "dayjs";
import fs from "fs-extra";
import cloudinary from "../libs/cloudinary.js";

// Crear tarea
export const createTask = async (req, res) => {
  const { file, body } = req;

  // Validación básica
  if (!body.name || !body.email || !body.phone || !body.profile) {
    return res.status(400).json({ error: "Todos los campos son obligatorios." });
  }

  try {
    let photoUrl = "";

    // Subir foto a Cloudinary si existe
    if (file) {
      const result = await cloudinary.uploader.upload(file.path);
      photoUrl = result.secure_url;
      await fs.remove(file.path); // Eliminar archivo local después de subirlo
    }

    // Crear nueva tarea
    const task = new Task({
      ...body,
      photo: photoUrl,
    });

    // Guardar tarea en la base de datos
    await task.save();
    res.status(201).json({ message: "Tarea creada exitosamente", task });
  } catch (error) {
    console.error("Error al crear la tarea:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
