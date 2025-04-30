// controllers/permanentItemController.js
import PermanentItem from '../models/permanentItem.js';

export const getPermanentItems = async (req, res) => {
  try {
    const itemList = await PermanentItem.findOne({ userId: req.user._id });
    res.json({ success: true, items: itemList?.items || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch permanent items' });
  }
};

export const savePermanentItems = async (req, res) => {
  try {
    const { items } = req.body;
    const updated = await PermanentItem.findOneAndUpdate(
      { userId: req.user._id },
      { items },
      { upsert: true, new: true }
    );
    res.json({ success: true, items: updated.items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to save items' });
  }
};

export const deletePermanentItems = async (req, res) => {
  try {
    await PermanentItem.findOneAndDelete({ userId: req.user._id });
    res.json({ success: true, message: 'Items cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete items' });
  }
};
