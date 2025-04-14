import express from "express";
import { applyFarmer, updateFarmer, deleteFarmer, getFarmerProfile } from "../controllers/farmerController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/upload.js";

const farmerRouter = express.Router();

farmerRouter.post("/apply-farmer", authenticate, upload.single("profileImage"), applyFarmer);
farmerRouter.patch("/update-farmer", authenticate, upload.single("profileImage"), updateFarmer);
farmerRouter.delete("/delete-farmer", authenticate, deleteFarmer);
farmerRouter.get("/profile", authenticate, getFarmerProfile); // ✅ Fetch farmer profile

export default farmerRouter;
