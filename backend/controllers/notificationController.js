// backend/controllers/notificationController.js
import notificationModel from "../models/notificationModel.js";

// ✅ Get all notifications for the logged-in farmer
export const getNotifications = async (req, res) => {
  try {
    const farmerId = req.user._id; // from authMiddleware
    const notifications = await notificationModel
      .find({ farmerId })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Mark all as read
export const markAllAsRead = async (req, res) => {
  try {
    const farmerId = req.user._id;
    await notificationModel.updateMany({ farmerId }, { isRead: true });

    res.json({ success: true, message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Delete all notifications
export const clearNotifications = async (req, res) => {
  try {
    const farmerId = req.user._id;
    await notificationModel.deleteMany({ farmerId });

    res.json({ success: true, message: "All notifications cleared" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
