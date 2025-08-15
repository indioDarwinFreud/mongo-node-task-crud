import Task from "../models/Task.js";
import dayjs from "dayjs";
import fs from "fs-extra";
import cloudinary from "../libs/cloudinary.js";

// Mostrar todas las tareas
export const renderTasks = async (req, res) => {
  try {
    const tasks = await Task.find().lean();

    const formattedTasks = tasks.map((task) => ({
      ...task,
      educationDatesStart: task.educationDatesStart
        ? dayjs(task.educationDatesStart).format("DD/MM/YYYY")
        : "",
      educationDatesEnd: task.educationDatesEnd
        ? dayjs(task.educationDatesEnd).format("DD/MM/YYYY")
        : "",
      jobDatesStart: task.jobDatesStart
        ? dayjs(task.jobDatesStart).format("DD/MM/YYYY")
        : "",
      jobDatesEnd: task.jobDatesEnd
        ? dayjs(task.jobDatesEnd).format("DD/MM/YYYY")
        : "",
    }));

    res.render("index", { tasks: formattedTasks });
  } catch (error) {
    console.error("Error al renderizar tareas:", error.message);
    res.status(500).send("Error al renderizar las tareas");
  }
};

// Crear nueva tarea
export const createTask = async (req, res) => {
  try {
    const { file, body } = req;

    console.log("BODY recibido:", body);
    console.log("FILE recibido:", file);

    // Validación básica
    if (!body.name || !body.age || !body.email || !body.phone || !body.profile) {
      return res.status(400).send("Nombre, edad, correo, teléfono y perfil son obligatorios.");
    }

    let photoUrl = "";
    if (file) {
      console.log("Subiendo imagen a Cloudinary...");
      const result = await cloudinary.uploader.upload(file.path);
      console.log("Resultado de Cloudinary:", result);
      photoUrl = result.secure_url;
      await fs.remove(file.path);
    } else {
      console.log("No se recibió archivo");
    }

    const task = new Task({
      ...body,
      photo: photoUrl,
      educationDatesStart: new Date(body.educationDatesStart),
      educationDatesEnd: new Date(body.educationDatesEnd),
      jobDatesStart: new Date(body.jobDatesStart),
      jobDatesEnd: new Date(body.jobDatesEnd),
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
    if (task.educationDatesStart) {
      task.educationDatesStart = dayjs(task.educationDatesStart).format("YYYY-MM-DD");
    }
    if (task.educationDatesEnd) {
      task.educationDatesEnd = dayjs(task.educationDatesEnd).format("YYYY-MM-DD");
    }
    if (task.jobDatesStart) {
      task.jobDatesStart = dayjs(task.jobDatesStart).format("YYYY-MM-DD");
    }
    if (task.jobDatesEnd) {
      task.jobDatesEnd = dayjs(task.jobDatesEnd).format("YYYY-MM-DD");
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

    const updatedData = {
      ...body,
      educationDatesStart: new Date(body.educationDatesStart),
      educationDatesEnd: new Date(body.educationDatesEnd),
      jobDatesStart: new Date(body.jobDatesStart),
      jobDatesEnd: new Date(body.jobDatesEnd),
    };

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
