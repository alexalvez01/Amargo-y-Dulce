import { Router } from "express";
import { 
    getAllProducts,
    searchProducts,
    filterProducts,
    getProductById,
    createProduct,
    updateProduct,
    hideProduct,
    showProduct
} from "../controllers/ProductController.js";

import {
    adminMiddleware
} from "../middlewares/admin-middleware.js";

const productRoutes = Router();

// ---- RUTAS PÚBLICAS ----
productRoutes.get("/", getAllProducts);
productRoutes.get("/search", searchProducts);
productRoutes.get("/filter", filterProducts);
productRoutes.get("/:id", getProductById);

// ---- RUTAS SOLO ADMIN ----
productRoutes.post("/", adminMiddleware, createProduct);
productRoutes.put("/:id", adminMiddleware, updateProduct);
productRoutes.patch("/:id/hide", adminMiddleware, hideProduct);
productRoutes.patch("/:id/show", adminMiddleware, showProduct);


export default productRoutes;
