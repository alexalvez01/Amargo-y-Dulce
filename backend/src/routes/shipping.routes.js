import { Router } from "express";
import {
  getActiveShipments,
  advanceShipmentStatus
} from "../controllers/ShippingController.js";

import { adminMiddleware } from "../middlewares/admin-Middleware.js";
import { authMiddleware } from "../middlewares/auth-Middleware.js";


const shippingRoutes = Router();

shippingRoutes.get("/shipments/active", authMiddleware, adminMiddleware, getActiveShipments);

shippingRoutes.put("/shipments/:idEnvio/next", authMiddleware, adminMiddleware, advanceShipmentStatus);

export default shippingRoutes;