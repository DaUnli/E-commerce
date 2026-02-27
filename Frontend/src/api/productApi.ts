import api from './axios';

export const productApi = {
  // Search products by query
  

  getById: (id: string) => api.get(`/products/${id}`),
  
  // Admin
  create: (data: any) => api.post('/products', data),
  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
};