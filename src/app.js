import express from "express";
import { create } from 'express-handlebars'; // Cambiado para usar la nueva forma de importar
import indexRouter from './routes/index.routes.js';
import path from 'path';
import morgan from 'morgan';

const app = express();

app.set('views', path.join(__dirname, 'views'));

// Crear una instancia del motor de plantillas
const hbs = create({
    layoutsDir: path.join(app.get('views'), 'layouts'),
    defaultLayout: 'main',
    extname: '.hbs',
});

// Registrar el motor de plantillas en Express
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false}));

// Routes
app.use(indexRouter);

// Static files (Archivos estáticos)
app.use(express.static(path.join(__dirname, 'public')));
export default app;