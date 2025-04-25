import userModel from '../models/userModel.js';
import fs from 'fs';

export const updateUserProfile = async (req, res) => {
  const { firstName, lastName, house, street, city } = req.body;
  const avatar = req.file ? req.file.filename : '';

  try {
    const user = await userModel.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // 🧹 Delete old avatar if new one uploaded
    if (avatar && user.avatar) {
      fs.unlink(`uploads/${user.avatar}`, (err) => {
        if (err) console.error('Failed to delete old avatar:', err);
      });
    }

    // ✅ Compose and update full name
    const finalFirst = firstName || user.name?.split(' ')[0] || '';
    const finalLast = lastName || user.name?.split(' ').slice(1).join(' ') || '';
    user.name = `${finalFirst} ${finalLast}`.trim();

    // ✅ Update address
    if (house || street || city) {
      user.address = `${house || ''},${street || ''},${city || ''}`.trim();
    }

    // ✅ Update avatar if uploaded
    if (avatar) {
      user.avatar = avatar;
    }

    await user.save();

    return res.status(200).json({ success: true, message: 'User profile updated successfully', user });
  } catch (error) {
    console.error('❌ Error updating profile:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
