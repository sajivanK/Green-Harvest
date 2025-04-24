import React, { useState, useEffect } from "react";
import {
  User,
  UploadCloud,
  Trash2,
  Save,
} from "lucide-react";
import axiosApi from "../config/axiosConfig";

const ProfileSettings = () => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nicNumber: "",
    city: "",
    bankName: "",
    accountNumber: "",
    profileImage: "",
  });

  const [errors, setErrors] = useState({});
  const [profilePic, setProfilePic] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosApi.get("/api/worker/profile", { withCredentials: true });

        if (response.data.success) {
          const worker = response.data.worker;
          setProfile({
            firstName: worker.name?.split(" ")[0] || "",
            lastName: worker.name?.split(" ")[1] || "",
            email: worker.email,
            phone: worker.phone,
            nicNumber: worker.nicNumber,
            city: worker.location,
            bankName: worker.bankName,
            accountNumber: worker.accountNumber,
            profileImage: worker.profileImage ? `http://localhost:4000${worker.profileImage}` : "",
          });

          setProfilePic(worker.profileImage ? `http://localhost:4000${worker.profileImage}` : null);
        }
      } catch (error) {
        console.error("Error fetching profile:", error.response?.data || error.message);
      }
    };

    fetchProfile();
  }, []);

  // Validation Function
  const validate = () => {
    let newErrors = {};

    // Email Validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      newErrors.email = "Invalid email format.";
    }

    // NIC Number Validation (10 characters old format or 12 digits new format)
    if (!/^\d{9}[VXvx]$/.test(profile.nicNumber) && !/^\d{12}$/.test(profile.nicNumber)) {
      newErrors.nicNumber = "Invalid NIC number format.";
    }

    // Phone Number Validation (Must be exactly 10 digits)
    if (!/^\d{10}$/.test(profile.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits.";
    }

    // Account Number Validation (Must be numbers)
    if (profile.accountNumber && !/^\d+$/.test(profile.accountNumber)) {
      newErrors.accountNumber = "Account number must contain only numbers.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  // Handle Profile Picture Upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
      setProfile((prevProfile) => ({
        ...prevProfile,
        profileImage: file,
      }));
    }
  };

  // Handle Delete Avatar
  const handleDeleteAvatar = () => {
    setProfilePic(null);
    setProfile((prevProfile) => ({
      ...prevProfile,
      profileImage: "",
    }));
  };

  // Handle Save Settings
  const handleSave = async () => {
    if (!validate()) return; // Stop if validation fails

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("firstName", profile.firstName);
      formData.append("lastName", profile.lastName);
      formData.append("phone", profile.phone);
      formData.append("city", profile.city);
      formData.append("bankName", profile.bankName);
      formData.append("accountNumber", profile.accountNumber);

      // Append profile image only if it's a new file
      if (profile.profileImage && typeof profile.profileImage !== "string") {
        formData.append("profileImage", profile.profileImage);
      }

      const response = await axiosApi.patch("/api/worker/update-worker", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (response.data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert("Error updating profile. Please try again.");
      }
    } catch (error) {
      console.error("Profile update error:", error.response?.data || error.message);
      alert("Failed to update profile.");
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="flex-1 overflow-auto">
        <div className="w-full max-w-2xl mx-auto bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl border border-gray-700 p-8">
          <h1 className="text-3xl font-bold text-white text-center flex items-center justify-center gap-2">
            <User className="w-6 h-6 text-blue-400" /> Profile Settings
          </h1>
          <p className="mt-2 text-gray-400 text-center">Update your profile details.</p>

          {/* Profile Picture Upload */}
          <div className="mt-4 flex flex-col items-center">
            <label>
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-500 shadow-md">
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-full h-full text-gray-500 p-4" />
                )}
              </div>
              <input type="file" className="hidden" onChange={handleFileChange} />
            </label>
          </div>

          {/* Form Section */}
          <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-300 mb-4">Personal Details</h2>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InputField label="First Name" type="text" name="firstName" value={profile.firstName} onChange={handleChange} required />
                <InputField label="Last Name" type="text" name="lastName" value={profile.lastName} onChange={handleChange} required />
              </div>

              <InputField label="Email" type="email" name="email" value={profile.email} onChange={handleChange} required error={errors.email} />
              <InputField label="NIC Number" type="text" name="nicNumber" value={profile.nicNumber} onChange={handleChange} required error={errors.nicNumber} />
              <InputField label="Phone Number" type="tel" name="phone" value={profile.phone} onChange={handleChange} required error={errors.phone} />
              <InputField label="City" type="text" name="city" value={profile.city} onChange={handleChange} required />

              <h2 className="text-lg font-semibold text-gray-300 mt-6">Bank Details</h2>
              <InputField label="Bank Name" type="text" name="bankName" value={profile.bankName} onChange={handleChange} />
              <InputField label="Account Number" type="text" name="accountNumber" value={profile.accountNumber} onChange={handleChange} error={errors.accountNumber} />

              <button
                type="button"
                onClick={handleSave}
                className="w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 justify-center hover:bg-green-600 transition-all"
                disabled={loading}>
                <Save className="w-6 h-6" />
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

//Reusable Input Field Component with Error Handling
const InputField = ({ label, error, required, ...props }) => (
  <div className="relative">
    <label className="text-gray-400 font-medium text-sm">{label}</label>
    <input {...props} className="w-full bg-gray-700 text-white border border-gray-600 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none" required={required} />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default ProfileSettings;