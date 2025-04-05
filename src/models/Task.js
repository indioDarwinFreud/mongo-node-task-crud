// Esquema de mongo DB

import { Schema, model } from "mongoose";

const taskSchema = new Schema(
  {
    title: {
        type: String, // Para que sea de tipo string
        required: true, // Para que salte un error si no se completa
        unique: true, // Es unico para que no se repita
        trim: true, // Para eliminar los espacios de principio a fin
    },
    description: {
        type: String,
        required: true,
    },
    done: {
        type: Boolean,
        default: false, // Para avisar si se tiene tareas pendientes
    },
  },
  {
    timestamps: true,
    versionKey: false, // Para que no muestre una propiedad llamada "_v"
  }
);

export default model ("Task", taskSchema);
