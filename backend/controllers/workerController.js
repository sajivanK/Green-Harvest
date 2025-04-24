import workerModel from '../models/workerModel.js';
import userModel from '../models/userModel.js';



// Apply to become a worker
export const applyWorker = async (req, res) => {
    try {
      const { phone, location, nicNumber, bankName, accountNumber } = req.body;
  
      const user = await userModel.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      // Check if NIC already exists
      const existingNIC = await workerModel.findOne({ nicNumber });
      if (existingNIC) {
        return res.status(400).json({ success: false, message: 'NIC number already exists' });
      }
  
      // Get uploaded profile image from multer
      const profileImage = req.file ? `/uploads/${req.file.filename}` : null;
  
      if (!profileImage) {
        return res.status(400).json({ success: false, message: 'Profile image is required.' });
      }
  
      // Create worker profile
      const worker = new workerModel({
        userId: user._id,
        name: user.name,
        email: user.email,
        phone,
        location,
        nicNumber,
        bankName,
        accountNumber,
        profileImage,
      });
  
      await worker.save();
  
      // Add "Worker" role to user
      await userModel.findByIdAndUpdate(req.user.id, {
        $addToSet: { roles: 'Worker' },
      });
  
      res.status(201).json({
        success: true,
        message: 'Worker application submitted successfully',
        worker,
      });
    } catch (error) {
      console.error("Error applying worker:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
// export const applyWorker = async (req, res) => {
//     const { phone, location, nicNumber, bankName, accountNumber, profileImage } = req.body;
  
//     try {
//       // Find the user
//       const user = await userModel.findById(req.user.id);
//       if (!user) {
//         return res.status(404).json({ success: false, message: 'User not found' });
//       }
  
//       // Check if NIC number is already used
//       const existingNIC = await workerModel.findOne({ nicNumber });
//       if (existingNIC) {
//         return res.status(400).json({ success: false, message: 'NIC number already exists' });
//       }
  
//       // Create a new worker profile
//       const worker = new workerModel({
//         userId: user._id,
//         name: user.name,
//         email: user.email,
//         phone,
//         location,
//         nicNumber,
//         bankName,
//         accountNumber,
//         profileImage
//       });
  
//       await worker.save();
  
//       // ✅ Add "Worker" role to user
//       await userModel.findByIdAndUpdate(req.user.id, {
//         $addToSet: { roles: 'Worker' }
//       });
  
//       res.status(201).json({
//         success: true,
//         message: 'Worker application submitted successfully',
//         worker
//       });
//     } catch (error) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   };
  

// Update worker details
export const getWorkerProfile = async (req, res) => {
    try {
        const worker = await workerModel.findOne({ userId: req.user.id });

        if (!worker) {
            return res.status(404).json({ success: false, message: "Worker profile not found" });
        }

        res.status(200).json({ success: true, worker });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching worker profile" });
    }
};

export const updateWorker = async (req, res) => {
    try {
        const worker = await workerModel.findOne({ userId: req.user.id });

        if (!worker) {
            return res.status(404).json({ success: false, message: 'Worker profile not found' });
        }

        if (req.body.firstName || req.body.lastName) {
            worker.name = `${req.body.firstName || worker.name.split(" ")[0]} ${req.body.lastName || worker.name.split(" ")[1] || ''}`;
        }

        worker.phone = req.body.phone || worker.phone;
        worker.location = req.body.city || worker.location;
        worker.bankName = req.body.bankName || worker.bankName;
        worker.accountNumber = req.body.accountNumber || worker.accountNumber;

        // Update Profile Image if a New File is Uploaded
        if (req.file) {
            worker.profileImage = `/uploads/${req.file.filename}`;
        }

        worker.updatedAt = Date.now();
        await worker.save();

        res.status(200).json({ 
            success: true, 
            message: 'Worker details updated successfully', 
            worker: { ...worker.toObject(), profileImage: `http://localhost:4000${worker.profileImage}` } // Send Full Image URL
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete worker details
export const deleteWorker = async (req, res) => {
    try {
        const worker = await workerModel.findOneAndDelete({ userId: req.user.id });

        if (!worker) {
            return res.status(404).json({ success: false, message: 'Worker profile not found' });
        }

        // Remove 'Worker' role from user roles
        await userModel.findByIdAndUpdate(req.user.id, {
            $pull: { roles: 'Worker' }
        });

        res.status(200).json({ success: true, message: 'Worker profile deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Fetch all workers (for public/customer viewing)
export const getAllWorkers = async (req, res) => {
    try {
      const workers = await workerModel.find().select('name email phone location profileImage');
      res.status(200).json({ success: true, workers });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch workers." });
    }
  };
  