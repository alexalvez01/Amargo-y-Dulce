import axios from "./axios";

export const getLatestOrderDetailRequest = () => axios.get("/orders/latest");
export const saveOrderDetailDataRequest = (payload) => axios.post("/orders/details", payload);
export const getPurchaseHistoryRequest = () => axios.get("/orders/my-orders");
