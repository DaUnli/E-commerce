import api from "./axios";

export const cartApi = {
  getCart: () => api.get("/cart"),
  addToCart: (productId: string, quantity: number) =>
    api.post("/cart", { productId, quantity }),
  updateQuantity: (productId: string, quantity: number) =>
    api.put(`/cart/${productId}`, { quantity }),
  removeFromCart: (productId: string) => api.delete(`/cart/${productId}`),
};
