import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    email: { type: String, required: true }, // user's email for OTP
    cardHolder: { type: String }, // ⬅️ remove 'required: true'
    cardNumber: { type: String }, // ⬅️ remove 'required: true'
    expiryDate: { type: String }, // ⬅️ remove 'required: true'
    cvv: { type: String },        // ⬅️ remove 'required: true'
    otp: { type: String }, 
    otpExpires: { type: Date },
    orderId: { type: String },
    workerEmail: { type: String },
    paymentAmount: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.models.transaction || mongoose.model("transaction", transactionSchema);
