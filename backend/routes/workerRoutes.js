import express from 'express';
import { applyWorker, updateWorker, deleteWorker, getWorkerProfile, getAllWorkers } from '../controllers/workerController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/upload.js'; // ✅ Import Upload Middleware

const workerRouter = express.Router();

// Fetch Worker Profile
workerRouter.get('/profile', authenticate, getWorkerProfile);

// Apply to become a worker
workerRouter.post('/apply-worker', authenticate, upload.single('profileImage'), applyWorker);


// Update worker details (Accept Profile Image)
workerRouter.patch('/update-worker', authenticate, upload.single('profileImage'), updateWorker);

// Delete worker details
workerRouter.delete('/delete-worker', authenticate, deleteWorker);

workerRouter.get('/all', getAllWorkers);


export default workerRouter;