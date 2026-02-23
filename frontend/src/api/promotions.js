import axios from "./axios";

export const getPromotionsRequest = () => axios.get("/promotions");
export const hidePromotionRequest = (id) => axios.patch(`/promotions/${id}/hide`);