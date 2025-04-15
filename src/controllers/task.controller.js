import Task from "../models/Task.js";
import dayjs from "dayjs";

export const renderTasks = async (req, res) => {
  const tasks = await Task.find().lean();

  const formattedTasks = tasks.map(task => ({
    ...task,
    educationDates: dayjs(task.educationDates).format("DD/MM/YYYY"),
    jobDates: dayjs(task.jobDates).format("DD/MM/YYYY"),
  }));

  res.render("index", { tasks: formattedTasks });
};


export const createTask = async (req, res) => {
  try {
    const { file, body } = req;
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

    res.render("edit", { task });
  } catch (error) {
    console.log(error.mesaage);
  }
};

export const editTask = async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndUpdate(id, req.body);
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
  const { id } = req.params;

  const task = await Task.findById(id);

  console.log(task);

  task.done = !task.done;

  await task.save();

  res.redirect("/");
};


