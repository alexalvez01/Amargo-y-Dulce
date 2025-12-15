import { Router } from "express";
import {adminMiddleware} from "../middlewares/admin-middleware.js";

import {
  getAllPromotions,
  getPromotionById,
  createPromotion,
  hidePromotion,
  showPromotion
} from "../controllers/PromotionController.js";

const promotionRoutes = Router();

// ---- RUTAS PÚBLICAS ----

promotionRoutes.get("/", getAllPromotions);
promotionRoutes.get("/:id", getPromotionById);


// ---- RUTAS SOLO ADMIN ----


promotionRoutes.post("/", adminMiddleware, createPromotion);
promotionRoutes.patch("/:id/hide", adminMiddleware, hidePromotion);
promotionRoutes.patch("/:id/show", adminMiddleware, showPromotion);

export default promotionRoutes;