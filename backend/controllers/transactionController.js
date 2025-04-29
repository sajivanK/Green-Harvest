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

//notify worker after payment 
export const notifyWorkerAfterPayment = async (req, res) => {
  const { workerEmail, userEmail, workingDays, workingHours } = req.body;
  try {
    if (!workerEmail) {
      return res.status(400).json({ success: false, message: "Worker email required" });
    }

    await transporter.sendMail({
      from: 'thayaparanvithu@gmail.com',
      to: workerEmail,
      subject: "🎉 New Cleaning Order Assigned - Green Harvest",
      html: `
        <h2 style="color:green;">New Cleaning Order Assigned!</h2>
        <p>Dear Worker,</p>
        <p>You have been assigned a new cleaning task. Here are the details:</p>
        <ul style="font-size:15px;">
          <li><strong>Customer Email:</strong> ${userEmail}</li>
          <li><strong>Working Days:</strong> ${workingDays} Day(s)</li>
          <li><strong>Hours Per Day:</strong> ${workingHours} Hour(s)</li>
        </ul>
        <p>Please check your dashboard for more details.</p>
        <p>Thank you!<br/><strong>Green Harvest Team</strong></p>
      `,
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






















