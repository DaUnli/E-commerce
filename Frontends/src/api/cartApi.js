import api from "./axios";

export const cartApi = {
  getCart: () => api.get("/cart"),

  addToCart: (productId, quantity) =>
    api.post("/cart", { productId, quantity }),

  updateQuantity: (productId, quantity) =>
    api.put(`/cart/${productId}`, { quantity }),

  removeFromCart: (productId) =>
    api.delete(`/cart/${productId}`),
};