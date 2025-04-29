// // packageRoutes.js
// import express from 'express';
// import { createPackage, getPackages, updatePackage, deletePackage } from '../controllers/packageController.js';
// import { authenticate } from '../middlewares/authMiddleware.js';
// import { upload } from '../middlewares/upload.js';

// const packageRouter = express.Router();

// packageRouter.post('/create', authenticate, upload.single('image'), createPackage);
// packageRouter.get('/all', authenticate, getPackages);
// packageRouter.patch('/update/:id', authenticate, upload.single('image'), updatePackage);
// packageRouter.delete('/delete/:id', authenticate, deletePackage);

// export default packageRouter;

// packageRoutes.js

import express from 'express';
import { 
    createPackage, 
    getPackages, 
    getAllPackages, 
    updatePackage, 
    deletePackage 
} from '../controllers/packageController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/upload.js';

const packageRouter = express.Router();

// Protected Routes (Farmer)
packageRouter.post('/create', authenticate, upload.single('image'), createPackage);
packageRouter.patch('/update/:id', authenticate, upload.single('image'), updatePackage);
packageRouter.delete('/delete/:id', authenticate, deletePackage);

// Fetch Routes
packageRouter.get('/my-packages', authenticate, getPackages);  // Farmer can view his own
packageRouter.get('/all', getAllPackages);  // Public can view all available

export default packageRouter;
