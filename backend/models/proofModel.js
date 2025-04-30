import mongoose from "mongoose";

// Defines the proof schema for MongoDB
const proofSchema = new mongoose.Schema({
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'worker',
    required: true
  },
  task: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },

  // ✅ New fields for both images
  beforeImage: {
    type: String,
    required: false // Optional if admin allows single uploads
  },
  afterImage: {
    type: String,
    required: false
  },

  // ✅ Proof status for admin review
  proofStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// ✅ Use existing model if it already exists (prevents recompilation error in dev)
const proofModel = mongoose.models.proof || mongoose.model('proof', proofSchema);

export default proofModel;
