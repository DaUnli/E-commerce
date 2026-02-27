import api from "./axios";
import type { Product } from "../types";

export const productApi = {
  getAll: () =>
    api.get<{ success: boolean; products: Product[] }>("/products"),

  getById: (id: string) =>
    api.get<{ success: boolean; product: Product }>(`/products/${id}`),

  create: (data: Product) =>
    api.post<{ success: boolean; product: Product }>("/products", data),

  update: (id: string, data: Partial<Product>) =>
    api.put<{ success: boolean; product: Product }>(`/products/${id}`, data),

  delete: (id: string) =>
    api.delete<{ success: boolean }>(`/products/${id}`),
};