import Task from "../models/Task";

export const renderTasks = async (req, res) => {
  const tasks = await Task.find().lean();
  res.render("index", { tasks: tasks });
};

export const createTask = async (req, res) => {
  // Guardar datos en la base de datos
  try {
    const task = Task(req.body);

    await task.save();

    res.redirect("/");
  } catch (error) {
    console.log(
      "Te estás mandando cualquiera, acabás de escribir lo mismo que ya estaba escrito",
      error
    );
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
  }
