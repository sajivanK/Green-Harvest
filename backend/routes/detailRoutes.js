import express from 'express';
import {
  createDetail,
  getDetails,
  getSingleDetail,
  updateDetail,
  deleteDetail
}  from '../controllers/detailController.js'; // ✅ Correct casing


import { orderUpload as upload } from '../middlewares/orderuploads.js';
import { authenticate } from '../middlewares/authMiddleware.js'; // Optional if auth needed

const detailRouter = express.Router();

// ✅ Create a new detail entry (with image)
detailRouter.post('/create', upload.single('image'), createDetail);

// ✅ Get all details
detailRouter.get('/all', getDetails);

// ✅ Get a single detail by ID
detailRouter.get('/:id', getSingleDetail);

// ✅ Update detail with optional new image
detailRouter.patch('/update/:id', upload.single('image'), updateDetail);

// ✅ Delete a detail by ID
detailRouter.delete('/delete/:id', deleteDetail);


export default detailRouter;


























/*

const express = require("express");
const multer = require("multer");
const path = require("path");

const { createDetail, getDetails, getSingleDetail, updateDetail, deleteDetail } = require("../controllers/DetailController");

const router = express.Router();

// Set up Multer for storing images in the uploads folder
const storage = multer.diskStorage({
    destination: "uploads/", // ✅ Save images in the "uploads" folder
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

// File filter for allowing only images
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
        cb(null, true);
    } else {
        cb(new Error("Only .jpg, .jpeg, or .png files are allowed!"));
    }
};

// Upload middleware
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // ✅ Limit image size to 5MB
    fileFilter
});

// ✅ Routes with image upload
router.post("/", upload.single("image"), createDetail);
router.get("/", getDetails);
router.get("/:id", getSingleDetail);
router.delete("/:id", deleteDetail)
router.patch("/:id", upload.single("image"), updateDetail);


module.exports = router;*/
