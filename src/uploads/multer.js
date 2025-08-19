import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // La carpeta 'uploads' está en el mismo directorio que este archivo
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

export default upload;