import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, deliveryFee = 35 } =
      req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const subtotal = items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );
    const total = subtotal + Number(deliveryFee);

    const order = await Order.create({
      user: req.user._id,
      items: items.map((i) => ({
        product: i.id,
        name: i.name,
        image: i.image,
        price: i.price,
        quantity: i.quantity,
      })),
      shippingAddress,
      paymentMethod: paymentMethod || "credit-card",
      subtotal,
      deliveryFee: Number(deliveryFee),
      total,
      status: "Pending",
    });

    const productIds = items.map((i) => i.id);
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = cart.items.filter(
        (i) => !productIds.includes(i.product.toString())
      );
      await cart.save();
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order || order.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status === "Delivered") {
      return res
        .status(400)
        .json({ message: "Delivered orders cannot be cancelled" });
    }

    order.status = "Cancelled";
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "name email").sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = orderStatus;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getCancelledOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: "Cancelled" })
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
