import express from "express";
import { getStats, getRecentOrders } from "../controllers/adminController.js";
import { getUsers } from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/admin/stats", protect, admin, getStats);
router.get("/admin/recent-orders", protect, admin, getRecentOrders);

// Users list (customers) — admin
router.get("/users", protect, admin, getUsers);

export default router;
