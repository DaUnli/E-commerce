import API from "./api";

export const payOrder = (orderId) =>
  API.put(`/payments/${orderId}`);
