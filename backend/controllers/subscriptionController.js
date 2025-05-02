
import subscriptionModel from '../models/subscriptionModel.js';
import packageModel from '../models/packageModel.js';
import farmerModel from '../models/farmerModel.js';
import userModel from '../models/userModel.js';
import nodemailer from 'nodemailer';

//  Setup Brevo Email Transporter
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: '8715a1001@smtp-brevo.com',
    pass: 'h1rQfWmH3naTk8wx'
  }
});

//  Utility to calculate expiry date
const getExpiryDate = (duration) => {
  const now = new Date();
  if (duration === 'Weekly') now.setDate(now.getDate() + 7);
  else if (duration === 'Monthly') now.setMonth(now.getMonth() + 1);
  else if (duration === 'Quarterly') now.setMonth(now.getMonth() + 3);
  return now;
};

//  Styled Email Templates
const generateCustomerEmail = (customerName, pkg, deliveryInfo, deliveryFee) => `
<html>
<head>
  <style>
    body { font-family: Arial; background: #f9f9f9; padding: 20px; }
    .container { background: #fff; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto; box-shadow: 0 0 8px rgba(0,0,0,0.1); }
    h2 { color: #4CAF50; }
    ul { padding-left: 20px; }
    .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #888; }
  </style>
</head>
<body>
  <div class="container">
    <h2>✅ Subscription Confirmed</h2>
    <p>Hi ${customerName},</p>
    <p>Thank you for subscribing to <strong>${pkg.packageName}</strong>.</p>

    <h3>📦 Package Summary:</h3>
    <ul>
      <li><b>Price:</b> Rs.${pkg.packagePrice.toFixed(2)}</li>
      <li><b>Duration:</b> ${pkg.duration}</li>
      <li><b>Delivery Frequency:</b> ${pkg.deliveryFrequency}</li>
    </ul>

    <h3>🚚 Delivery Info:</h3>
    <ul>
      <li><b>Address:</b> ${deliveryInfo.address}</li>
      <li><b>Phone:</b> ${deliveryInfo.phone}</li>
    </ul>

    <h3>💰 Payment Summary:</h3>
    <ul>
      <li>Package: Rs.${pkg.packagePrice.toFixed(2)}</li>
      <li>Delivery Fee: Rs.${deliveryFee.toFixed(2)}</li>
      <li><b>Total Paid:</b> Rs.${(pkg.packagePrice + deliveryFee).toFixed(2)}</li>
    </ul>

    <p>Your subscription will remain active until <strong>${getExpiryDate(pkg.duration).toDateString()}</strong>.</p>

    <div class="footer">&copy; 2025 GreenHarvest. All rights reserved.</div>
  </div>
</body>
</html>
`;

const generateFarmerEmail = (farmerName, pkg, deliveryInfo) => `
<html>
<head>
  <style>
    body { font-family: Arial; background: #f9f9f9; padding: 20px; }
    .container { background: #fff; padding: 20px; border-radius: 8px; max-width: 600px; margin: auto; box-shadow: 0 0 8px rgba(0,0,0,0.1); }
    h2 { color: #22c55e; }
    ul { padding-left: 20px; }
    .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #888; }
  </style>
</head>
<body>
  <div class="container">
    <h2>🌱 New Subscription Alert</h2>
    <p>Hi ${farmerName},</p>
    <p>A customer has subscribed to your <strong>${pkg.packageName}</strong> package.</p>

    <h3>📦 Package Info:</h3>
    <ul>
      <li>Price: Rs.${pkg.packagePrice.toFixed(2)}</li>
      <li>Duration: ${pkg.duration}</li>
      <li>Frequency: ${pkg.deliveryFrequency}</li>
    </ul>

    <h3>🚚 Delivery Info:</h3>
    <ul>
      <li>Customer: ${deliveryInfo.firstName} ${deliveryInfo.lastName}</li>
      <li>Address: ${deliveryInfo.address}</li>
      <li>Phone: ${deliveryInfo.phone}</li>
    </ul>

    <p>Please proceed with delivery as scheduled.</p>

    <div class="footer">&copy; 2025 GreenHarvest. All rights reserved.</div>
  </div>
</body>
</html>
`;

//  Create a new subscription
export const createSubscription = async (req, res) => {
  const { packageId, deliveryInfo } = req.body;
  const userId = req.user._id;
  const deliveryFee = 100;

  try {
    const pkg = await packageModel.findById(packageId);
    if (!pkg) return res.status(404).json({ success: false, message: "Package not found" });

    const farmerId = pkg.farmerId;
    const expiredAt = getExpiryDate(pkg.duration);

    const newSubscription = await subscriptionModel.create({
      userId,
      farmerId,
      packageId,
      packageName: pkg.packageName,
      packagePrice: pkg.price,
      duration: pkg.duration,
      deliveryFrequency: pkg.deliveryFrequency,
      deliveryInfo,
      expiredAt
    });

    await farmerModel.findByIdAndUpdate(farmerId, {
        $inc: { income: pkg.price }
      });

    const user = await userModel.findById(userId);
    const farmer = await farmerModel.findById(farmerId).populate('userId');

    //  Customer Email
    if (user?.email) {
      await transporter.sendMail({
        from: 'jansteinsaji16@gmail.com',
        to: deliveryInfo.email,
        subject: '✅ Subscription Confirmed - GreenHarvest',
        html: generateCustomerEmail(
          `${deliveryInfo.firstName} ${deliveryInfo.lastName}`,
          {
            packageName: pkg.packageName,
            packagePrice: pkg.price,
            duration: pkg.duration,
            deliveryFrequency: pkg.deliveryFrequency,
          },
          deliveryInfo,
          deliveryFee
        )
      });
    }

    //  Farmer Email
    if (farmer?.userId?.email) {
      await transporter.sendMail({
        from: 'jansteinsaji16@gmail.com',
        to: farmer.userId.email,
        subject: '🌱 New Subscription - GreenHarvest',
        html: generateFarmerEmail(
          farmer.userId.name,
          {
            packageName: pkg.packageName,
            packagePrice: pkg.price,
            duration: pkg.duration,
            deliveryFrequency: pkg.deliveryFrequency,
          },
          deliveryInfo
        )
      });
    }

    res.status(201).json({ success: true, message: "Subscription created", subscription: newSubscription });

  } catch (error) {
    console.error(" Subscription error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//  Get customer subscriptions
export const getMySubscriptions = async (req, res) => {
  try {
    const subscriptions = await subscriptionModel.find({ userId: req.user._id });
    res.status(200).json({ success: true, subscriptions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  Auto-expire subscriptions
export const checkAndExpireSubscriptions = async (req, res) => {
  try {
    const now = new Date();
    const expired = await subscriptionModel.updateMany(
      { expiredAt: { $lte: now }, subscriptionStatus: 'active' },
      { subscriptionStatus: 'expired' }
    );
    res.status(200).json({ success: true, message: `${expired.modifiedCount} subscriptions expired.` });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to check expiration" });
  }
};


//  Get all subscriptions for the logged-in farmer
export const getFarmerSubscriptions = async (req, res) => {
    try {
      const farmer = await farmerModel.findOne({ userId: req.user.id });
      if (!farmer) {
        return res.status(404).json({ success: false, message: "Farmer not found." });
      }
  
      const subscriptions = await subscriptionModel.find({ farmerId: farmer._id });
      res.status(200).json({ success: true, subscriptions });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

  export const getSubscriptionStats = async (req, res) => {
    try {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
  
      const totalUsers = await subscriptionModel.countDocuments();
      const newUsersToday = await subscriptionModel.countDocuments({
        subscribedAt: { $gte: todayStart, $lte: todayEnd },
      });
      const activeUsers = await subscriptionModel.countDocuments({
        subscriptionStatus: 'active',
      });
      const expiredUsers = await subscriptionModel.countDocuments({
        subscriptionStatus: 'expired',
      });
  
      const churnRate = totalUsers === 0 ? 0 : ((expiredUsers / totalUsers) * 100).toFixed(2);
  
      res.status(200).json({
        success: true,
        stats: {
          totalUsers,
          newUsersToday,
          activeUsers,
          churnRate: `${churnRate}%`,
        },
      });
    } catch (error) {
      console.error(" Failed to fetch subscription stats:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  