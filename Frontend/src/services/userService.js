import API from "./api";

export const getAllUsers = () =>
  API.get("/users");

export const makeAdmin = (id) =>
  API.put(`/users/${id}/make-admin`);
