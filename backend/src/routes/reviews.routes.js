import { Router } from "express";
import { authMiddleware } from "../middlewares/auth-middleware.js";
import {
    getReviewsByProduct,
    createReview,
    deleteReview
} from "../controllers/ReviewController.js";

const reviewRoutes = Router();

reviewRoutes.get("/product/:productId", getReviewsByProduct);
reviewRoutes.post("/create", authMiddleware, createReview);
reviewRoutes.delete("/delete/:productId", authMiddleware, deleteReview);

export default reviewRoutes;
