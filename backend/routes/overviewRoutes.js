
import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { getFarmerOverviewStats } from '../controllers/overviewController.js';

const router = express.Router();

// ✅ Fetch overview stats for the logged-in farmer
router.get('/farmer-stats', authenticate, getFarmerOverviewStats);

export default router;
