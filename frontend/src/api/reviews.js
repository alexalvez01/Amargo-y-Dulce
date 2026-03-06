import axios from "./axios";

// Pide las reseñas de un producto (GET /product/:productId)
export const getProductReviewsRequest = (productId) => axios.get(`/reviews/product/${productId}`);

// Crea una nueva reseña (POST /create)
// El body debe tener: { productId, calificacion, comentario }
export const createReviewRequest = (data) => axios.post(`/reviews/create`, data);

// Elimina una reseña del usuario logueado (DELETE /delete/:productId)
export const deleteReviewRequest = (productId) => axios.delete(`/reviews/delete/${productId}`);