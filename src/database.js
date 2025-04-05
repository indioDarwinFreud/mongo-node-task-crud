import { connect } from "mongoose";
import { MONGODB_URI } from "./config";


(async () => {
  try {
    console.log();
    const db = await connect(MONGODB_URI);
    console.log("DB connected to", db.connection.name);
  } catch (error) {
    console.error("❌ Error al conectar con MongoDB:", error);
  }
})();
