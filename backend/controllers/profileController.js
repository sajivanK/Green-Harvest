import workerModel from '../models/workerModel.js';
import userModel from '../models/userModel.js';

// Get worker profile details
export const getWorkerProfile = async (req, res) => {
    try {
        const worker = await workerModel.findOne({ userId: req.user.id });

        if (!worker) {
            return res.status(404).json({ success: false, message: 'Worker profile not found' });
        }

        res.status(200).json({ success: true, worker });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update worker profile details
export const updateWorkerProfile = async (req, res) => {
    const { firstname, lastname, birthDate, address, city } = req.body;
    const profileImage = req.file ? req.file.path : null;

    try {
        let worker = await workerModel.findOne({ userId: req.user.id });

        if (!worker) {
            return res.status(404).json({ success: false, message: 'Worker profile not found' });
        }

        worker.firstname = firstname || worker.firstname;
        worker.lastname = lastname || worker.lastname;
        worker.birthDate = birthDate || worker.birthDate;
        worker.address = address || worker.address;
        worker.city = city || worker.city;
        worker.profileImage = profileImage || worker.profileImage;
        worker.updatedAt = Date.now();

        await worker.save();

        res.status(200).json({ success: true, message: 'Profile updated successfully', worker });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete worker profile
export const deleteWorkerProfile = async (req, res) => {
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