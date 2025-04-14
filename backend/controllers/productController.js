
// // ✅ Updated productController.js
// import productModel from '../models/productModel.js';
// import fs from 'fs';

// // ✅ Create a new product
// export const createProduct = async (req, res) => {
//     const { name, category, price, stock, description } = req.body;
//     const image = req.file ? req.file.filename : '';
//     const qrCode = req.body.qrCode;

//     try {
//         const product = new productModel({
//             farmerId: req.user.id,
//             name,
//             category,
//             price,
//             stock,
//             description,
//             image,
//             qrCode
//         });

//         await product.save();

//         res.status(201).json({ success: true, message: 'Product created successfully', product });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// // ✅ Update an existing product
// export const updateProduct = async (req, res) => {
//     const { productId } = req.params;
//     const { name, category, price, stock, description, qrCode } = req.body;
//     const image = req.file ? req.file.filename : '';

//     try {
//         const product = await productModel.findById(productId);

//         if (!product) {
//             return res.status(404).json({ success: false, message: 'Product not found' });
//         }

//         if (product.farmerId.toString() !== req.user.id) {
//             return res.status(403).json({ success: false, message: 'Unauthorized to update this product' });
//         }

//         // If new image is uploaded, delete the old one
//         if (image && product.image) {
//             fs.unlink(`uploads/${product.image}`, (err) => {
//                 if (err) console.error('Failed to delete image:', err);
//             });
//         }

//         product.name = name || product.name;
//         product.category = category || product.category;
//         product.price = price || product.price;
//         product.stock = stock || product.stock;
//         product.description = description || product.description;
//         product.qrCode = qrCode || product.qrCode;
//         product.image = image || product.image;
//         product.updatedAt = Date.now();

//         await product.save();

//         res.status(200).json({ success: true, message: 'Product updated successfully', product });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// // ✅ Delete a product
// export const deleteProduct = async (req, res) => {
//     const { productId } = req.params;

//     try {
//         const product = await productModel.findById(productId);

//         if (!product) {
//             return res.status(404).json({ success: false, message: 'Product not found' });
//         }

//         if (product.farmerId.toString() !== req.user.id) {
//             return res.status(403).json({ success: false, message: 'Unauthorized to delete this product' });
//         }

//         if (product.image) {
//             fs.unlink(`uploads/${product.image}`, (err) => {
//                 if (err) console.error('Failed to delete image:', err);
//             });
//         }

//         await product.deleteOne();

//         res.status(200).json({ success: true, message: 'Product deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// // ✅ Get all products of the logged-in farmer
// export const getMyProducts = async (req, res) => {
//     try {
//         const products = await productModel.find({ farmerId: req.user.id });
//         res.status(200).json({ success: true, products });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// // ✅ Get all products
// export const getAllProducts = async (req, res) => {
//     try {
//         const products = await productModel.find();
//         res.status(200).json({ success: true, products });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// // ✅ Get category distribution
// export const getCategoryDistribution = async (req, res) => {
//     try {
//         const categoryData = await productModel.aggregate([
//             {
//                 $group: {
//                     _id: "$category",
//                     count: { $sum: 1 }
//                 }
//             },
//             {
//                 $sort: { count: -1 }
//             }
//         ]);

//         res.status(200).json({ success: true, categoryData });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// // ✅ Get single product by ID
// export const getSingleProduct = async (req, res) => {
//     try {
//         const product = await productModel.findById(req.params.id);
//         if (!product) {
//             return res.status(404).json({ success: false, message: 'Product not found' });
//         }

//         res.status(200).json({ success: true, product });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

import productModel from '../models/productModel.js';
import farmerModel from '../models/farmerModel.js';
import fs from 'fs';

// ✅ Create a new product
export const createProduct = async (req, res) => {
    const { name, category, price, stock, description } = req.body;
    const image = req.file ? req.file.filename : '';
    const qrCode = req.body.qrCode;

    try {
        // Fetch the farmer's information using the logged-in user's ID
        const farmer = await farmerModel.findOne({ userId: req.user.id });

        if (!farmer) {
            return res.status(400).json({ success: false, message: 'Farmer not found for the logged-in user.' });
        }

        const product = new productModel({
            farmerId: farmer._id,  // Set the correct farmerId from the farmer model
            name,
            category,
            price,
            stock,
            description,
            image,
            qrCode
        });

        await product.save();

        res.status(201).json({ success: true, message: 'Product created successfully', product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Update an existing product
export const updateProduct = async (req, res) => {
    const { productId } = req.params;
    const { name, category, price, stock, description, qrCode } = req.body;
    const image = req.file ? req.file.filename : '';

    try {
        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Fetch the farmer's information using the logged-in user's ID
        const farmer = await farmerModel.findOne({ userId: req.user.id });

        if (!farmer) {
            return res.status(400).json({ success: false, message: 'Farmer not found for the logged-in user.' });
        }

        if (product.farmerId.toString() !== farmer._id.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized to update this product' });
        }

        // If new image is uploaded, delete the old one
        if (image && product.image) {
            fs.unlink(`uploads/${product.image}`, (err) => {
                if (err) console.error('Failed to delete image:', err);
            });
        }

        product.name = name || product.name;
        product.category = category || product.category;
        product.price = price || product.price;
        product.stock = stock || product.stock;
        product.description = description || product.description;
        product.qrCode = qrCode || product.qrCode;
        product.image = image || product.image;
        product.updatedAt = Date.now();

        await product.save();

        res.status(200).json({ success: true, message: 'Product updated successfully', product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Delete a product
export const deleteProduct = async (req, res) => {
    const { productId } = req.params;

    try {
        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Fetch the farmer's information using the logged-in user's ID
        const farmer = await farmerModel.findOne({ userId: req.user.id });

        if (!farmer) {
            return res.status(400).json({ success: false, message: 'Farmer not found for the logged-in user.' });
        }

        if (product.farmerId.toString() !== farmer._id.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized to delete this product' });
        }

        if (product.image) {
            fs.unlink(`uploads/${product.image}`, (err) => {
                if (err) console.error('Failed to delete image:', err);
            });
        }

        await product.deleteOne();

        res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Get all products of the logged-in farmer
// ✅ Get all products of the logged-in farmer
export const getMyProducts = async (req, res) => {
    try {
        const farmer = await farmerModel.findOne({ userId: req.user.id });

        if (!farmer) {
            return res.status(400).json({ success: false, message: 'Farmer not found for the logged-in user.' });
        }

        const products = await productModel.find({ farmerId: farmer._id });
        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// ✅ Get all products
export const getAllProducts = async (req, res) => {
    try {
        const products = await productModel.find();
        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Get category distribution
export const getCategoryDistribution = async (req, res) => {
    try {
        const categoryData = await productModel.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        res.status(200).json({ success: true, categoryData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Get single product by ID
export const getSingleProduct = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.status(200).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
