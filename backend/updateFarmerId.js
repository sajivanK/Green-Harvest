import mongoose from 'mongoose';
import productModel from './models/productModel.js';
import farmerModel from './models/farmerModel.js';

// Connect to MongoDB
mongoose.connect('mongodb+srv://jansteinsaji16:e92tl44qdL8cgZES@cluster0.diefta4.mongodb.net/greenH', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to the database"))
.catch((error) => console.log("Database connection failed", error));

async function updateFarmerIds() {
  try {
    // Get all the products with the incorrect farmerId (i.e., userId is assigned as farmerId)
    const products = await productModel.find({ farmerId: { $exists: true } });

    // Loop through each product to update the farmerId
    for (const product of products) {
      // Find the correct farmer by matching the userId in the farmer model
      const farmer = await farmerModel.findOne({ userId: product.farmerId });

      if (farmer) {
        // Update the farmerId in the product
        product.farmerId = farmer._id;
        await product.save(); // Save the updated product
        console.log(`Updated product ${product._id} with correct farmerId ${farmer._id}`);
      } else {
        console.log(`No farmer found for product ${product._id}`);
      }
    }

    console.log('Farmer IDs have been updated for all products.');
  } catch (error) {
    console.error('Error updating farmerIds:', error);
  }
}

// Run the update script
updateFarmerIds().then(() => {
  mongoose.connection.close();
});
