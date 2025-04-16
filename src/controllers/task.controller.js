import Task from "../models/Task.js";
import dayjs from "dayjs";
import fs from "fs";
import path from "path";

export const renderTasks = async (req, res) => {
  const tasks = await Task.find().lean();

  const formattedTasks = tasks.map((task) => ({
    ...task,
    educationDates: dayjs(task.educationDates).format("DD/MM/YYYY"),
    jobDates: dayjs(task.jobDates).format("DD/MM/YYYY"),
  }));

  res.render("index", { tasks: formattedTasks });
};

export const createTask = async (req, res) => {
  try {
    const { file, body } = req;

    // Validación de campos obligatorios
    if (!body.name || !body.email) {
      return res.status(400).send("El nombre y el correo electrónico son obligatorios.");
    }

    const task = new Task({
      ...body,
      photo: file ? file.filename : null, // Guarda el nombre del archivo si se subió una foto
    });

    await task.save();
    res.redirect("/");
  } catch (error) {
    console.error("Error al crear la tarea:", error.message);
    res.status(500).send("Error al crear la tarea");
  }
};

export const renderTaskEdit = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).lean();

    // Formatear fechas para que el input type="date" las entienda
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

export const editTask = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Datos recibidos:", req.body);
    console.log("Archivo subido:", req.file);

    const updatedData = { ...req.body };

    // Si se sube una nueva foto, actualiza el campo "photo"
    if (req.file) {
      updatedData.photo = req.file.filename;
    }

    await Task.findByIdAndUpdate(id, updatedData, { new: true });

    res.redirect("/");
  } catch (error) {
    console.error("Error al actualizar la tarea:", error.message);
    res.status(500).send("Error al actualizar la tarea");
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;

  await Task.findByIdAndDelete(id);
  res.redirect("/");
};

export const taskToggleDone = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).send("Tarea no encontrada.");
    }

    task.done = !task.done;

    await task.save();

    res.redirect("/");
  } catch (error) {
    console.error("Error al cambiar el estado de la tarea:", error.message);
    res.status(500).send("Error al cambiar el estado de la tarea");
  }
};
