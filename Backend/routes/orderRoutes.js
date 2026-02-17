import express from "express";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

// ============================================
// POST /api/orders
// Create new order
// ============================================
router.post("/", protect, async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    const cart = await Cart.findOne({ userId: req.user._id }).populate(
      "products.productId",
    );

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // Prepare order products
    const orderProducts = cart.products.map((item) => ({
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      quantity: item.quantity,
    }));

    // Calculate total price
    const totalPrice = orderProducts.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    const order = await Order.create({
      userId: req.user._id,
      products: orderProducts,
      totalPrice,
      shippingAddress,
    });

    // Clear cart after order
    await Cart.findOneAndDelete({ userId: req.user._id });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating order",
    });
  }
});

// ============================================
// GET /api/orders
// Get logged in user's orders
// ============================================
router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
    });
  }
});

router.put("/:id/cancel", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Make sure user owns the order
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized"
      });
    }

    // Only allow cancel if not shipped or delivered
    if (order.orderStatus === "Shipped" || order.orderStatus === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled"
      });
    }

    order.orderStatus = "Cancelled";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error cancelling order"
    });
  }
});


// ============================================
// GET /api/admin/orders
// Admin view all orders
// ============================================
router.get("/admin/orders", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching all orders",
    });
  }
});

// ============================================
// PUT /api/orders/:id
// Update order status (Admin only)
// ============================================
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating order",
    });
  }
});

// GET /api/admin/orders/cancelled
// Admin view all cancelled orders
router.get("/admin/orders/cancelled", protect, adminOnly, async (req, res) => {
  try {
    const cancelledOrders = await Order.find({ orderStatus: "Cancelled" })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: cancelledOrders.length,
      orders: cancelledOrders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching cancelled orders"
    });
  }
});


export default router;
