// routes/permanentItemRoutes.js
import express from 'express';
import {
  getPermanentItems,
  savePermanentItems,
  deletePermanentItems
} from '../controllers/permanentItemController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(authenticate, getPermanentItems)
  .post(authenticate, savePermanentItems)
  .delete(authenticate, deletePermanentItems);

export default router;
