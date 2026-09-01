import express from "express";
import {
  createOrder,
  getMyOrders,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  getCancelledOrders,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// (Place these BEFORE /:id to avoid route collisions)
router.route("/admin/orders/cancelled").get(protect, admin, getCancelledOrders);
router.route("/admin/orders").get(protect, admin, getAllOrders);

router.use(protect);

router.route("/").post(createOrder).get(getMyOrders);
router.route("/:id/cancel").put(cancelOrder);
router.route("/:id").put(updateOrderStatus);

export default router;
