import api from './axios';

export const authApi = {
  register: (data: { name: string; email: string; password: string; address?: string }) =>
    api.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  logout: () => api.post('/auth/logout'),

  getProfile: () => api.get('/auth/profile'),
};