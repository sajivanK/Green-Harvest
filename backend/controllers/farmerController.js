import farmerModel from '../models/farmerModel.js';
import userModel from '../models/userModel.js';
import fs from 'fs';
// Apply to become a farmer
// export const applyFarmer = async (req, res) => {
//     const { farmName, farmLocation, contactNumber, nicNumber } = req.body;

//     try {
//         const user = await userModel.findById(req.user.id);
//         if (!user) return res.status(404).json({ success: false, message: 'User not found' });

//         const existingFarmer = await farmerModel.findOne({ userId: req.user.id });
//         if (existingFarmer) return res.status(400).json({ success: false, message: 'Already registered as a farmer' });

//         const existingNIC = await farmerModel.findOne({ nicNumber });
//         if (existingNIC) return res.status(400).json({ success: false, message: 'NIC number already exists' });

//         // ✅ Extract profile image filename
//         const profileImage = req.file ? req.file.filename : '';

//         const farmer = new farmerModel({
//             userId: user._id,
//             farmName,
//             farmLocation,
//             contactNumber,
//             nicNumber,
//             profileImage,
//         });

//         await farmer.save();
//         res.status(201).json({ success: true, farmer });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// Apply to become a farmer
export const applyFarmer = async (req, res) => {
    const { farmName, farmLocation, contactNumber, nicNumber } = req.body;

    try {
        const user = await userModel.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const existingFarmer = await farmerModel.findOne({ userId: req.user.id });
        if (existingFarmer) return res.status(400).json({ success: false, message: 'Already registered as a farmer' });

        const existingNIC = await farmerModel.findOne({ nicNumber });
        if (existingNIC) return res.status(400).json({ success: false, message: 'NIC number already exists' });

        // ✅ Extract profile image filename
        const profileImage = req.file ? req.file.filename : '';

        const farmer = new farmerModel({
            userId: user._id,
            farmName,
            farmLocation,
            contactNumber,
            nicNumber,
            profileImage,
        });

        await farmer.save();

        // ✅ Add "Farmer" role to the user
        await userModel.findByIdAndUpdate(req.user.id, {
            $addToSet: { roles: 'Farmer' }
        });

        res.status(201).json({ success: true, message: "Farmer registered successfully", farmer });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



// Update farmer details

export const updateFarmer = async (req, res) => {
    const { farmName, farmLocation, contactNumber } = req.body;
    const profileImage = req.file ? req.file.filename : ''; // ✅ Fix this

    try {
        const farmer = await farmerModel.findOne({ userId: req.user.id });
        if (!farmer) return res.status(404).json({ success: false, message: 'Farmer profile not found' });

        // ✅ Delete old profile image if a new one is uploaded
        if (profileImage && farmer.profileImage) {
            fs.unlink(`uploads/${farmer.profileImage}`, (err) => {
                if (err) console.error('Failed to delete image:', err);
            });
        }

        farmer.farmName = farmName || farmer.farmName;
        farmer.farmLocation = farmLocation || farmer.farmLocation;
        farmer.contactNumber = contactNumber || farmer.contactNumber;
        farmer.profileImage = profileImage || farmer.profileImage;
        farmer.updatedAt = Date.now();

        await farmer.save();
        res.status(200).json({ success: true, message: 'Farmer details updated successfully', farmer });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Delete farmer details
export const deleteFarmer = async (req, res) => {
    try {
        const farmer = await farmerModel.findOneAndDelete({ userId: req.user.id });

        if (!farmer) {
            return res.status(404).json({ success: false, message: 'Farmer profile not found' });
        }

        await userModel.findByIdAndUpdate(req.user.id, {
            $pull: { roles: 'Farmer' }
        });

        res.status(200).json({ success: true, message: 'Farmer profile deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Fetch Farmer Profile
export const getFarmerProfile = async (req, res) => {
    try {
        // Find the farmer profile
        const farmer = await farmerModel.findOne({ userId: req.user.id }).select("-_id farmName farmLocation profileImage");
        if (!farmer) {
            return res.status(404).json({ success: false, message: "Farmer profile not found" });
        }

        // Find the user profile (to get the email)
        const user = await userModel.findById(req.user.id).select("email");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // ✅ Send both farmer and user data
        res.json({ success: true, farmer: { ...farmer.toObject(), email: user.email } });
    } catch (error) {
        console.error("⚠️ Error fetching farmer profile:", error);
        res.status(500).json({ success: false, message: "Failed to fetch farmer profile" });
    }
};


