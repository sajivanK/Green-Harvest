import { editTemporaryOrder } from "../controllers/temporaryOrderController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import express from "express";
import {
  createTemporaryOrder,
  confirmTemporaryOrder,
  deleteTemporaryOrder,
 
} from "../controllers/temporaryOrderController.js";

const router = express.Router();

router.post("/createOrder", authenticate, createTemporaryOrder);
router.post("/confirmOrder",authenticate, confirmTemporaryOrder);
router.delete("/deleteOrder/:orderId", authenticate,deleteTemporaryOrder);
router.put("/editOrder", authenticate, editTemporaryOrder);

export default router;
