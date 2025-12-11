import { Router } from "express";
import {
    getFavorites,
    addFavorite,
    removeFavorite,
    toggleFavorite
} from "../controllers/FavoriteController.js";

const favoriteRoutes = Router();
// para coseguir favoritos de un usuario
favoriteRoutes.get("/:userId", getFavorites);
// para agregar un favorito
favoriteRoutes.post("/add", addFavorite);
// para eliminar un favorito
favoriteRoutes.delete("/remove/:userId/:productId", removeFavorite);
// para alternar un favorito
favoriteRoutes.post("/toggle", toggleFavorite);

export default favoriteRoutes;