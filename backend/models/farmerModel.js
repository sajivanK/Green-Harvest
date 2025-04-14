import mongoose from "mongoose";

const farmerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        unique: true
    },
    farmName: {
        type: String,
        required: true
    },
    farmLocation: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    nicNumber: {
        type: String,
        required: true,
        unique: true
    },
    income: {
        type: Number,
        default: 0 // Track total earnings of the farmer
    },
    farmVerificationStatus: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    profileImage: {
        type: String,
        default: ''
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

const farmerModel = mongoose.models.farmer || mongoose.model('farmer', farmerSchema);

export default farmerModel;
