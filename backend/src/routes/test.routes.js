import { Router } from "express";
import { ping, getProductos, crearPromocion } from "../controllers/TestController.js";

const testRoutes = Router();

// Rutas de prueba
testRoutes.get("/ping", ping);
testRoutes.get("/productos", getProductos);
testRoutes.post("/promocion", crearPromocion);

export default testRoutes;