import PDFDocument from "pdfkit";
import dayjs from "dayjs";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";

export const buildPDF = async (dataCallback, endCallback, cvData) => {
  const doc = new PDFDocument();

  doc.on("data", dataCallback);
  doc.on("end", endCallback);

  // Formateo de fechas
  const formattedEducationDate = dayjs(cvData.educationDates).format("DD/MM/YYYY");
  const formattedJobDate = dayjs(cvData.jobDates).format("DD/MM/YYYY");

  // Encabezado
  doc.fontSize(20).text("Curriculum Vitae", { align: "center" });
  doc.moveDown();

  // Foto desde Cloudinary
  if (cvData.photo) {
    try {
      // Extraer public_id desde la URL original de Cloudinary
      const matches = cvData.photo.match(/\/upload\/(?:v\d+\/)?(.+)\.(jpg|jpeg|png|webp|gif)$/);
      if (!matches || !matches[1]) {
        throw new Error("No se pudo extraer el public_id de la URL de Cloudinary.");
      }

      const publicId = matches[1]; // sin extensión

      // Generar una nueva URL con formato JPG desde Cloudinary
      const jpgUrl = cloudinary.url(publicId, {
        format: "jpg",
        transformation: [{ width: 100, height: 100, crop: "limit" }],
      });

      const response = await axios.get(jpgUrl, { responseType: "arraybuffer" });
      const imageBuffer = Buffer.from(response.data, "binary");

      const contentType = response.headers["content-type"];
      if (!contentType.startsWith("image/")) {
        throw new Error("El archivo no es una imagen válida.");
      }

      doc.image(imageBuffer, {
        fit: [100, 100],
        align: "center",
      });
      doc.moveDown();
    } catch (error) {
      if (error.response) {
        console.error(`Error HTTP al intentar obtener la imagen: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        console.error("No se recibió respuesta del servidor al intentar obtener la imagen.");
      } else {
        console.error("Error al procesar la imagen:", error.message);
      }
    }
  }

  // Datos personales
  doc.fontSize(16).text("Datos Personales", { underline: true });
  doc.fontSize(12).text(`Nombre: ${cvData.name}`);
  doc.text(`Teléfono: ${cvData.phone}`);
  doc.text(`Correo Electrónico: ${cvData.email}`);
  doc.text(`Perfil: ${cvData.profile}`);
  doc.moveDown();

  // Formación académica
  doc.fontSize(16).text("Formación Académica", { underline: true });
  doc.fontSize(12).text(`Título: ${cvData.degree}`);
  doc.text(`Institución: ${cvData.institution}`);
  doc.text(`Fechas: ${formattedEducationDate}`);
  doc.moveDown();

  // Experiencia laboral
  doc.fontSize(16).text("Experiencia Laboral", { underline: true });
  doc.fontSize(12).text(`Cargo: ${cvData.jobTitle}`);
  doc.text(`Empresa: ${cvData.company}`);
  doc.text(`Fechas: ${formattedJobDate}`);
  doc.text(`Descripción: ${cvData.jobDescription}`);
  doc.moveDown();

  // Idiomas
  doc.fontSize(16).text("Idiomas", { underline: true });
  doc.fontSize(12).text(cvData.languages);
  doc.moveDown();

  // Finaliza el documento
  doc.end();
};
