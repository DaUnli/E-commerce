// RBAC based on the real `role` field returned by the backend auth endpoints.
// The seeded backend has `admin` (full access) and `user` (regular customer).
export const ROLES = {
  admin: {
    key: "admin",
    label: "Admin",
    color: "primary",
    permissions: "*",
  },
  user: {
    key: "user",
    label: "Customer",
    color: "gray",
    permissions: ["dashboard"],
  },
};

export const ROLE_KEYS = Object.keys(ROLES);

export const isAdmin = (role) => role === "admin";

export const canAccess = (role, module) => {
  if (!role) return false;
  const meta = ROLES[role];
  if (!meta) return false;
  if (meta.permissions === "*") return true;
  return meta.permissions.includes(module);
};
