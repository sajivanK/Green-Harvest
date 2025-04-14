// backend/controllers/cartController.js

import cartModel from "../models/cartModel.js";
import productModel from "../models/productModel.js";

// Add or Update Product in Cart
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;

  try {
    const product = await productModel.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    let cart = await cartModel.findOne({ userId });

    if (!cart) {
      cart = new cartModel({ userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.productId.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        farmerId: product.farmerId,
        quantity,
        price: product.price,
        image: product.image,
        name: product.name,
      });
    }

    await cart.save();
    res.status(200).json({ success: true, message: "Product added to cart", cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get User's Cart
export const getCart = async (req, res) => {
  try {
    const cart = await cartModel.findOne({ userId: req.user._id });
    res.status(200).json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Quantity of Cart Item
export const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const cart = await cartModel.findOne({ userId: req.user._id });
    const item = cart.items.find(i => i.productId.toString() === productId);
    if (item) item.quantity = quantity;
    await cart.save();
    res.json({ success: true, message: "Cart updated", cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Remove Item from Cart
export const removeCartItem = async (req, res) => {
  const { productId } = req.params;

  try {
    const cart = await cartModel.findOne({ userId: req.user._id });
    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();
    res.json({ success: true, message: "Item removed from cart", cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
