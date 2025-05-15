// Esquema de MongoDB adaptado a los datos del formulario

import { Schema, model } from "mongoose";

const taskSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    profile: {
      type: String,
      required: true,
      trim: true,
    },
    degree: {
      type: String,
      required: true,
      trim: true,
    },
    institution: {
      type: String,
      required: true,
      trim: true,
    },
    educationDatesStart: {
      type: Date, // Campo de tipo fecha
      required: true,
    },
    educationDatesEnd: {
      type: Date, // Campo de tipo fecha
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    jobDatesStart: {
      type: Date, // Campo de tipo fecha
      required: true,
    },
    jobDatesEnd: {
      type: Date, // Campo de tipo fecha
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
      trim: true,
    },
    languages: {
      type: String,
      required: true,
      trim: true,
    },
    photo: {
      type: String, // Almacena el nombre del archivo de la foto
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false, // Para que no muestre una propiedad llamada "_v"
  }
);

export default model("Task", taskSchema);
