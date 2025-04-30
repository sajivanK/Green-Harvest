import workerModel from '../models/workerModel.js';
import userModel from '../models/userModel.js';
import nodemailer from 'nodemailer'; // for sending emails



const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: '8715a1001@smtp-brevo.com',  // your Brevo Email
    pass: 'h1rQfWmH3naTk8wx'          // your Brevo SMTP Password
  }
});

const generateWorkerSuccessEmail = (workerName, profileImageUrl) => `
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f2f2f2; padding: 30px; }
    .container { background-color: #ffffff; padding: 25px; border-radius: 12px; max-width: 600px; margin: auto; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); }
    .header { background-color: #2e7d32; padding: 20px; border-radius: 12px 12px 0 0; color: white; text-align: center; }
    .profile-img { width: 100px; height: 100px; object-fit: cover; border-radius: 50%; margin: 20px auto; display: block; border: 3px solid #4CAF50; }
    .content { font-size: 16px; color: #333; line-height: 1.6; }
    .footer { margin-top: 30px; font-size: 13px; color: #888; text-align: center; }
    .highlight { color: #4CAF50; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Welcome to GreenHarvest, ${workerName}!</h2>
    </div>
    <img src="${profileImageUrl}" alt="Profile Image" class="profile-img" />
    <div class="content">
      <p>Hi <strong>${workerName}</strong>,</p>
      <p>We're excited to let you know that your <span class="highlight">worker profile</span> has been successfully created on <strong>GreenHarvest</strong>.</p>
      <p>You can now start exploring opportunities, accept tasks, and contribute to a greener tomorrow!</p>
      <p>If you have any questions, feel free to reach out to us.</p>
      <p>Thank you for being a part of our mission.</p>
    </div>
    <div class="footer">
      &copy; 2025 GreenHarvest | Connecting Farmers, Workers & Communities
    </div>
  </div>
</body>
</html>
`;


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

        const workerUser = await userModel.findById(worker.userId);
            if (workerUser?.email) {
              await transporter.sendMail({
                from: 'jansteinsaji16@gmail.com',
                to: workerUser.email,
                subject: '📦 Worker created successfully',
                html: generateWorkerSuccessEmail(workerUser.name, `${process.env.BASE_URL || 'http://localhost:4000'}${worker.profileImage}`)

              });
            }
      
  
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
  