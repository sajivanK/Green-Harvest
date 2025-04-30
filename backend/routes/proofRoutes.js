import express from 'express';
import { uploadProof, getWorkerProofs, updateProof, deleteProof } from '../controllers/proofController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploads.js';

const proofRouter = express.Router();

// Upload proof for a completed task sending data to db
// ✅ Upload proof (accepts beforeImage and afterImage)
proofRouter.post(
    '/upload-proof',
    authenticate,
    upload.fields([
      { name: 'beforeImage', maxCount: 1 },
      { name: 'afterImage', maxCount: 1 }
    ]),
    uploadProof
  );


  
//localhost 4000/api/proof/upload-proof

// Get all proofs uploaded by the logged-in worker
proofRouter.get('/worker-proofs', authenticate, getWorkerProofs);

// Update a proof (Worker can edit their own proof)
proofRouter.patch('/update-proof/:id', authenticate, upload.single('proofImage'), updateProof);

// Delete a proof (Only worker can delete their own proof)
proofRouter.delete('/delete-proof/:id', authenticate, deleteProof);




export default proofRouter;