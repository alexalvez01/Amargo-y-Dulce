import "dotenv/config";
import express from "express";
import cors from "cors";
import testRoutes from "./src/routes/test.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use("/api", testRoutes);

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
