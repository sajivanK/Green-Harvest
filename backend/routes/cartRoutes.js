// backend/routes/cartRoutes.js

import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
} from "../controllers/cartController.js";

import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticate);

router.post("/add-to-cart", addToCart);
router.get("/get-cart", getCart);
router.patch("/update-cart-item", updateCartItem);
router.delete("/remove-cart-item/:productId", removeCartItem);

export default router;
