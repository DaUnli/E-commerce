import User from "../models/User.js";
import Order from "../models/Order.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });

    const orders = await Order.find({});
    const stats = users.map((u) => {
      const userOrders = orders.filter((o) => o.user?.toString() === u._id.toString());
      const totalSpent = userOrders.reduce((s, o) => s + (o.total || 0), 0);
      const lastOrder = userOrders.length
        ? new Date(Math.max(...userOrders.map((o) => new Date(o.createdAt)))).toISOString()
        : null;
      return {
        _id: u._id,
        name: u.name,
        email: u.email,
        address: u.address,
        role: u.role,
        createdAt: u.createdAt,
        totalOrders: userOrders.length,
        totalSpent,
        lastOrder,
      };
    });

    res.json(stats);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
