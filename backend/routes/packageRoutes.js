// packageRoutes.js
import express from 'express';
import { createPackage, getPackages, updatePackage, deletePackage } from '../controllers/packageController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/upload.js';

const packageRouter = express.Router();

packageRouter.post('/create', authenticate, upload.single('image'), createPackage);
packageRouter.get('/all', authenticate, getPackages);
packageRouter.patch('/update/:id', authenticate, upload.single('image'), updatePackage);
packageRouter.delete('/delete/:id', authenticate, deletePackage);

export default packageRouter;