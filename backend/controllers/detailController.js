import mongoose from "mongoose";
import detailModel from "../models/detailModel.js";

// ✅ Create a new detail
export const createDetail = async (req, res) => {
  const {
    workDistrict,
    location,
    expectedDateToFinish,
    email,
    additionalInformation,
    isChecked,
    days,
    hours,
  } = req.body;

  if (!req.file) {
    return res.status(400).json({ success: false, message: "Image file is required" });
  }

  try {
    const imagePath = `/uploads/${req.file.filename}`;

    const newDetail = new detailModel({
      workDistrict,
      location,
      email,
      expectedDateToFinish,
      additionalInformation,
      isChecked,
      days,
      hours,
      image: imagePath,
    });

    await newDetail.save();

    res.status(201).json({
      success: true,
      message: "Detail created successfully",
      data: newDetail,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get all details
export const getDetails = async (req, res) => {
  try {
    const details = await detailModel.find();
    res.status(200).json({ success: true, data: details });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get single detail by ID
export const getSingleDetail = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid detail ID" });
  }

  try {
    const detail = await detailModel.findById(id);
    if (!detail) {
      return res.status(404).json({ success: false, message: "Detail not found" });
    }

    res.status(200).json({ success: true, data: detail });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update detail by ID
export const updateDetail = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid detail ID" });
  }

  const updateData = { ...req.body };

  if (req.file) {
    updateData.image = `/uploads/${req.file.filename}`;
  }

  try {
    const updatedDetail = await detailModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedDetail) {
      return res.status(404).json({ success: false, message: "Detail not found" });
    }

    res.status(200).json({ success: true, message: "Detail updated", data: updatedDetail });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete detail by ID
export const deleteDetail = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid detail ID" });
  }

  try {
    const deleted = await detailModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Detail not found" });
    }

    res.status(200).json({ success: true, message: "Detail deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/*


const mongoose = require("mongoose");
const DetailModel = require("../models/DetailModel");


// To create a new detail entry - POST
const createDetail = async (req, res) => {
    const { workDistrict, location, expectedDateToFinish, email, additionalInformation, isChecked, days, hours } = req.body;

    if (!req.file) {
        return res.status(400).json({ error: "Image file is required!" });
    }

    try {
        // Save the image file path (relative to the server)
        const imagePath = `/uploads/${req.file.filename}`;

        const newDetail = await DetailModel.create({
            workDistrict,
            location,
            email,
            expectedDateToFinish,
            additionalInformation,
            isChecked,
            days,
            hours,
            image: imagePath // Save the file path
        });

        res.status(201).json({
            id: newDetail._id,
            workDistrict: newDetail.workDistrict,
            email: newDetail.email,
            location: newDetail.location,
            expectedDateToFinish: newDetail.expectedDateToFinish,
            additionalInformation: newDetail.additionalInformation,
            isChecked: newDetail.isChecked,
            days: newDetail.days,
            hours: newDetail.hours,
            image: imagePath // Return image path
        });
    } catch (e) {
        console.error("Error creating detail:", e);
        res.status(400).json({ error: e.message || "Unknown error occurred" });
    }
};


//get all details
const getDetails = async (req, res) => {
    try {
        const details = await DetailModel.find({});
        
        // Convert each image from Base64 format to a proper structure for frontend display
        const formattedDetails = details.map(detail => ({
            id: detail._id,
            workDistrict: detail.workDistrict,
            email: detail.email,
            expectedDateToFinish: detail.expectedDateToFinish,
            additionalInformation: detail.additionalInformation,
            isChecked: detail.isChecked,
            days: detail.days,
            hours: detail.hours,
            image: detail.image ? `data:${detail.image.contentType};base64,${detail.image.data}` : null
        }));

        res.status(200).json(formattedDetails);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};


// To get a single detail - GET
const getSingleDetail = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Detail not found" });
    }

    try {
        const detail = await DetailModel.findById(id);
        if (!detail) {
            return res.status(404).json({ error: "Detail not found" });
        }

        // Format the image as Base64 Data URL
        const image = detail.image ? `data:${detail.image.contentType};base64,${detail.image.data}` : null;

        res.status(200).json({
            id: detail._id,
            workDistrict: detail.workDistrict,
            email: detail.email,
            expectedDateToFinish: detail.expectedDateToFinish,
            additionalInformation: detail.additionalInformation,
            isChecked: detail.isChecked,
            days: detail.days,
            hours: detail.hours,
            image: image // Base64 formatted image
        });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

// to update a Detail
const updateDetail = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Detail not found" });
    }

    const updateData = { ...req.body };

    // If a new image file is provided, process and update it
    if (req.file) {
        updateData.image = {
            data: req.file.buffer.toString("base64"), // ✅ Convert image to Base64
            contentType: req.file.mimetype
        };
    }
    

    try {
        const updatedDetail = await DetailModel.findByIdAndUpdate(id, updateData, { new: true });

        // Convert image to Base64 format for the response
        const image = updatedDetail.image ? `data:${updatedDetail.image.contentType};base64,${updatedDetail.image.data}` : null;

        res.status(200).json({
            id: updatedDetail._id,
            workDistrict: updatedDetail.workDistrict,
            email: updatedDetail.email,
            expectedDateToFinish: updatedDetail.expectedDateToFinish,
            additionalInformation: updatedDetail.additionalInformation,
            isChecked: updatedDetail.isChecked,
            days: updatedDetail.days,
            hours: updatedDetail.hours,
            image: image // Return image as Base64 data URL
        });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};


// To delete a detail - DELETE
const deleteDetail = async (req, res) => {
    const { id } = req.params;

    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid order ID" });
    }

    try {
        // Attempt to find and delete the detail by ID
        const detail = await DetailModel.findByIdAndDelete(id);

        // If detail is not found, return an error
        if (!detail) {
            return res.status(404).json({ error: "Detail not found" });
        }

        // Respond with a success message
        res.status(200).json({ message: "Order deleted successfully" });
    } catch (e) {
        // Catch any database or other errors
        res.status(400).json({ error: e.message });
    }
};




module.exports = { createDetail, getDetails, getSingleDetail, updateDetail, deleteDetail};*/
