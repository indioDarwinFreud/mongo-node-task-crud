import app from "./app.js";
import "./database.js"; // Conexión a MongoDB
import { PORT } from "./config.js";

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
