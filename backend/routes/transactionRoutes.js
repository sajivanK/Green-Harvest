import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js"; 
import {
  createTransaction,
  getTransactions,
  deleteTransaction,
  sendOtp,
  verifyOtp,
  notifyWorkerAfterPayment,
  completeTransaction
} from "../controllers/transactionController.js";

const router = express.Router();

// ✅ Old CRUD
router.post("/create", authenticate, createTransaction);
router.get("/all", authenticate, getTransactions);
router.delete("/delete/:id", authenticate, deleteTransaction);
router.post("/complete", authenticate, completeTransaction);


// ✅ New OTP APIs
router.post("/send-otp", sendOtp);  // no auth needed
router.post("/verify-otp", verifyOtp);  // no auth needed

// ✅ Optional Worker Notification API
router.post("/notify-worker", notifyWorkerAfterPayment); // can be without auth

export default router;

































/*

import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js"; 
import {
  createTransaction,
  getTransactions,
  deleteTransaction,
  sendOtp,
  verifyOtp,
  notifyWorkerAfterPayment,
} from "../controllers/transactionController.js";

const router = express.Router();

// Old CRUD
router.post("/create", createTransaction);
router.get("/all", getTransactions);
router.delete("/delete/:id", deleteTransaction);

// New OTP APIs
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

// Optional Worker Notification API
router.post("/notify-worker", notifyWorkerAfterPayment);


router.post("/transaction/send-otp", authenticate,createTransaction );
router.post("/transaction/verify-otp", authenticate,createTransaction );
router.post("/transaction/notify-otp", authenticate,createTransaction );


export default router;*/
