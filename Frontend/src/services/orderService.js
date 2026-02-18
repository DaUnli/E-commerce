import API from "./api";

export const createOrder = (data) =>
  API.post("/orders", data);

export const getMyOrders = () =>
  API.get("/orders");

export const cancelOrder = (id) =>
  API.put(`/orders/${id}/cancel`);

export const getAllOrders = () =>
  API.get("/orders/admin/orders");

export const getCancelledOrders = () =>
  API.get("/orders/admin/orders/cancelled");
