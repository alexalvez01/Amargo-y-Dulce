import axios from "./axios";

export const createPaymentPreferenceRequest = (idFactura) =>
  axios.post("/payments/create", { idFactura });

export const confirmPaymentRequest = (idFactura) =>
  axios.post("/payments/confirm", { idFactura });
