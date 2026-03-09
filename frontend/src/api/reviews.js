import axios from "./axios";

// Pide las reseñas de un producto (GET /product/:productId)
export const getProductReviewsRequest = (productId) => axios.get(`/reviews/product/${productId}`);

// Crea una nueva reseña (POST /create)
export const createReviewRequest = (data) => axios.post(`/reviews/create`, data);

// Elimina una reseña del usuario logueado (DELETE /delete/:productId)
export const deleteReviewRequest = (productId) => axios.delete(`/reviews/delete/${productId}`);

// Para que el admin borre el comentario de cualquiera
export const deleteReviewAsAdminRequest = (idProducto, idUsuario) =>
    axios.delete(`/reviews/delete-admin/${idUsuario}/${idProducto}`);