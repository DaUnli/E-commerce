import api from "./axios";

export const orderApi = {
  createOrder: (shippingAddress) =>
    api.post("/orders", { shippingAddress }),

  getMyOrders: () => api.get("/orders"),

  cancelOrder: (orderId) =>
    api.put(`/orders/${orderId}/cancel`),

  // Admin
  getAllOrders: () =>
    api.get("/orders/admin/orders"),

  updateOrderStatus: (orderId, orderStatus) =>
    api.put(`/orders/${orderId}`, { orderStatus }),

  getCancelledOrders: () =>
    api.get("/orders/admin/orders/cancelled"),
};