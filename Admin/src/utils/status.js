export const orderStatusMeta = {
  Pending: { color: "amber", label: "Pending" },
  Paid: { color: "blue", label: "Paid" },
  Delivered: { color: "green", label: "Delivered" },
  Cancelled: { color: "red", label: "Cancelled" },
};

export const ORDER_STATUSES = ["Pending", "Paid", "Delivered", "Cancelled"];

export const paymentMethodLabel = (m) => {
  const map = {
    cod: "Cash on Delivery",
    "credit-card": "Credit Card",
    gcash: "GCash",
    paypal: "PayPal",
    bank_transfer: "Bank Transfer",
    wallet: "Wallet",
  };
  return map[m] || m || "—";
};
