/**
 * Servicios de API para Pagos.
 * Maneja la creación de preferencias de pago (MercadoPago u otros) y su posterior confirmación.
 */
import axios from "./axios";

export const createPaymentPreferenceRequest = (idFactura) =>
  axios.post("/payments/create", { idFactura });

export const confirmPaymentRequest = (idFactura) =>
  axios.post("/payments/confirm", { idFactura });
