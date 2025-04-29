// routes/subscriptionRoutes.js
import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import {
  createSubscription,
  getMySubscriptions,
  checkAndExpireSubscriptions,
  getFarmerSubscriptions,
  getSubscriptionStats
} from '../controllers/subscriptionController.js';

const router = express.Router();

router.post('/subscribe', authenticate, createSubscription);
router.get('/my-subscriptions', authenticate, getMySubscriptions);
router.get('/check-expiry', checkAndExpireSubscriptions); // optional admin route
router.get("/farmer-subscriptions", authenticate, getFarmerSubscriptions);
router.get('/stats', authenticate, getSubscriptionStats);


export default router;
