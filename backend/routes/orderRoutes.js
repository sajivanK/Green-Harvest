
import express from "express";
import {
  getOrdersByFarmer,
  updateOrderStatus,
  getMyOrders,
  getOrderStatusDistribution, // ✅ import new controller
  getDailyOrders,
  getMonthlySales,
  getOrderStats,
  getFarmerReport,
  getMonthlySalesOverview,
} from "../controllers/orderController.js";

import { authenticate } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

// ✅ Fetch all orders for logged-in farmer
router.get("/my-orders", authenticate, upload.single('image'), getMyOrders);

// ✅ Fetch orders by specific farmer ID (if needed separately)
router.get("/farmer/:farmerId", authenticate, getOrdersByFarmer);

// ✅ Update status of a specific order
router.patch("/:orderId/status", authenticate, updateOrderStatus);

// ✅ Fetch order status distribution for PieChart
router.get("/status-distribution", authenticate, getOrderStatusDistribution);

router.get("/daily-orders", authenticate, getDailyOrders);

router.get("/monthly-sales", authenticate, getMonthlySales);

router.get("/stats", authenticate, getOrderStats);

router.get("/report", authenticate, getFarmerReport);

router.get("/sales-overview", authenticate, getMonthlySalesOverview);
export default router;
