import PDFDocument from "pdfkit";
import dayjs from "dayjs";
import axios from "axios";

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
      const response = await axios.get(cvData.photo, { responseType: "arraybuffer" });
      const imageBuffer = Buffer.from(response.data, "binary");

      // Verifica si la imagen tiene un tipo MIME válido
      const contentType = response.headers['content-type'];
      if (!contentType.startsWith("image/")) {
        throw new Error("El archivo no es una imagen válida.");
      }

      doc.image(imageBuffer, {
        fit: [100, 100],
        align: "center",
      });
      doc.moveDown();
    } catch (error) {
      // Manejo de errores detallado
      if (error.response) {
        // Error de respuesta HTTP
        console.error(`Error HTTP al intentar obtener la imagen: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        // No se recibió respuesta del servidor
        console.error("No se recibió respuesta del servidor al intentar obtener la imagen.");
      } else {
        // Otros errores, como problemas con la configuración
        console.error("Error al realizar la solicitud para la imagen:", error.message);
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
