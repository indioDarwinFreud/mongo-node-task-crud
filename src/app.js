import express from "express";
import { create } from 'express-handlebars';
import path from 'path';
import morgan from 'morgan';
import indexRouter from './routes/index.routes.js';

const app = express();

// Configurar vistas
app.set('views', path.join(__dirname, 'views'));

const hbs = create({
  layoutsDir: path.join(app.get('views'), 'layouts'),
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: {
    inc: function (value) {
      return parseInt(value) + 1;
    }
  }
});

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));

// Rutas
app.use(indexRouter);

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

export default app;
