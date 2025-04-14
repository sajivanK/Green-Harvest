// packageModel.js
import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'farmer',
        required: true
    },
    packageName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    deliveryFrequency: {
        type: String,
        required: true
    },
    products: [
        {
            productName: { type: String, required: true },
            quantity: { type: Number, required: true }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.models.package || mongoose.model('package', packageSchema);