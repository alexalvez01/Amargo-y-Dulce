/**
 * Servicios de API para Órdenes y Pedidos.
 * Incluye registro de nuevas compras, obtención del último detalle y el historial.
 */
import axios from "./axios";

export const getLatestOrderDetailRequest = () => axios.get("/orders/latest");
export const saveOrderDetailDataRequest = (payload) => axios.post("/orders/details", payload);
export const getPurchaseHistoryRequest = () => axios.get("/orders/my-orders");
