import { Router } from "express";
import {
  getActiveCart,
  addProductToCart,
  updateProductQuantity,
  removeProductFromCart,
  confirmCart
} from "../controllers/CartController.js";

const cartRoutes = Router();

//Obtener el carrito activo del usuario
cartRoutes.get("/:idUsuario", getActiveCart);

// Agregar producto al carrito
cartRoutes.post("/add", addProductToCart);

// Modificar cantidad de producto en el carrito
cartRoutes.put("/update", updateProductQuantity);

// Eliminar producto del carrito    
cartRoutes.delete("/remove", removeProductFromCart);

// Cambiar estado a "confirmado"
cartRoutes.put("/confirmar/:idCarrito", confirmCart);

export default cartRoutes;