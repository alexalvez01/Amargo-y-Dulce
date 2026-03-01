// src/routes/payment.routes.js
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth-middleware.js";
import {
  createPaymentPreference,
  confirmPayment,
} from "../controllers/PaymentController.js";

const paymentRoutes = Router();

paymentRoutes.post("/create", authMiddleware, createPaymentPreference);
paymentRoutes.post("/confirm", authMiddleware, confirmPayment);

export default paymentRoutes;
