// packageController.js
import packageModel from '../models/packageModel.js';
import fs from 'fs';

// Create a package
export const createPackage = async (req, res) => {
    try {
        const { packageName, description, price, duration, deliveryFrequency, products } = req.body;
        const imagePath = req.file ? req.file.filename : '';

        const newPackage = new packageModel({
            farmerId: req.user.id,
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

// Get all packages of a specific farmer
export const getPackages = async (req, res) => {
    try {
        const packages = await packageModel.find({ farmerId: req.user.id });
        res.status(200).json({ success: true, packages });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all packages in the database
export const getAllPackages = async (req, res) => {
    try {
        const packages = await packageModel.find();
        res.status(200).json({ success: true, packages });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updatePackage = async (req, res) => {
    try {
        const { id } = req.params;
        let updateData = req.body;

        // ✅ Convert `products` back to an array if it's a string
        if (typeof updateData.products === "string") {
            updateData.products = JSON.parse(updateData.products);
        }

        // ✅ Only update the image if a new one is uploaded
        if (req.file) {
            updateData.image = req.file.filename;
        } else {
            delete updateData.image; // Prevents overwriting with empty string
        }

        const updatedPackage = await packageModel.findOneAndUpdate(
            { _id: id, farmerId: req.user.id },
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

// Delete a package
export const deletePackage = async (req, res) => {
    try {
        const { id } = req.params;

        const packageToDelete = await packageModel.findOneAndDelete({ _id: id, farmerId: req.user.id });

        if (!packageToDelete) {
            return res.status(404).json({ success: false, message: 'Package not found or unauthorized' });
        }

        // Delete the image file if exists
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
