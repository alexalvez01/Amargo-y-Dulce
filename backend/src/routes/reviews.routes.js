import { Router } from "express";
import {
    getReviewsByProduct,
    createReview,
    deleteReview
} from "../controllers/ReviewController.js";

const reviewRoutes = Router();

reviewRoutes.get("/product/:productId", getReviewsByProduct);
reviewRoutes.post("/create", createReview);
reviewRoutes.delete("/delete/:userId/:productId", deleteReview);

export default reviewRoutes;
