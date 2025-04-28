// backend/models/orderModel.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "farmer",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  deliveryInfo: {
    firstName: String,
    lastName: String,
    email: String,
    address: String,
    phone: String,
  },
  status: {
    type: String,
    enum: ["Paid", "Pending", "Shipped", "Deliverd"],
    default: "Paid",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.order || mongoose.model("order", orderSchema);
