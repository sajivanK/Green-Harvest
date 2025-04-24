// import proofModel from '../models/proofModel.js';
// import workerModel from '../models/workerModel.js';

// // Upload proof for a completed task
// export const uploadProof = async (req, res) => {
//     try {
//         // store input values
//         const { location, phone, email } = req.body;
//         const proofImage = req.file ? `/uploads/${req.file.filename}` : null;
       
//         // checking user id and worker id       //worker id  //user req id
//         const worker = await workerModel.findOne({ userId: req.user.id });
//         if (!worker) {
//             return res.status(403).json({ success: false, message: "You must be a registered worker to upload proof." });
//         }
                    
//         const proof = new proofModel({
//             workerId: worker._id,
//             location,
//             phone,
//             email,
//             proofImage
//         });
//         //store data in db
//         await proof.save();
        
//         res.status(201).json({
//             success: true,
//             message: "Proof uploaded successfully",
//            // proof: { ...proof.toObject(), proofImage: `http://localhost:4000${proofImage}` } 
//         });
//     } catch (error) {
//         //console.error("Error uploading proof:", error.message);
//         res.status(500).json({ success: false, message: "Internal server error. Please try again." });
//     }
// };

// // Get proofs uploaded by the logged-in worker
// export const getWorkerProofs = async (req, res) => {
//     try {
//         const worker = await workerModel.findOne({ userId: req.user.id });
//         if (!worker) {
//             return res.status(403).json({ success: false, message: 'Unauthorized access' });
//         }
//         //store details about worker
//         const proofs = await proofModel.find({ workerId: worker._id });
//         //direct to client
//         res.status(200).json({ success: true, proofs });
//     } catch (error) {
//         console.error("Error fetching proofs:", error.message);
//         res.status(500).json({ success: false, message: "Error fetching proof records." });
//     }
// };

// // Update proof details
// export const updateProof = async (req, res) => {
//     try {
//         const { location, phone, email } = req.body;
//         const proofImage = req.file ? `/uploads/${req.file.filename}` : null;

//         const proof = await proofModel.findById(req.params.id);
//         if (!proof) {
//             return res.status(404).json({ success: false, message: 'Proof not found' });
//         }

//         // Check if the worker owns this proof
//         const worker = await workerModel.findOne({ userId: req.user.id });
//         if (!worker || proof.workerId.toString() !== worker._id.toString()) {
//             return res.status(403).json({ success: false, message: 'Unauthorized access' });
//         }

//         // Update proof details
//         proof.location = location || proof.location;
//         proof.phone = phone || proof.phone;
//         proof.email = email || proof.email;
//         if (proofImage) {
//             proof.proofImage = proofImage;
//         }
//                           //store updated time
//         proof.updatedAt = Date.now();
        
//         // save the updated data
//         await proof.save();

//         res.status(200).json({ success: true, message: 'Proof updated successfully', proof });
//     } catch (error) {
//         console.error("Error updating proof:", error.message);
//         res.status(500).json({ success: false, message: "Error updating proof details." });
//     }
// };

// // Delete proof by ID
// export const deleteProof = async (req, res) => {
//     try {
//         const proof = await proofModel.findById(req.params.id);
//         if (!proof) {
//             return res.status(404).json({ success: false, message: 'Proof not found' });
//         }

//         // Check if the worker owns this proof
//         const worker = await workerModel.findOne({ userId: req.user.id });
//         if (!worker || proof.workerId.toString() !== worker._id.toString()) {
//             return res.status(403).json({ success: false, message: 'Unauthorized access' });
//         }
//                          //for delete data
//         await proofModel.findByIdAndDelete(req.params.id);
//         res.status(200).json({ success: true, message: 'Proof deleted successfully' });
//     } catch (error) {
//         console.error("Error deleting proof:", error.message);
//         res.status(500).json({ success: false, message: "Error deleting proof." });
//     }
// };

import proofModel from '../models/proofModel.js';
import workerModel from '../models/workerModel.js';

// ✅ Upload proof with before & after images
export const uploadProof = async (req, res) => {
  try {
    const { location, phone, email } = req.body;

    const beforeImage = req.files?.beforeImage?.[0]
      ? `/uploads/${req.files.beforeImage[0].filename}`
      : null;

    const afterImage = req.files?.afterImage?.[0]
      ? `/uploads/${req.files.afterImage[0].filename}`
      : null;

    const worker = await workerModel.findOne({ userId: req.user.id });
    if (!worker) {
      return res.status(403).json({
        success: false,
        message: "You must be a registered worker to upload proof.",
      });
    }

    const proof = new proofModel({
      workerId: worker._id,
      location,
      phone,
      email,
      beforeImage,
      afterImage,
    });

    await proof.save();

    res.status(201).json({
      success: true,
      message: "Proof uploaded successfully",
    });
  } catch (error) {
    console.error("Error uploading proof:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again.",
    });
  }
};

// ✅ Get all proofs submitted by logged-in worker
export const getWorkerProofs = async (req, res) => {
  try {
    const worker = await workerModel.findOne({ userId: req.user.id });
    if (!worker) {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    const proofs = await proofModel.find({ workerId: worker._id });
    res.status(200).json({ success: true, proofs });
  } catch (error) {
    console.error("Error fetching proofs:", error.message);
    res.status(500).json({ success: false, message: "Error fetching proof records." });
  }
};

// ✅ Update proof (supports optional single new image)
export const updateProof = async (req, res) => {
  try {
    const { location, phone, email } = req.body;
    const proofImage = req.file ? `/uploads/${req.file.filename}` : null;

    const proof = await proofModel.findById(req.params.id);
    if (!proof) {
      return res.status(404).json({ success: false, message: 'Proof not found' });
    }

    const worker = await workerModel.findOne({ userId: req.user.id });
    if (!worker || proof.workerId.toString() !== worker._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    proof.location = location || proof.location;
    proof.phone = phone || proof.phone;
    proof.email = email || proof.email;
    if (proofImage) {
      proof.proofImage = proofImage;
    }

    proof.updatedAt = Date.now();
    await proof.save();

    res.status(200).json({ success: true, message: 'Proof updated successfully', proof });
  } catch (error) {
    console.error("Error updating proof:", error.message);
    res.status(500).json({ success: false, message: "Error updating proof details." });
  }
};

// ✅ Delete a proof by ID
export const deleteProof = async (req, res) => {
  try {
    const proof = await proofModel.findById(req.params.id);
    if (!proof) {
      return res.status(404).json({ success: false, message: 'Proof not found' });
    }

    const worker = await workerModel.findOne({ userId: req.user.id });
    if (!worker || proof.workerId.toString() !== worker._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    await proofModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Proof deleted successfully' });
  } catch (error) {
    console.error("Error deleting proof:", error.message);
    res.status(500).json({ success: false, message: "Error deleting proof." });
  }
};
