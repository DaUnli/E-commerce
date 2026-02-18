import API from "./api";

export const getCart = () =>
  API.get("/cart");

export const addToCart = (data) =>
  API.post("/cart", data);

export const updateCart = (id, data) =>
  API.put(`/cart/${id}`, data);

export const removeFromCart = (id) =>
  API.delete(`/cart/${id}`);
