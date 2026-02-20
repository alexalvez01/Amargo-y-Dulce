import "dotenv/config";
import express from "express";
import cors from "cors";
import productRoutes from "./src/routes/products.routes.js";
import cartRoutes from "./src/routes/cart.routes.js";
import favoriteRoutes from "./src/routes/favorites.routes.js";
import reviewRoutes from "./src/routes/reviews.routes.js";
import promotionRoutes from "./src/routes/promotions.routes.js";
import paymentRoutes from "./src/routes/payments.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import orderRoutes from "./src/routes/order.routes.js";
import shippingRoutes from "./src/routes/shipping.routes.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));
app.use(express.json());

// Rutas
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes); 
app.use("/api/favorites", favoriteRoutes);
app.use("/api/reviews", reviewRoutes); 
app.use("/api/promotions", promotionRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/shipping", shippingRoutes);


app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
