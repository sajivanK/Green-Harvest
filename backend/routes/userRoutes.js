import express from 'express';
import { updateUserProfile } from '../controllers/userController.js';
import { upload } from "../middlewares/uploads.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.patch('/profile', authenticate, upload.single('avatar'), updateUserProfile);

export default userRouter;
