import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Pencil } from 'lucide-react';
import axiosApi from '../config/axiosConfig';

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    title: '',
    firstName: '',
    lastName: '',
    house: '',
    street: '',
    city: ''
  });

  const [avatar, setAvatar] = useState(null);
  const [existingAvatar, setExistingAvatar] = useState('');
  const fileInputRef = useRef(null);

  const sriLankanDistricts = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
    'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
    'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
    'Monaragala', 'Ratnapura', 'Kegalle'
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/auth/check', { withCredentials: true });
        if (res.data.success) {
          const user = res.data.user;
          const nameParts = user.name?.split(' ') || [];
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';
          const addressParts = user.address?.split(',') || [];

          setFormData({
            title: 'Mr',
            firstName,
            lastName,
            house: addressParts[0] || '',
            street: addressParts[1] || '',
            city: addressParts[2] || ''
          });

          setExistingAvatar(user.avatar || '');
        }
      } catch (err) {
        toast.error('Failed to load profile');
      }
    };
    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    const { firstName, lastName, house, street, city } = formData;
    if (!firstName || !lastName || !house || !street || !city) {
      toast.error('Please fill in all fields');
      return false;
    }
    if (firstName.length < 2 || lastName.length < 2) {
      toast.error('Name must be at least 2 characters');
      return false;
    }
    if (!/^[0-9]+$/.test(house)) {
      toast.error('House number must be numeric');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('house', formData.house);
      formDataToSend.append('street', formData.street);
      formDataToSend.append('city', formData.city);

      if (fileInputRef.current.files[0]) {
        formDataToSend.append('avatar', fileInputRef.current.files[0]);
      }

      const res = await axiosApi.patch('/api/user/profile', formDataToSend, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        alert('✅ Profile updated successfully!');
        setFormData({
          title: '',
          firstName: '',
          lastName: '',
          house: '',
          street: '',
          city: ''
        });
        setAvatar(null);
        setExistingAvatar(res.data.user.avatar || '');
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Update failed');
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-[#1e293b] text-white p-10 rounded-xl shadow-xl mt-10">
      {/* Avatar Upload */}
      <div className="flex flex-col items-center mb-8 relative">
        <img
          src={avatar || existingAvatar || 'https://cdn-icons-png.flaticon.com/512/3177/3177440.png'}
          alt="Avatar"
          className="w-24 h-24 rounded-full border-4 border-green-500 object-cover"
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />
        <button
          type="button"
          onClick={triggerFileInput}
          className="absolute top-0 right-[40%] transform translate-x-1/2 bg-green-600 hover:bg-green-700 p-2 rounded-full"
        >
          <Pencil className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-1 text-sm font-medium">Title</label>
          <select
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-green-500"
          >
            <option>Mr</option>
            <option>Ms</option>
            <option>Mrs</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">First Name</label>
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Last Name</label>
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">House No / Lane</label>
          <input
            name="house"
            value={formData.house}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Street Name</label>
          <input
            name="street"
            value={formData.street}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">District</label>
          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select District</option>
            {sriLankanDistricts.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>
        <div className="col-span-2">
          <button
            type="submit"
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded transition"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
