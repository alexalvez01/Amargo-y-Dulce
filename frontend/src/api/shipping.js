import axios from "./axios";

export const getActiveShipmentsRequest = () => axios.get("/shipping/shipments/active");
export const advanceShipmentStatusRequest = (idEnvio) => axios.put(`/shipping/shipments/${idEnvio}/next`);
export const cancelShipmentRequest = (idEnvio) => axios.put(`/shipping/shipments/${idEnvio}/cancel`);
