import mongoose from "mongoose";

const detailSchema = new mongoose.Schema(
    {
      workDistrict: {
        type: String,
        required: true,
      },
      location: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true, // storing filename or path (e.g. '/uploads/img.jpg')
      },
      expectedDateToFinish: {
        type: Date,
        required: true,
      },
      additionalInformation: {
        type: String,
        default: '',
      },
      isChecked: {
        type: Boolean,
        default: false,
      },
      days: {
        type: Number,
        required: true,
      },
      hours: {
        type: Number,
        required: true,
      },
    },
    {
      timestamps: true, // Adds createdAt and updatedAt fields
    }
  );
  
  // ✅ Export with model check to avoid overwrite in hot reload environments
  export default mongoose.models.detail || mongoose.model("detail", detailSchema);


  /*const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DetailSchema = new Schema(
    {
        workDistrict: { type: String, required: true },
        location: { type: String, required: true },
        email: { type: String, required: true },
        image: { type: String, required: true }, // Store only the image filename
        expectedDateToFinish: { 
            type: Date, 
            required: true,
        },
        additionalInformation: { type: String },
        isChecked: { type: Boolean, default: false }, // Default to false
        days: { type: Number, required: true },
        hours: { type: Number, required: true }
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model("Detail", DetailSchema);
*/ 
  