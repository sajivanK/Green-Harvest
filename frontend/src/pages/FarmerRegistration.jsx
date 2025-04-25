// import { useState, useEffect } from 'react';
// import axiosApi from '../config/axiosConfig';
// import { useNavigate } from 'react-router-dom';

// const FarmerRegistration = ({ initialData, onClose }) => {
//     const navigate = useNavigate();

//     const [form, setForm] = useState({
//         farmName: '',
//         farmLocation: '',
//         contactNumber: '',
//         nicNumber: '',
//         profileImage: null,
//     });

//     const [errors, setErrors] = useState({});
//     const [success, setSuccess] = useState('');

//     // ✅ Load initial data if editing
//     useEffect(() => {
//         if (initialData) {
//             setForm({
//                 farmName: initialData.farmName || '',
//                 farmLocation: initialData.farmLocation || '',
//                 contactNumber: initialData.contactNumber || '',
//                 nicNumber: initialData.nicNumber || '',
//                 profileImage: initialData.profileImage || null,
//             });
//         }
//     }, [initialData]);

//     // ✅ Validate Form
//     const validateForm = () => {
//         const newErrors = {};
        
//         if (!form.farmName.trim()) newErrors.farmName = "Farm name is required.";
//         if (!form.farmLocation.trim()) newErrors.farmLocation = "Farm location is required.";

//         // Validate Contact Number (10 digits only)
//         if (!form.contactNumber.trim()) {
//             newErrors.contactNumber = "Contact number is required.";
//         } else if (!/^\d{10}$/.test(form.contactNumber)) {
//             newErrors.contactNumber = "Invalid contact number. Must be 10 digits.";
//         }

//         // Validate NIC Number (Format: 9 digits + V or 12 digits)
//         if (!form.nicNumber.trim()) {
//             newErrors.nicNumber = "NIC number is required.";
//         } else if (!/^\d{9}[Vv]$|^\d{12}$/.test(form.nicNumber)) {
//             newErrors.nicNumber = "Invalid NIC number. Use 9 digits + 'V' or 12 digits.";
//         }

//         // Validate Image (Required for new registrations)
//         if (!form.profileImage && !initialData) {
//             newErrors.profileImage = "Profile image is required.";
//         }

//         return newErrors;
//     };

//     const handleChange = (e) => {
//         const { name, value, files } = e.target;
//         if (name === 'profileImage') {
//             setForm({ ...form, profileImage: files[0] });
//         } else {
//             setForm({ ...form, [name]: value });
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formErrors = validateForm();

//         if (Object.keys(formErrors).length > 0) {
//             setErrors(formErrors);
//             return;
//         }

//         const formData = new FormData();
//         formData.append('farmName', form.farmName);
//         formData.append('farmLocation', form.farmLocation);
//         formData.append('contactNumber', form.contactNumber);
//         formData.append('nicNumber', form.nicNumber);
//         if (form.profileImage instanceof File) {
//             formData.append('profileImage', form.profileImage);
//         }

//         try {
//             const endpoint = initialData ? '/api/farmer/update-farmer' : '/api/farmer/apply-farmer';
//             const method = initialData ? 'patch' : 'post';

//             const response = await axiosApi[method](endpoint, formData, {
//                 headers: { 'Content-Type': 'multipart/form-data' },
//                 withCredentials: true,
//             });

//             if (response.data.success) {
//                 setSuccess(response.data.message);
//                 setErrors({});

//                 // ✅ Close the form after updating
//                 if (initialData) {
//                     onClose();
//                 } else {
//                     setTimeout(() => {
//                         navigate('/overview');
//                     }, 2000);
//                 }
//             } else {
//                 setErrors({ form: response.data.message });
//             }
//         } catch (err) {
//             setErrors({ form: err.response?.data?.message || 'An error occurred' });
//             setSuccess('');
//         }
//     };

//     return (
//         <div className="mt-20 max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-lg py-6">
//             <h2 className="text-2xl font-bold text-white mb-4">
//                 {initialData ? "Edit Profile" : "Farmer Registration"}
//             </h2>

//             {errors.form && <p className="text-red-500">{errors.form}</p>}
//             {success && <p className="text-green-500">{success}</p>}

//             <form onSubmit={handleSubmit} className="space-y-4">
//                 <input
//                     type="text"
//                     name="farmName"
//                     placeholder="Farm Name"
//                     className="w-full p-2 bg-gray-700 text-white rounded-lg"
//                     value={form.farmName}
//                     onChange={handleChange}
//                 />
//                 {errors.farmName && <p className="text-red-400 text-sm">{errors.farmName}</p>}

//                 <input
//                     type="text"
//                     name="farmLocation"
//                     placeholder="Farm Location"
//                     className="w-full p-2 bg-gray-700 text-white rounded-lg"
//                     value={form.farmLocation}
//                     onChange={handleChange}
//                 />
//                 {errors.farmLocation && <p className="text-red-400 text-sm">{errors.farmLocation}</p>}

//                 <input
//                     type="text"
//                     name="contactNumber"
//                     placeholder="Contact Number"
//                     className="w-full p-2 bg-gray-700 text-white rounded-lg"
//                     value={form.contactNumber}
//                     onChange={handleChange}
//                 />
//                 {errors.contactNumber && <p className="text-red-400 text-sm">{errors.contactNumber}</p>}

//                 <input
//                     type="text"
//                     name="nicNumber"
//                     placeholder="NIC Number"
//                     className="w-full p-2 bg-gray-700 text-white rounded-lg"
//                     value={form.nicNumber}
//                     onChange={handleChange}
//                     //disabled={!!initialData} // Prevent NIC from being changed
//                 />
//                 {errors.nicNumber && <p className="text-red-400 text-sm">{errors.nicNumber}</p>}

//                 <input
//                     type="file"
//                     name="profileImage"
//                     accept="image/*"
//                     className="w-full p-2 bg-gray-700 text-white rounded-lg"
//                     onChange={handleChange}
//                 />
//                 {errors.profileImage && <p className="text-red-400 text-sm">{errors.profileImage}</p>}

//                 <div className="flex justify-between">
//                     <button type="submit" className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 w-1/2">
//                         {initialData ? "Update" : "Register"}
//                     </button>
//                     {initialData && (
//                         <button
//                             type="button"
//                             onClick={onClose}
//                             className="ml-5 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 w-1/2"
//                         >
//                             Cancel
//                         </button>
//                     )}
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default FarmerRegistration;

import { useState, useEffect } from 'react';
import axiosApi from '../config/axiosConfig';
import { useNavigate } from 'react-router-dom';

const FarmerRegistration = ({ initialData, onClose }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    farmName: '',
    farmLocation: '',
    contactNumber: '',
    nicNumber: '',
    profileImage: null,
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (initialData) {
      setForm({
        farmName: initialData.farmName || '',
        farmLocation: initialData.farmLocation || '',
        contactNumber: initialData.contactNumber || '',
        nicNumber: initialData.nicNumber || '',
        profileImage: initialData.profileImage || null,
      });
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (!form.farmName.trim()) newErrors.farmName = "Farm name is required.";
    if (!form.farmLocation.trim()) newErrors.farmLocation = "Farm location is required.";
    if (!form.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required.";
    } else if (!/^\d{10}$/.test(form.contactNumber)) {
      newErrors.contactNumber = "Invalid contact number. Must be 10 digits.";
    }
    if (!form.nicNumber.trim()) {
      newErrors.nicNumber = "NIC number is required.";
    } else if (!/^\d{9}[Vv]$|^\d{12}$/.test(form.nicNumber)) {
      newErrors.nicNumber = "Invalid NIC number. Use 9 digits + 'V' or 12 digits.";
    }
    if (!form.profileImage && !initialData) {
      newErrors.profileImage = "Profile image is required.";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profileImage') {
      setForm({ ...form, profileImage: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const formData = new FormData();
    formData.append('farmName', form.farmName);
    formData.append('farmLocation', form.farmLocation);
    formData.append('contactNumber', form.contactNumber);
    formData.append('nicNumber', form.nicNumber);
    if (form.profileImage instanceof File) {
      formData.append('profileImage', form.profileImage);
    }

    try {
      const endpoint = initialData ? '/api/farmer/update-farmer' : '/api/farmer/apply-farmer';
      const method = initialData ? 'patch' : 'post';

      const response = await axiosApi[method](endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      if (response.data.success) {
        setSuccess(response.data.message);
        setErrors({});
        if (initialData) {
          onClose();
        } else {
          setTimeout(() => {
            navigate('/overview');
          }, 2000);
        }
      } else {
        setErrors({ form: response.data.message });
      }
    } catch (err) {
      setErrors({ form: err.response?.data?.message || 'An error occurred' });
      setSuccess('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-800 to-white px-4">
      <div className="w-full sm:w-[450px] bg-slate-900 p-8 rounded-xl shadow-lg text-sm text-indigo-300">
        <h2 className="text-3xl font-semibold text-white text-center mb-4">
          {initialData ? "Edit Profile" : "Farmer Registration"}
        </h2>

        {errors.form && <p className="text-red-400 text-sm mb-2 text-center">{errors.form}</p>}
        {success && <p className="text-green-400 text-sm mb-2 text-center">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-[#115a4b] rounded-full px-5 py-2.5 flex items-center">
            <input
              type="text"
              name="farmName"
              placeholder="Farm Name"
              className="w-full bg-transparent outline-none text-white placeholder:text-indigo-200"
              value={form.farmName}
              onChange={handleChange}
            />
          </div>
          {errors.farmName && <p className="text-red-400 text-xs">{errors.farmName}</p>}

          <div className="bg-[#115a4b] rounded-full px-5 py-2.5 flex items-center">
            <input
              type="text"
              name="farmLocation"
              placeholder="Farm Location"
              className="w-full bg-transparent outline-none text-white placeholder:text-indigo-200"
              value={form.farmLocation}
              onChange={handleChange}
            />
          </div>
          {errors.farmLocation && <p className="text-red-400 text-xs">{errors.farmLocation}</p>}

          <div className="bg-[#115a4b] rounded-full px-5 py-2.5 flex items-center">
            <input
              type="text"
              name="contactNumber"
              placeholder="Contact Number"
              className="w-full bg-transparent outline-none text-white placeholder:text-indigo-200"
              value={form.contactNumber}
              onChange={handleChange}
            />
          </div>
          {errors.contactNumber && <p className="text-red-400 text-xs">{errors.contactNumber}</p>}

          <div className="bg-[#115a4b] rounded-full px-5 py-2.5 flex items-center">
            <input
              type="text"
              name="nicNumber"
              placeholder="NIC Number"
              className="w-full bg-transparent outline-none text-white placeholder:text-indigo-200"
              value={form.nicNumber}
              onChange={handleChange}
            />
          </div>
          {errors.nicNumber && <p className="text-red-400 text-xs">{errors.nicNumber}</p>}

          <div className="bg-[#115a4b] rounded-full px-5 py-2.5">
            <input
              type="file"
              name="profileImage"
              accept="image/*"
              className="text-white file:bg-transparent file:border-none file:text-indigo-200"
              onChange={handleChange}
            />
          </div>
          {errors.profileImage && <p className="text-red-400 text-xs">{errors.profileImage}</p>}

          <div className="flex justify-between gap-4 mt-4">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-full bg-[#0b8f49] text-white font-bold"
            >
              {initialData ? "Update" : "Register"}
            </button>
            {initialData && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-full bg-red-600 text-white font-bold"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default FarmerRegistration;

