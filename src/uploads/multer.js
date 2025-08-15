import multer from "multer";
import path from "path";
import { fileURLToPath } from "url"; // Importa la función para obtener la ruta del archivo

// Convierte la URL del archivo a una ruta de archivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Usa la ruta `__dirname` que acabas de definir
    cb(null, path.join(__dirname, '..', '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

export default upload;