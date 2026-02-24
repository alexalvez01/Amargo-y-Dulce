import axios from "./axios";

// Petición para agregar un producto al carrito
export const addToCartRequest = (idProducto, cantidad) => {
  return axios.post(`/cart/add`, { 
    idProducto, 
    cantidad 
  });
};

// Te dejo preparadas las demás funciones para cuando hagamos la página del carrito:
export const getActiveCartRequest = () => axios.get(`/cart`);
export const updateCartQuantityRequest = (data) => axios.put(`/cart/update`, data);
export const removeProductFromCartRequest = (data) => axios.delete(`/cart/remove`, { data });