import Task from "../models/Task.js";
import dayjs from "dayjs";
import fs from "fs-extra";
import cloudinary from "../libs/cloudinary.js";

// Mostrar todas las tareas
export const renderTasks = async (req, res) => {
  const tasks = await Task.find().lean();
  const formattedTasks = tasks.map((task) => ({
    ...task,
    educationDates: dayjs(task.educationDates).format("DD/MM/YYYY"),
    jobDates: dayjs(task.jobDates).format("DD/MM/YYYY"),
  }));
  res.render("index", { tasks: formattedTasks });
};

// Crear nueva tarea
export const createTask = async (req, res) => {
  try {
    const { file, body } = req;

    // Validación básica
    if (!body.name || !body.email || !body.phone || !body.profile) {
      return res.status(400).send("Nombre, correo, teléfono y perfil son obligatorios.");
    }

    let photoUrl = "";
    if (file) {
      const result = await cloudinary.uploader.upload(file.path);
      photoUrl = result.secure_url;
      await fs.remove(file.path);
    }

    const task = new Task({
      ...body,
      photo: photoUrl,
    });

    await task.save();
    res.redirect("/");
  } catch (error) {
    console.error("Error al crear la tarea:", error);
    res.status(500).send("Error al crear la tarea");
  }
};

// Mostrar formulario de edición
export const renderTaskEdit = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).lean();
    if (task.educationDates) {
      task.educationDates = dayjs(task.educationDates).format("YYYY-MM-DD");
    }
    if (task.jobDates) {
      task.jobDates = dayjs(task.jobDates).format("YYYY-MM-DD");
    }
    res.render("edit", { task });
  } catch (error) {
    console.error("Error renderizando edición:", error.message);
    res.redirect("/");
  }
};

// Editar tarea existente
export const editTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { file, body } = req;
    const updatedData = { ...body };

    if (file) {
      const result = await cloudinary.uploader.upload(file.path);
      updatedData.photo = result.secure_url;
      await fs.remove(file.path);
    }

    await Task.findByIdAndUpdate(id, updatedData, { new: true });
    res.redirect("/");
  } catch (error) {
    console.error("Error al actualizar la tarea:", error.message);
    res.status(500).send("Error al actualizar la tarea");
  }
};

// Eliminar tarea
export const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (error) {
    console.error("Error al eliminar la tarea:", error.message);
    res.status(500).send("Error al eliminar la tarea");
  }
};

// Alternar estado "done"
export const taskToggleDone = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).send("Tarea no encontrada.");
    task.done = !task.done;
    await task.save();
    res.redirect("/");
  } catch (error) {
    console.error("Error al cambiar el estado de la tarea:", error.message);
    res.status(500).send("Error al cambiar el estado de la tarea");
  }
};
