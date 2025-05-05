import Task from "../models/Task.js";
import dayjs from "dayjs";
import fs from "fs-extra";
import cloudinary from "../libs/cloudinary.js";

// Crear tarea
export const createTask = async (req, res) => {
  try {
    const { file, body } = req;

    // Validación básica
    if (!body.name || !body.email || !body.phone || !body.profile) {
      return res.status(400).send("Nombre, correo, teléfono y perfil son obligatorios.");
    }

    let photoUrl = "";

    // Si hay archivo, sube la foto a Cloudinary
    if (file) {
      const result = await cloudinary.uploader.upload(file.path);
      photoUrl = result.secure_url;
      await fs.remove(file.path);
    }

    const task = new Task({
      ...body,
      photo: photoUrl,
    });

    // Guardar tarea en la base de datos
    await task.save();
    res.redirect("/");
  } catch (error) {
    console.error("Error al crear la tarea:", error.message);
    res.status(500).send("Error al crear la tarea");
  }
};
