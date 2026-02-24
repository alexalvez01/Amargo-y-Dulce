import axios from './axios';

export const getFavoritesRequest = () => axios.get('/favorites');
export const removeFavoriteRequest = (productId) => axios.delete(`/favorites/remove/${productId}`);
export const toggleFavoriteRequest = (productId) => axios.post('/favorites/toggle', { productId });
export const addFavoriteRequest = (productId) => axios.post('/favorites/add', { productId });