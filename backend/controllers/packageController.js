
// packageController.js
import packageModel from '../models/packageModel.js';
import farmerModel from '../models/farmerModel.js';
import fs from 'fs';

// ✅ Create a new package
export const createPackage = async (req, res) => {
    try {
        const { packageName, description, price, duration, deliveryFrequency, products } = req.body;
        const imagePath = req.file ? req.file.filename : '';

        // ✅ Fetch the farmer linked to the logged-in user
        const farmer = await farmerModel.findOne({ userId: req.user.id });
        if (!farmer) {
            return res.status(400).json({ success: false, message: 'Farmer not found for the logged-in user.' });
        }

        const newPackage = new packageModel({
            farmerId: farmer._id, // ✅ Correct farmer._id
            packageName,
            description,
            image: imagePath,
            price,
            duration,
            deliveryFrequency,
            products: JSON.parse(products)
        });

        await newPackage.save();
        res.status(201).json({ success: true, message: 'Package created successfully', package: newPackage });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Get all packages belonging to the logged-in farmer
export const getPackages = async (req, res) => {
    try {
        const farmer = await farmerModel.findOne({ userId: req.user.id });
        if (!farmer) {
            return res.status(400).json({ success: false, message: 'Farmer not found for the logged-in user.' });
        }

        const packages = await packageModel.find({ farmerId: farmer._id });
        res.status(200).json({ success: true, packages });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Get all packages in the database (for public viewing)
export const getAllPackages = async (req, res) => {
    try {
        const packages = await packageModel.find();
        res.status(200).json({ success: true, packages });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Update a package
export const updatePackage = async (req, res) => {
    try {
        const { id } = req.params;
        let updateData = req.body;

        // ✅ Parse products if coming as string
        if (typeof updateData.products === "string") {
            updateData.products = JSON.parse(updateData.products);
        }

        // ✅ Only update image if new one uploaded
        if (req.file) {
            updateData.image = req.file.filename;
        } else {
            delete updateData.image;
        }

        // ✅ Find farmer from logged-in user
        const farmer = await farmerModel.findOne({ userId: req.user.id });
        if (!farmer) {
            return res.status(400).json({ success: false, message: 'Farmer not found for the logged-in user.' });
        }

        const updatedPackage = await packageModel.findOneAndUpdate(
            { _id: id, farmerId: farmer._id },
            updateData,
            { new: true }
        );

        if (!updatedPackage) {
            return res.status(404).json({ success: false, message: "Package not found or unauthorized" });
        }

        res.status(200).json({ success: true, message: "Package updated successfully", package: updatedPackage });
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Delete a package
export const deletePackage = async (req, res) => {
    try {
        const { id } = req.params;

        // ✅ Find farmer from logged-in user
        const farmer = await farmerModel.findOne({ userId: req.user.id });
        if (!farmer) {
            return res.status(400).json({ success: false, message: 'Farmer not found for the logged-in user.' });
        }

        const packageToDelete = await packageModel.findOneAndDelete({ _id: id, farmerId: farmer._id });

        if (!packageToDelete) {
            return res.status(404).json({ success: false, message: 'Package not found or unauthorized' });
        }

        // ✅ Delete image from uploads folder if it exists
        if (packageToDelete.image) {
            fs.unlink(`uploads/${packageToDelete.image}`, (err) => {
                if (err) console.error('Failed to delete image:', err);
            });
        }

        res.status(200).json({ success: true, message: 'Package deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
