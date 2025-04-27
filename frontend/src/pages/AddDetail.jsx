import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const AddDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state?.order || {};
  const workerEmail = location.state?.workerEmail || "";

  const [email, setEmail] = useState(orderData.email || '');
  const [locationValue, setLocation] = useState(orderData.location || '');
  const [district, setDistrict] = useState(orderData.workDistrict || '');
  const [expectedDeadline, setExpectedDeadline] = useState(orderData.expectedDateToFinish || '');
  const [days, setDays] = useState(orderData.days || '');
  const [hours, setHours] = useState(orderData.hours || '');
  const [additionalInformation, setAdditionalInformation] = useState(orderData.additionalInformation || '');
  const [image, setImage] = useState(orderData.image ? `http://localhost:4000${orderData.image}` : null);
  const [imagePreview, setImagePreview] = useState(orderData.image ? `http://localhost:4000${orderData.image}` : '');
  const [imageName, setImageName] = useState(orderData.image ? orderData.image.split('/').pop() : '');

  const [isChecked, setIsChecked] = useState(orderData.agreedToTerms || false);
  const [showModal, setShowModal] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setImageName(file.name);
    }
  };

  const handleAgreeTerms = () => {
    setIsChecked(true);
    setShowModal(false);
  };

  const handleAddDetail = async (e) => {
    e.preventDefault();
    if (!isChecked) {
      alert("You must agree to the Terms and Conditions");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("location", locationValue);
    formData.append("workDistrict", district);
    formData.append("expectedDateToFinish", expectedDeadline);
    formData.append("days", days);
    formData.append("hours", hours);
    formData.append("additionalInformation", additionalInformation);
    formData.append("isChecked", isChecked);

    if (image) formData.append("image", image);

    try {
      const response = await axios.post('http://localhost:4000/api/detail/create', formData, {
        withCredentials: true,
      });

      if (response.status === 201) {
        alert('Detail added successfully!');
        navigate("/preview", {
            state: {
              order: {
                ...response.data.data, // ✅ spread the actual detail fields
                id: response.data.data._id, // ✅ correct ID
                workerEmail: workerEmail , // ✅ include this
                userEmail: email 
              }
            }
          });
          
      }
    } catch (error) {
      console.error("Error adding detail:", error);
      if (error.response) {
        console.error("Backend response:", error.response.data); // ✅ print real backend error
        alert('Error adding detail: ' + error.response.data.message);
      } else {
        console.error("General error:", error.message);
        alert('Error adding detail: ' + error.message);
      }
    }
    
};

  return (
    <section className="py-10 bg-gray-900 text-gray-200">
      <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-md">
        <form onSubmit={handleAddDetail} className="space-y-6">
          <h3 className="text-2xl font-semibold text-green-500">Personal Information</h3>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200" placeholder="Enter your email" />

          <h3 className="text-2xl font-semibold text-green-500">Details About Messy Area</h3>
          <input type="text" value={locationValue} onChange={(e) => setLocation(e.target.value)} required className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200" placeholder="Enter location" />

          <select value={district} onChange={(e) => setDistrict(e.target.value)} required className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200">
            <option value="">Select District</option>
            {["Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya", "Galle", "Matara", "Hambantota",
              "Jaffna", "Trincomalee", "Ratnapuri", "Kilinochi", "Mannar", "Vavuniya", "Mullaitivu", "Batticaloa", "Ampara", "Trincomalee", "Kurunegala", "puttalam", "Anuradhapura", "Pollannaruwa", "Badulla", "Moneregalla", "Kegalle"
            ].map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <input type="file" accept="image/*" onChange={handleImageChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200" />
          {imageName && <p className="text-gray-400">Selected File: {imageName}</p>}

          {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 w-full rounded-md" />}

            <input
            type="date"
            value={expectedDeadline.split("T")[0]}
            onChange={(e) => {
              const selectedDate = new Date(e.target.value);
              const today = new Date();
              today.setHours(0, 0, 0, 0);  // remove time part from today

              if (selectedDate <= today) {
                alert("Please select a future date for Expected Finish Date.");
                setExpectedDeadline(''); // clear wrong input
              } else {
                setExpectedDeadline(e.target.value);
              }
            }}
            required
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200"
          />


          <input type="number" value={days} onChange={(e) => setDays(e.target.value)} min="1" max="30" required className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200" placeholder="Enter number of days" />

          <input type="number" value={hours} onChange={(e) => setHours(e.target.value)} min="0" max="12" required className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200" placeholder="Enter hours needed per day" />

          <input type="text" value={additionalInformation} onChange={(e) => setAdditionalInformation(e.target.value)} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200" placeholder="Additional Information" />

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => {
                if (!isChecked) setShowModal(true);
              }}
              className="w-5 h-5"
            />
            <span>I agree to the <span className="text-green-400 underline cursor-pointer" onClick={() => setShowModal(true)}>Terms and Conditions</span></span>
          </label>

          <button type="submit" className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">Checkout</button>
        </form>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg text-gray-200">
            <h2 className="text-xl font-semibold text-green-500">Terms and Conditions</h2>
            <p className="mt-4 text-gray-300">{/* Your Terms Content */}</p>

            <div className="mt-6 flex justify-end space-x-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-600 rounded-md text-white">Cancel</button>
              <button onClick={handleAgreeTerms} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Agree</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AddDetail;
