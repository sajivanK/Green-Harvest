
import orderModel from "../models/orderModel.js";
import subscriptionModel from "../models/subscriptionModel.js";
import productModel from "../models/productModel.js";
import farmerModel from "../models/farmerModel.js";

export const getFarmerOverviewStats = async (req, res) => {
  try {
    const farmer = await farmerModel.findOne({ userId: req.user.id });

    if (!farmer) {
      return res.status(404).json({ success: false, message: "Farmer not found." });
    }

    const totalRevenue = farmer.income;

    const totalProducts = await productModel.countDocuments({ farmerId: farmer._id });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const ordersToday = await orderModel.find({
      farmerId: farmer._id,
      createdAt: { $gte: today }
    });

    const subscriptionsToday = await subscriptionModel.find({
      farmerId: farmer._id,
      subscribedAt: { $gte: today }
    });

    const todayUsersSet = new Set();
    ordersToday.forEach(order => {
      todayUsersSet.add(order.deliveryInfo?.email || order.deliveryInfo?.phone);
    });
    subscriptionsToday.forEach(sub => {
      todayUsersSet.add(sub.deliveryInfo?.email || sub.deliveryInfo?.phone);
    });

    const newUsersToday = todayUsersSet.size;

    res.status(200).json({
      success: true,
      totalRevenue,
      totalProducts,
      newUsersToday
    });
  } catch (error) {
    console.error("Farmer Overview Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
