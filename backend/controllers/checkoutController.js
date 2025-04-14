
// IMPORTS
import cartModel from "../models/cartModel.js";
import productModel from "../models/productModel.js";
import farmerModel from "../models/farmerModel.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import notificationModel from "../models/notificationModel.js";
import nodemailer from 'nodemailer'; // for sending emails

// SMTP Transporter Setup - Brevo
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: '8715a1001@smtp-brevo.com',  // your Brevo Email
    pass: 'h1rQfWmH3naTk8wx'          // your Brevo SMTP Password
  }
});

// FARMER Email Template
const generateFarmerEmail = (farmerName, productName, quantity, total, deliveryInfo) => `
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; }
    .container { background: #fff; padding: 20px; border-radius: 10px; max-width: 600px; margin: auto; }
    .header { background: #4CAF50; padding: 15px; color: #fff; border-radius: 10px 10px 0 0; text-align: center; }
    ul { list-style: none; padding: 0; }
    li { padding: 5px 0; }
    .footer { text-align: center; font-size: 12px; color: #aaa; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h2>New Order Received - GreenHarvest</h2></div>
    <p>Hi ${farmerName},</p>
    <p>You have a new order for <b>${productName}</b>.</p>
    <ul>
      <li><b>Quantity:</b> ${quantity}</li>
      <li><b>Total:</b> Rs.${total}</li>
      <li><b>Customer:</b> ${deliveryInfo.firstName} ${deliveryInfo.lastName}</li>
      <li><b>Address:</b> ${deliveryInfo.address}</li>
      <li><b>Phone:</b> ${deliveryInfo.phone}</li>
    </ul>
    <p>Check your GreenHarvest Dashboard for details.</p>
    <div class="footer">&copy; 2025 GreenHarvest</div>
  </div>
</body>
</html>
`;

// CUSTOMER Email Template
const generateCustomerEmail = (customerName, items, totalAmount, deliveryInfo) => `
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; }
    .container { background: #fff; padding: 20px; border-radius: 10px; max-width: 600px; margin: auto; }
    .header { background: #4CAF50; padding: 15px; color: #fff; border-radius: 10px 10px 0 0; text-align: center; }
    ul { list-style: none; padding: 0; }
    li { padding: 5px 0; }
    .footer { text-align: center; font-size: 12px; color: #aaa; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h2>Order Confirmation - GreenHarvest</h2></div>
    <p>Hi ${customerName},</p>
    <p>Your order has been placed successfully!</p>
    <ul>
      ${items.map(item => `<li>${item.productName} - Qty: ${item.quantity} - Rs.${item.total}</li>`).join('')}
    </ul>
    <p><b>Total Paid:</b> Rs.${totalAmount}</p>
    <p>Delivery To: ${deliveryInfo.firstName} ${deliveryInfo.lastName}, ${deliveryInfo.address}, ${deliveryInfo.phone}</p>
    <p>Thank you for shopping with GreenHarvest!</p>
    <div class="footer">&copy; 2025 GreenHarvest</div>
  </div>
</body>
</html>
`;

// EXPORT CONTROLLER FUNCTION
export const checkoutCart = async (req, res) => {
  const userId = req.user._id;
  const { items, deliveryInfo } = req.body;
  const deliveryFee = 100;

  if (!Array.isArray(items)) {
    items = [items];
  }

  // Validation
  if (!Array.isArray(items) || items.length === 0)
    return res.status(400).json({ success: false, message: "No items provided" });

  if (!deliveryInfo || !deliveryInfo.firstName || !deliveryInfo.lastName || !deliveryInfo.email || !deliveryInfo.address || !deliveryInfo.phone)
    return res.status(400).json({ success: false, message: "Missing delivery info" });

  try {
    let orders = [];
    let customerOrderSummary = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await productModel.findById(item.productId);
      if (!product)
        return res.status(400).json({ success: false, message: "Product not found" });

      if (product.stock < item.quantity)
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });

      const total = item.quantity * product.price;
      totalAmount += total;

      const order = await orderModel.create({
        userId,
        farmerId: product.farmerId,
        productId: product._id,
        quantity: item.quantity,
        totalAmount: total,
        deliveryInfo
      });

      product.stock -= item.quantity;
      await product.save();

      const farmer = await farmerModel.findById(product.farmerId);
      farmer.income += total;
      await farmer.save();

      const farmerUser = await userModel.findById(farmer.userId);
      if (farmerUser?.email) {
        await transporter.sendMail({
          from: 'jansteinsaji16@gmail.com',
          to: farmerUser.email,
          subject: '📦 New Order Received - GreenHarvest',
          html: generateFarmerEmail(farmerUser.name, product.name, item.quantity, total, deliveryInfo)
        });
      }

      customerOrderSummary.push({
        productName: product.name,
        quantity: item.quantity,
        total
      });

      orders.push(order);
    }

    // Add Delivery Fee to totalAmount
    totalAmount += deliveryFee;

    const user = await userModel.findById(userId);
    if (user?.email) {
      await transporter.sendMail({
        from: 'jansteinsaji16@gmail.com',
        to: deliveryInfo.email,
        subject: '🛒 Order Confirmation - GreenHarvest',
        html: generateCustomerEmail(`${deliveryInfo.firstName} ${deliveryInfo.lastName}`, customerOrderSummary, totalAmount, deliveryInfo)
      });
    }

    await cartModel.findOneAndUpdate({ userId }, { items: [] });

    res.status(200).json({
      success: true,
      message: "Payment successful! Emails sent to farmer & customer.",
      orders
    });

  } catch (error) {
    console.error("Checkout Error:", error);
    res.status(500).json({ success: false, message: "Server Error. Please try again later." });
  }
};
