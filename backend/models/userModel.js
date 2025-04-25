// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     roles: {
//         type: [String],
//         enum: ['Customer', 'Farmer', 'Delivery', 'Worker'],
//         default: ['Customer']
//     },
//     address: {
//         type: String,
//         required: true
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     },
//     verifyOtp:{
//         type: String,
//         default: ''
//     },
//     verifyOtpExpireAt:{
//         type:Number,
//         default: 0
//     },
//     isAccountVerified:{
//         type:Boolean,
//         default: false
//     },
//     resetOtp:{
//         type: String,
//         default: ''
//     },
//     resetOtpExpireAt:{
//         type:Number,
//         default: 0
//     }
// });

// const userModel = mongoose.models.user || mongoose.model('user', userSchema);

// export default userModel;


import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  roles: {
    type: [String],
    enum: ['Customer', 'Farmer', 'Delivery', 'Worker'],
    default: ['Customer']
  },
  address: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  verifyOtp: {
    type: String,
    default: ''
  },
  verifyOtpExpireAt: {
    type: Number,
    default: 0
  },
  isAccountVerified: {
    type: Boolean,
    default: false
  },
  resetOtp: {
    type: String,
    default: ''
  },
  resetOtpExpireAt: {
    type: Number,
    default: 0
  }
});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;
