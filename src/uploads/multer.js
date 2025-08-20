import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // La carpeta 'uploads' está al mismo nivel que este archivo multer.js
    // Esto es lo que causó el error ENOENT: se busca la carpeta en un lugar diferente
    cb(null, "./");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });
export default upload;