// models/subscriptionModel.js
import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'farmer',
        required: true,
    },
    packageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'package',
        required: true,
    },
    packageName: {
        type: String,
        required: true,
    },
    packagePrice: {
        type: Number,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    deliveryFrequency: {
        type: String,
        required: true,
    },
    deliveryInfo: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        address: { type: String, required: true },
        phone: { type: String, required: true },
    },
    paymentStatus: {
        type: String,
        enum: ['paid', 'failed'],
        default: 'paid',
    },
    subscriptionStatus: {
        type: String,
        enum: ['active', 'expired'],
        default: 'active',
    },
    subscribedAt: {
        type: Date,
        default: Date.now,
    },
    expiredAt: {
        type: Date, // ✅ Expiration date based on duration
        required: true,
    }
});

export default mongoose.models.subscription || mongoose.model('subscription', subscriptionSchema);
