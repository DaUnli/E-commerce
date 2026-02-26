import api from "./axios";

export const orderApi = {
  createOrder: (shippingAddress: string) =>
    api.post("/orders", { shippingAddress }),
  getMyOrders: () => api.get("/orders"),
  cancelOrder: (orderId: string) => api.put(`/orders/${orderId}/cancel`),

  // Admin
  getAllOrders: () => api.get("/orders/admin/orders"),
  updateOrderStatus: (orderId: string, orderStatus: string) =>
    api.put(`/orders/${orderId}`, { orderStatus }),
  getCancelledOrders: () => api.get("/orders/admin/orders/cancelled"),
};
