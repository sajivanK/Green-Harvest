import mongoose from "mongoose";

//defines the worker schema for MongoDB
const workerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    bankName: {
        type: String,
        default: ""
    },
    accountNumber: {
        type: String,
        default: ""
    },
    nicNumber: {
        type: String,
        required: true,
        unique: true 
    },
    income: {
        type: Number,
        default: 0
    },
    workerVerificationStatus: {
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

const workerModel = mongoose.models.worker || mongoose.model('worker', workerSchema);

export default workerModel;