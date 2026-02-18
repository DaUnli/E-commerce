import API from "./api";

// Get all products
export const getProducts = () =>
  API.get("/products");

// Get single product
export const getProductById = (id) =>
  API.get(`/products/${id}`);

// Admin create product
export const createProduct = (data) =>
  API.post("/products", data);

// Admin update product
export const updateProduct = (id, data) =>
  API.put(`/products/${id}`, data);

// Admin delete product
export const deleteProduct = (id) =>
  API.delete(`/products/${id}`);
