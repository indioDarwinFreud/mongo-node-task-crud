import PDFDocument from "pdfkit";

export function buildPDF(dataCallback, endCallback, cvData) {
    const doc = new PDFDocument();

    doc.on("data", dataCallback);
    doc.on("end", endCallback);

    // Encabezado
    doc.fontSize(20).text("Curriculum Vitae", { align: "center" });
    doc.moveDown();

    // Foto
    if (cvData.photo) {
        doc.image(`uploads/${cvData.photo}`, {
            fit: [100, 100],
            align: "center",
        });
        doc.moveDown();
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
    doc.text(`Fechas: ${cvData.educationDates}`);
    doc.moveDown();

    // Experiencia laboral
    doc.fontSize(16).text("Experiencia Laboral", { underline: true });
    doc.fontSize(12).text(`Cargo: ${cvData.jobTitle}`);
    doc.text(`Empresa: ${cvData.company}`);
    doc.text(`Fechas: ${cvData.jobDates}`);
    doc.text(`Descripción: ${cvData.jobDescription}`);
    doc.moveDown();

    // Idiomas
    doc.fontSize(16).text("Idiomas", { underline: true });
    doc.fontSize(12).text(cvData.languages);
    doc.moveDown();

    // Finaliza el documento
    doc.end();
}