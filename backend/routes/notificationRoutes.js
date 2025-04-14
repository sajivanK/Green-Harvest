// backend/routes/notificationRoutes.js
import express from "express";
import {
  getNotifications,
  markAllAsRead,
  clearNotifications,
} from "../controllers/notificationController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticate); // Only logged-in farmers

router.get("/get", getNotifications);          // GET /api/notifications
router.patch("/mark-read", markAllAsRead);  // PATCH /api/notifications/mark-read
router.delete("/clear", clearNotifications);// DELETE /api/notifications/clear

export default router;
