import app from "./app";
import './database.js';
import {PORT} from './config.js';

app.listen(PORT);
console.log("server on port", PORT);
