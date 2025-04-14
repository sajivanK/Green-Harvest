// backend/routes/checkoutRoutes.js
import express from "express";
import { checkoutCart } from "../controllers/checkoutController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/checkout", authenticate, checkoutCart);

export default router;
