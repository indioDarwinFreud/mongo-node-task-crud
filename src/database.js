import { connect } from 'mongoose';
import { MONGODB_URI } from './config.js';

(async () => {
  try {
    const db = await connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 30000, // 30 segundos
      serverSelectionTimeoutMS: 30000, // 30 segundos
    });
    console.log("DB connected to", db.connection.name);
  } catch (error) {
    console.error("❌ Error al conectar con MongoDB:", error);
    process.exit(1);  // Detener la app si no se conecta a la base de datos
  }
})();
