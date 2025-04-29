

import Order from "../models/orderModel.js";
import Farmer from "../models/farmerModel.js";

// ✅ Get Orders for the logged-in Farmer
export const getMyOrders = async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ userId: req.user.id });

    if (!farmer) {
      return res.status(400).json({ success: false, message: "Farmer not found for the logged-in user." });
    }

    const orders = await Order.find({ farmerId: farmer._id })
      .populate("productId")   // ✅ Populate product details
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Fetch My Orders Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// (Optional old functions)
export const getOrdersByFarmer = async (req, res) => {
  try {
    const farmerId = req.params.farmerId;
    const orders = await Order.find({ farmerId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ success: true, message: "Order status updated successfully" });
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// backend/controllers/orderController.js
export const getOrderStatusDistribution = async (req, res) => {
    try {
      const farmer = await Farmer.findOne({ userId: req.user.id });
  
      if (!farmer) {
        return res.status(404).json({ success: false, message: "Farmer not found." });
      }
  
      const orders = await Order.find({ farmerId: farmer._id });
  
      const statusCounts = {
        Paid: 0,
        Pending: 0,
        Shipped: 0,
        Deliverd: 0,
      };
  
      orders.forEach(order => {
        if (statusCounts[order.status] !== undefined) {
          statusCounts[order.status]++;
        }
      });
  
      res.status(200).json({ success: true, statusCounts });
    } catch (error) {
      console.error("Fetch Order Status Error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };

  import mongoose from "mongoose"; // Make sure mongoose is imported if not already

export const getDailyOrders = async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ userId: req.user.id });

    if (!farmer) {
      return res.status(404).json({ success: false, message: "Farmer not found." });
    }

    const dailyOrders = await Order.aggregate([
      { $match: { farmerId: new mongoose.Types.ObjectId(farmer._id) } },
      {
        $group: {
          _id: { $dateToString: { format: "%m/%d", date: "$createdAt" } },
          orders: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.status(200).json({ success: true, dailyOrders });
  } catch (error) {
    console.error("Fetch Daily Orders Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMonthlySales = async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ userId: req.user.id });

    if (!farmer) {
      return res.status(404).json({ success: false, message: "Farmer not found." });
    }

    const monthlySales = await Order.aggregate([
      { $match: { farmerId: new mongoose.Types.ObjectId(farmer._id) } },
      {
        $group: {
          _id: { $dateToString: { format: "%b", date: "$createdAt" } }, // Group by month name (Jan, Feb, etc.)
          totalSales: { $sum: "$totalAmount" } // Sum total sales amount
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.status(200).json({ success: true, monthlySales });
  } catch (error) {
    console.error("Fetch Monthly Sales Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getOrderStats = async (req, res) => {
    try {
      const farmer = await Farmer.findOne({ userId: req.user.id });
  
      if (!farmer) {
        return res.status(404).json({ success: false, message: "Farmer not found." });
      }
  
      const orders = await Order.find({ farmerId: farmer._id });
  
      const totalOrders = orders.length;
      const paidOrders = orders.filter(order => order.status === "Paid").length;
      const pendingOrders = orders.filter(order => order.status === "Pending").length;
      const shippedOrders = orders.filter(order => order.status === "Shipped").length;
      const completedOrders = orders.filter(order => order.status === "Deliverd").length;
      const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  
      res.status(200).json({
        success: true,
        stats: {
          totalOrders,
          paidOrders,
          pendingOrders,
          shippedOrders,
          completedOrders,
          totalRevenue,
        }
      });
    } catch (error) {
      console.error("Fetch Order Stats Error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };


export const getFarmerReport = async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ userId: req.user.id });

    if (!farmer) {
      return res.status(404).json({ success: false, message: "Farmer not found." });
    }

    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, message: "Start and end dates are required" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Include full day

    // Fetch orders in date range
    const orders = await Order.find({
      farmerId: farmer._id,
      createdAt: { $gte: start, $lte: end },
    }).populate('productId');

    // Product-wise sales breakdown
    const productSales = {};

    orders.forEach(order => {
      const productId = order.productId._id.toString();
      if (!productSales[productId]) {
        productSales[productId] = {
          name: order.productId.name,
          quantity: 0,
          revenue: 0,
        };
      }
      productSales[productId].quantity += order.quantity;
      productSales[productId].revenue += order.totalAmount;
    });

    // Daily Sales Trend
    const dailySales = {};

    orders.forEach(order => {
      const dateKey = order.createdAt.toISOString().slice(0, 10); // "YYYY-MM-DD"
      if (!dailySales[dateKey]) {
        dailySales[dateKey] = 0;
      }
      dailySales[dateKey] += order.totalAmount;
    });

    const dailySalesArray = Object.entries(dailySales).map(([date, total]) => ({
      date,
      total,
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Top-selling products
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 3);

    // Customer Summary
    const customers = new Set();
    orders.forEach(order => {
      customers.add(order.deliveryInfo?.email || order.deliveryInfo?.phone);
    });

    res.status(200).json({
      success: true,
      productSales: Object.values(productSales),
      dailySales: dailySalesArray,
      topProducts,
      totalCustomers: customers.size,
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
    });
  } catch (error) {
    console.error("Farmer Report Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMonthlySalesOverview = async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ userId: req.user.id });
    if (!farmer) {
      return res.status(404).json({ success: false, message: "Farmer not found." });
    }

    const sales = await Order.aggregate([
      { $match: { farmerId: farmer._id } }, // 👈 Get only this farmer's orders
      {
        $group: {
          _id: { $month: "$createdAt" }, // 👈 Group by month
          totalSales: { $sum: "$totalAmount" }
        }
      },
      { $sort: { "_id": 1 } } // 👈 Sort by month ascending (Jan -> Dec)
    ]);

    // Map numeric month to short month name
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlySales = sales.map((item) => ({
      name: monthNames[item._id - 1],
      sales: item.totalSales
    }));

    res.status(200).json({ success: true, monthlySales });

  } catch (error) {
    console.error("❌ Monthly sales fetch error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch monthly sales" });
  }
};
