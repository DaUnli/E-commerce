import express from "express";
import Order from "../models/Order.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ========================================
// PUT /api/payments/:orderId
// Simulate Payment
// ========================================
router.put("/:orderId", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Make sure user owns this order
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    order.paymentStatus = "Paid";
    order.orderStatus = "Processing";

    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment successful (Simulated)",
      order,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Payment failed",
    });
  }
});

export default router;
