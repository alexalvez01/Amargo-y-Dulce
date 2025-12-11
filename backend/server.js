import "dotenv/config";
import express from "express";
import cors from "cors";
import testRoutes from "./src/routes/test.routes.js";
import productRoutes from "./src/routes/products.routes.js";
import cartRoutes from "./src/routes/cart.routes.js";
import favoriteRoutes from "./src/routes/favorites.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use("/api", testRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes); 
app.use("/api/favorites", favoriteRoutes);


app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
