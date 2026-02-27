// src/routes/payment.routes.js
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth-middleware.js";
import {
  createPaymentPreference,
  confirmPayment,
  handlePaymentSuccessReturn,
  handlePaymentPendingReturn,
  handlePaymentFailureReturn
} from "../controllers/PaymentController.js";

const paymentRoutes = Router();

paymentRoutes.post("/create", authMiddleware, createPaymentPreference);
paymentRoutes.post("/confirm", authMiddleware, confirmPayment);
paymentRoutes.get("/return/success", handlePaymentSuccessReturn);
paymentRoutes.get("/return/pending", handlePaymentPendingReturn);
paymentRoutes.get("/return/failure", handlePaymentFailureReturn);

export default paymentRoutes;
