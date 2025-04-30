import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosApi from "../config/axiosConfig";
import {
  UploadCloud,
  FileImage,
  FileText,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

const UploadProof = ({ proofToEdit, setProofToEdit, fetchProofs }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    task:"",
    location: "",
    phone: "",
    email: "",
    beforeImage: null,
    afterImage: null,
  });

  const [message, setMessage] = useState("");
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (proofToEdit) {
      setFormData({
        task : proofToEdit.task || "",
        location: proofToEdit.location || "",
        phone: proofToEdit.phone || "",
        email: proofToEdit.email || "",
        beforeImage: null,
        afterImage: null,
      });
    }
  }, [proofToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBeforeImageChange = (event) => {
    const file = event.target.files[0];
    setFormData({ ...formData, beforeImage: file });
  };

  const handleAfterImageChange = (event) => {
    const file = event.target.files[0];
    setFormData({ ...formData, afterImage: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const phonePattern = /^\d{10}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!phonePattern.test(formData.phone)) {
      setMessage("Mobile number must be exactly 10 digits.");
      return;
    }

    if (!emailPattern.test(formData.email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    const form = new FormData();
    form.append("task", formData.task);
    form.append("location", formData.location);
    form.append("phone", formData.phone);
    form.append("email", formData.email);

    if (formData.beforeImage) {
      form.append("beforeImage", formData.beforeImage);
    }
    if (formData.afterImage) {
      form.append("afterImage", formData.afterImage);
    }

    try {
      if (proofToEdit) {
        await axiosApi.patch(`/api/proof/update-proof/${proofToEdit._id}`, form, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setMessage("Proof updated successfully!");
      } else {
        await axiosApi.post("/api/proof/upload-proof", form, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setMessage("Proof uploaded successfully!");
      }

      setTimeout(() => {
        setMessage("");
        navigate("/display-proof");
      }, 2000);

      setProofToEdit(null);
      fetchProofs();
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="p-6 flex justify-center">
      <div className="w-full max-w-3xl bg-gray-900 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <UploadCloud className="w-8 h-8 text-blue-400" /> {proofToEdit ? "Edit Proof" : "Upload Proof"}
        </h1>
        <p className="mt-2 text-gray-400">
          {proofToEdit ? "Edit and update proof details" : "Fill out the form below and upload proof of your completed task."}
        </p>

        {message && <p className="mt-4 text-center text-green-500">{message}</p>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">

        <div className="relative">
            <label className="text-gray-300 text-sm">Task Name</label>
            <div className="flex items-center bg-gray-800 p-3 rounded-lg">
              <MapPin className="w-5 h-5 text-blue-400 mr-3" />
              <input
                type="text"
                name="task"
                value={formData.task}
                onChange={handleChange}
                placeholder="Enter your Task"
                className="w-full bg-transparent text-white outline-none"
                required
              />
            </div>
          </div>

          {/* Location Field */}
          <div className="relative">
            <label className="text-gray-300 text-sm">Location</label>
            <div className="flex items-center bg-gray-800 p-3 rounded-lg">
              <MapPin className="w-5 h-5 text-blue-400 mr-3" />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter your location"
                className="w-full bg-transparent text-white outline-none"
                required
              />
            </div>
          </div>

          {/* Mobile Number Field */}
          <div className="relative">
            <label className="text-gray-300 text-sm">Mobile No</label>
            <div className="flex items-center bg-gray-800 p-3 rounded-lg">
              <Phone className="w-5 h-5 text-blue-400 mr-3" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your mobile number"
                className="w-full bg-transparent text-white outline-none"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="relative">
            <label className="text-gray-300 text-sm">Email</label>
            <div className="flex items-center bg-gray-800 p-3 rounded-lg">
              <Mail className="w-5 h-5 text-blue-400 mr-3" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full bg-transparent text-white outline-none"
                required
              />
            </div>
          </div>

          {/* Before Image Upload Box */}
          <div className="mt-4">
            <label className="text-gray-300 text-sm mb-2 block">Upload Before Image</label>
            <div className="bg-gray-800 p-6 rounded-lg border-2 border-dashed border-gray-600 text-white text-center">
              <label className="cursor-pointer flex flex-col items-center gap-4">
                <FileImage className="w-16 h-16 text-blue-400" />
                <p className="text-lg text-gray-300">Click to Upload Before Image</p>
                <input type="file" className="hidden" onChange={handleBeforeImageChange} />
              </label>
              {formData.beforeImage && (
                <div className="mt-4 text-center">
                  <FileText className="w-10 h-10 text-green-400 mx-auto" />
                  <p className="text-gray-300 text-lg">{formData.beforeImage.name}</p>
                </div>
              )}
            </div>
          </div>

          {/* After Image Upload Box */}
          <div className="mt-4">
            <label className="text-gray-300 text-sm mb-2 block">Upload After Image</label>
            <div className="bg-gray-800 p-6 rounded-lg border-2 border-dashed border-gray-600 text-white text-center">
              <label className="cursor-pointer flex flex-col items-center gap-4">
                <FileImage className="w-16 h-16 text-blue-400" />
                <p className="text-lg text-gray-300">Click to Upload After Image</p>
                <input type="file" className="hidden" onChange={handleAfterImageChange} />
              </label>
              {formData.afterImage && (
                <div className="mt-4 text-center">
                  <FileText className="w-10 h-10 text-green-400 mx-auto" />
                  <p className="text-gray-300 text-lg">{formData.afterImage.name}</p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 justify-center"
          >
            <CheckCircle className="w-6 h-6" />
            {proofToEdit ? "Update Proof" : "Submit Proof"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadProof;