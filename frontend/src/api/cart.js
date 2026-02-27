import axios from "./axios";

// Petición para agregar un producto (la que ya teníamos)
export const addToCartRequest = (idProducto, cantidad) => {
  return axios.post(`/cart/add`, { idProducto, cantidad });
};


// Obtener todo el carrito activo
export const getActiveCartRequest = () => axios.get(`/cart`);

// Modificar la cantidad (recibe el id del carrito, el id del producto y la nueva cantidad)
export const updateCartQuantityRequest = (idCarrito, idProducto, cantidad) => {
  return axios.put(`/cart/update`, { idCarrito, idProducto, cantidad });
};

// Eliminar un producto entero del carrito
export const removeProductFromCartRequest = (idCarrito, idProducto) => {
  return axios.delete(`/cart/remove`, { data: { idCarrito, idProducto } });
};

// Confirmar el carrito
export const confirmCartRequest = (idCarrito) => {
  return axios.put(`/cart/confirm/${idCarrito}`);
};