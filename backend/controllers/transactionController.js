// transactionController.js

import transactionModel from "../models/transactionModel.js";
import nodemailer from "nodemailer";

// Setup Nodemailer Transporter for Brevo
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
});

// Create new transaction
export const createTransaction = async (req, res) => {
  try {
    const newTransaction = new transactionModel(req.body);
    await newTransaction.save();

    res.status(201).json({
      success: true,
      message: "Transaction saved successfully",
      data: newTransaction,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all transactions
export const getTransactions = async (req, res) => {
  try {
    const transactions = await transactionModel.find();
    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a transaction
export const deleteTransaction = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await transactionModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }
    res.status(200).json({ success: true, message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 60 * 1000); // 1 minute valid

    // Always create a NEW transaction (not update)
    const newTransaction = new transactionModel({
      email,
      otp,
      otpExpires,
    });
    await newTransaction.save();

    await transporter.sendMail({
      from: 'thayaparanvithu@gmail.com',
      to: email,
      subject: "Your OTP for Payment Verification",
      html: `<h3>Your OTP is: ${otp}</h3><p>This OTP is valid for 1 minute only.</p>`,
    });

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    // Find the latest transaction for this email
    const transaction = await transactionModel.findOne({ email }).sort({ createdAt: -1 });

    if (!transaction) {
      return res.status(400).json({ success: false, message: "Transaction not found" });
    }

    // Check if expired
    if (transaction.otpExpires < new Date()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    // Check if otp matches
    if (transaction.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    res.status(200).json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// Notify worker after payment
export const notifyWorkerAfterPayment = async (req, res) => {
  const { workerEmail } = req.body;
  try {
    if (!workerEmail) {
      return res.status(400).json({ success: false, message: "Worker email required" });
    }

    await transporter.sendMail({
      from: 'thayaparanvithu@gmail.com',
      to: workerEmail,
      subject: "New Cleaning Order Assigned!",
      html: `<h3>You have a new order assigned.</h3><p>Please check your dashboard for details.</p>`,
    });

    res.status(200).json({ success: true, message: "Worker notified successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update transaction after OTP verified
export const completeTransaction = async (req, res) => {
  const { email, cardHolder, cardNumber, expiryDate, cvv, orderId, workerEmail, paymentAmount } = req.body;
  
  try {
    const transaction = await transactionModel.findOne({ email }).sort({ createdAt: -1 });

    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    transaction.cardHolder = cardHolder;
    transaction.cardNumber = cardNumber;
    transaction.expiryDate = expiryDate;
    transaction.cvv = cvv;
    transaction.orderId = orderId;
    transaction.workerEmail = workerEmail;
    transaction.paymentAmount = paymentAmount;

    await transaction.save();

    res.status(200).json({ success: true, message: "Transaction completed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


























/*
import transactionModel from "../models/transactionModel.js";
import nodemailer from "nodemailer"; // ✅ using Brevo SMTP (example)

// 🛠️ Setup Nodemailer Transporter for Brevo
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.BREVO_USER,
    pass:process.env.BREVO_PASS 
  },
});

// ✅ Create new transaction
export const createTransaction = async (req, res) => {
  try {
    const newTransaction = new transactionModel(req.body);
    await newTransaction.save();

    res.status(201).json({
      success: true,
      message: "Transaction saved successfully",
      data: newTransaction,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get all transactions
export const getTransactions = async (req, res) => {
  try {
    const transactions = await transactionModel.find();
    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete a transaction
export const deleteTransaction = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await transactionModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }
    res.status(200).json({ success: true, message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Send OTP
export const sendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
    const otpExpires = new Date(Date.now() + 60 * 1000); // expires in 1 min

    // Save or Update transaction with OTP
    let transaction = await transactionModel.findOne({ email });
    if (!transaction) {
      transaction = new transactionModel({ email });
    }
    transaction.otp = otp;
    transaction.otpExpires = otpExpires;
    await transaction.save();

    // Send email
    await transporter.sendMail({
      from:'thayaparanvithu@gmail.com',
      to: email,
      subject: "Your OTP for Payment Verification",
      html: `<h3>Your OTP is: ${otp}</h3><p>This OTP is valid for 1 minute only.</p>`,
    });

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//verify otp
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const transaction = await transactionModel.findOne({ email });
    if (!transaction) {
      return res.status(400).json({ success: false, message: "Transaction not found" });
    }

    // 🛑 FIRST check if OTP expired
    if (transaction.otpExpires < new Date()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    // ✅ THEN check if OTP matches
    if (transaction.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    res.status(200).json({ success: true, message: "OTP verified" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ (Optional) Notify worker after payment
export const notifyWorkerAfterPayment = async (req, res) => {
  const { workerEmail } = req.body;
  try {
    if (!workerEmail) {
      return res.status(400).json({ success: false, message: "Worker email required" });
    }

    await transporter.sendMail({
      from: 'thayaparanvithu@gmail.com',
      to: workerEmail,
      subject: "New Cleaning Order Assigned!",
      html: `<h3>You have a new order assigned.</h3><p>Please check your dashboard for details.</p>`,
    });

    res.status(200).json({ success: true, message: "Worker notified successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
*/