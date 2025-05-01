import express from 'express';
import { updateUserProfile, getUserProfile } from '../controllers/userController.js';
import { upload } from "../middlewares/uploads.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.patch('/profile', authenticate, upload.single('avatar'), updateUserProfile);
userRouter.get("/profile", authenticate, getUserProfile);
export default userRouter;
