import api from "./axios";

export const authApi = {
  login: (data) => api.post("/auth/login", data),
  profile: () => api.get("/auth/profile"),
};

export const productApi = {
  getAll: () => api.get("/products"),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post("/products", data),
  update: (id, data) => api.put(`/products/${id}`, data),
  remove: (id) => api.delete(`/products/${id}`),
};

export const orderApi = {
  getAll: () => api.get("/orders/admin/orders"),
  getCancelled: () => api.get("/orders/admin/orders/cancelled"),
  updateStatus: (id, status) => api.put(`/orders/${id}`, { orderStatus: status }),
};

export const customerApi = {
  getAll: () => api.get("/users"),
};

export const statsApi = {
  overview: () => api.get("/admin/stats"),
};
