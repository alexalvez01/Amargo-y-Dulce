/**
 * Servicios de API para Promociones.
 * Rutas para obtener, crear y gestionar el estado (visible/oculto) de las promociones.
 */
import axios from "./axios";

export const getPromotionsRequest = (adminView = false) => axios.get(adminView ? "/promotions?adminView=true" : "/promotions");
export const hidePromotionRequest = (id) => axios.patch(`/promotions/${id}/hide`);
export const showPromotionRequest = (id) => axios.patch(`/promotions/${id}/show`);
export const createPromotionRequest = (payload) => axios.post("/promotions", payload);