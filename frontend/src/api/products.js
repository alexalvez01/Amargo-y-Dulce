import axios from "./axios";

export const getProductsRequest = () => axios.get("/products");

export const createProductRequest = (product) =>
  axios.post("/products", product);

export const hideProductRequest = (id) =>
  axios.patch(`/products/${id}/hide`);

export const showProductRequest = (id) => axios.patch(`/products/${id}/show`);

export const getProductRequest = (id) => axios.get(`/products/${id}`);

export const getTopSalesProductsRequest = () => axios.get("/products/top-sales");