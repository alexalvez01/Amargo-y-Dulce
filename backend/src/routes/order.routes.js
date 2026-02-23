import { Router } from "express";
import { getPurchaseHistory } from "../controllers/OrderController.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";

const orderRoutes = Router();

orderRoutes.get("/history", authMiddleware, getPurchaseHistory);

export default orderRoutes;