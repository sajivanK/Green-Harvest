// deleteOldPackages.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import farmerModel from './models/farmerModel.js';
import packageModel from './models/packageModel.js';

dotenv.config();

// Connect to MongoDB
await mongoose.connect(process.env.MONGODB_URI);
console.log('✅ Connected to MongoDB');

// Step 1: Get all valid farmer IDs
const farmers = await farmerModel.find({}, '_id');
const validFarmerIds = farmers.map(farmer => farmer._id.toString());

console.log(`✅ Found ${validFarmerIds.length} valid farmers.`);

// Step 2: Find and delete packages with invalid farmerIds
const result = await packageModel.deleteMany({
  farmerId: { $nin: validFarmerIds }
});

console.log(`🗑️ Deleted ${result.deletedCount} old/broken packages.`);

process.exit(0);
