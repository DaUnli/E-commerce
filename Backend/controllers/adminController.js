import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

const todayStart = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export const getStats = async (req, res) => {
  try {
    const [orders, products, users, lowStock] = await Promise.all([
      Order.find({}),
      Product.find({}),
      User.find({}),
      Product.find({ stock: { $lte: 10 } }),
    ]);

    const start = todayStart();
    const dayOrders = orders.filter((o) => new Date(o.createdAt) >= start);

    const revenue = orders
      .filter((o) => o.status !== "Cancelled")
      .reduce((s, o) => s + (o.total || 0), 0);
    const dayRevenue = dayOrders
      .filter((o) => o.status !== "Cancelled")
      .reduce((s, o) => s + (o.total || 0), 0);
    const profit = orders
      .filter((o) => o.status !== "Cancelled")
      .reduce(
        (s, o) =>
          s +
          o.items.reduce(
            (si, i) => si + (i.price - (i.cost || 0)) * i.quantity,
            0
          ),
        0
      );

    const orderCounts = {
      Pending: orders.filter((o) => o.status === "Pending").length,
      Paid: orders.filter((o) => o.status === "Paid").length,
      Delivered: orders.filter((o) => o.status === "Delivered").length,
      Cancelled: orders.filter((o) => o.status === "Cancelled").length,
    };

    res.json({
      kpis: {
        totalRevenue: revenue,
        todayRevenue: dayRevenue,
        orders: orders.length,
        todayOrders: dayOrders.length,
        aov: orders.length ? revenue / orders.length : 0,
        profit,
        customers: users.length,
      },
      pipeline: orderCounts,
      lowStock,
      totalProducts: products.length,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getRecentOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 }).limit(8);
    res.json(orders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
