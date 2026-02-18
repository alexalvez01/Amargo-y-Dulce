import { Router } from "express";
import { getPurchaseHistory } from "../controllers/OrderController.js";
import { authMiddleware } from "../middlewares/auth-Middleware.js";

const orderRoutes = Router();

orderRoutes.get("/orders/history", authMiddleware, getPurchaseHistory);

export default orderRoutes;