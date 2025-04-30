// TEMPORARY ORDER CONTROLLER
import productModel from "../models/productModel.js";
import farmerModel from "../models/farmerModel.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import nodemailer from 'nodemailer';

// SMTP setup
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: '8715a1001@smtp-brevo.com',
    pass: 'h1rQfWmH3naTk8wx'
  }
});

// Email Templates
const generateFarmerEmail = (farmerName, productName, quantity, total, deliveryInfo) => `...`;
const generateCustomerEmail = (customerName, items, totalAmount, deliveryInfo) => `...`;

// 1. Create Temporary Orders (No stock update or email)
export const createTemporaryOrder = async (req, res) => {
  const userId = req.user._id;
  let { items, deliveryInfo } = req.body;
  const deliveryFee = 100;

  if (!Array.isArray(items)) items = [items];

  if (!items.length || !deliveryInfo?.firstName || !deliveryInfo?.email || !deliveryInfo?.address || !deliveryInfo?.phone)
    return res.status(400).json({ success: false, message: "Missing required fields" });

  try {
    let orders = [];

    for (const item of items) {
      const product = await productModel.findById(item.productId);
      if (!product)
        return res.status(400).json({ success: false, message: "Product not found" });

      if (product.stock < item.quantity)
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });

      const total = item.quantity * product.price;

      const order = await orderModel.create({
        userId,
        farmerId: product.farmerId,
        productId: product._id,
        quantity: item.quantity,
        totalAmount: total,
        deliveryInfo,
        isConfirmed: false
      });

      orders.push(order);
    }

    return res.status(200).json({ success: true, message: "Temporary order created", orders });
  } catch (error) {
    console.error("Temporary Order Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 2. Confirm Order (Finalize - email, stock, income)
export const confirmTemporaryOrder = async (req, res) => {
  const { orderIds } = req.body;
  const deliveryFee = 100;

  try {
    let customerOrderSummary = [];
    let totalAmount = 0;

    for (const id of orderIds) {
      const order = await orderModel.findById(id);
      if (!order || order.isConfirmed)
        continue;

      const product = await productModel.findById(order.productId);
      const farmer = await farmerModel.findById(order.farmerId);
      const user = await userModel.findById(order.userId);

      // Update stock & income
      product.stock -= order.quantity;
      await product.save();

      farmer.income += order.totalAmount;
      await farmer.save();

      // Email to farmer
      const farmerUser = await userModel.findById(farmer.userId);
      if (farmerUser?.email) {
        await transporter.sendMail({
          from: 'jansteinsaji16@gmail.com',
          to: farmerUser.email,
          subject: '📦 New Order Received - GreenHarvest',
          html: generateFarmerEmail(farmerUser.name, product.name, order.quantity, order.totalAmount, order.deliveryInfo)
        });
      }

      // Collect summary
      customerOrderSummary.push({
        productName: product.name,
        quantity: order.quantity,
        total: order.totalAmount
      });

      totalAmount += order.totalAmount;

      order.isConfirmed = true;
      await order.save();
    }

    totalAmount += deliveryFee;

    // Email to customer
    const customerEmail = orderIds.length ? (await orderModel.findById(orderIds[0])).deliveryInfo.email : null;
    const deliveryInfo = orderIds.length ? (await orderModel.findById(orderIds[0])).deliveryInfo : null;

    if (customerEmail) {
      await transporter.sendMail({
        from: 'jansteinsaji16@gmail.com',
        to: customerEmail,
        subject: '🛒 Order Confirmation - GreenHarvest',
        html: generateCustomerEmail(`${deliveryInfo.firstName} ${deliveryInfo.lastName}`, customerOrderSummary, totalAmount, deliveryInfo)
      });
    }

    res.status(200).json({ success: true, message: "Order confirmed and emails sent" });
  } catch (error) {
    console.error("Confirm Order Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// 3. Delete Temporary Order
export const deleteTemporaryOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await orderModel.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (order.isConfirmed)
      return res.status(400).json({ success: false, message: "Cannot delete a confirmed order" });

    await orderModel.findByIdAndDelete(orderId);
    res.status(200).json({ success: true, message: "Order deleted" });
  } catch (error) {
    console.error("Delete Order Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
//edit order
export const editTemporaryOrder = async (req, res) => {
  const userId = req.user._id;
  const { item, deliveryInfo } = req.body;

  if (!item || !item.orderId) {
    return res.status(400).json({ success: false, message: "Missing item or orderId" });
  }

  try {
    const order = await orderModel.findById(item.orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    if (order.isConfirmed) {
      return res.status(400).json({ success: false, message: "Cannot edit a confirmed order" });
    }

    // ✅ Update fields
    order.quantity = item.quantity;
    order.totalAmount = item.quantity * item.price;
    order.deliveryInfo = deliveryInfo;

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      orders: [order]
    });
  } catch (error) {
    console.error("Edit Order Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
