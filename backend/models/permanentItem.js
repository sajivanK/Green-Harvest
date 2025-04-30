// models/PermanentItem.js
import mongoose from 'mongoose';

const permanentItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  items: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true,
});

export default mongoose.model('PermanentItem', permanentItemSchema);
