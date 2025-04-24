import express from 'express';
import { getWorkerProfile, updateWorkerProfile, deleteWorkerProfile } from '../controllers/profileController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/upload.js';

const profileRouter = express.Router();

// Get worker profile details
profileRouter.get('/worker-profile', authenticate, getWorkerProfile);

// Update worker profile details (with avatar upload)
profileRouter.patch('/update-profile', authenticate, upload.single('profileImage'), updateWorkerProfile);

// Delete worker profile
profileRouter.delete('/delete-profile', authenticate, deleteWorkerProfile);

export default profileRouter;