import express from "express";
import { create } from "express-handlebars";
import path from "path";
import morgan from "morgan";
import indexRouter from "./routes/index.routes.js";
import { fileURLToPath } from "url";
import fs from "fs";

const app = express();

// Rutas de archivo: ¡Define __filename y __dirname primero!
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crea la carpeta 'uploads' si no existe
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Configurar vistas
app.set("views", path.join(__dirname, "views"));
const hbs = create({
    layoutsDir: path.join(app.get("views"), "layouts"),
    defaultLayout: "main",
    extname: ".hbs",
    helpers: {
        inc: function (value) {
            return parseInt(value) + 1;
        }
    }
});
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");

// Middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

// Rutas
app.use(indexRouter);

// Archivos estáticos
app.use(express.static(path.join(__dirname, "public")));
// Asegúrate de que esta ruta '/uploads' apunte a la misma carpeta 'uploads'
// que está en la raíz del proyecto si 'public' también está en la raíz de 'src'
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 

export default app;