import axios from "./axios";

export const getPromotionsRequest = () => axios.get("/promotions");
export const hidePromotionRequest = (id) => axios.patch(`/promotions/${id}/hide`);
export const showPromotionRequest = (id) => axios.patch(`/promotions/${id}/show`);