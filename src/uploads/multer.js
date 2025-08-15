import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // La ruta `__dirname` te lleva a `src/uploads/`. 
    // `..` sube un nivel, a `src/`. 
    // Otro `..` te sube a la raíz del proyecto, donde está tu carpeta `uploads`.
    cb(null, path.join(__dirname, '..', '..', 'uploads')); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

export default upload;