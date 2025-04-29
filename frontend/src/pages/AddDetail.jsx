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
  const [language, setLanguage] = useState('English');

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
              ...response.data.data,
              id: response.data.data._id,
              workerEmail: workerEmail,
              userEmail: email
            }
          }
        });
      }
    } catch (error) {
      console.error("Error adding detail:", error);
      if (error.response) {
        alert('Error adding detail: ' + error.response.data.message);
      } else {
        alert('Error adding detail: ' + error.message);
      }
    }
  };

  const textLabels = {
    English: {
      personalInfo: "Personal Information",
      messyArea: "Details About Messy Area",
      email: "Enter your email",
      location: "Enter location",
      selectDistrict: "Select District",
      numberOfDays: "Enter number of days",
      hoursPerDay: "Enter hours needed per day",
      additionalInfo: "Additional Information",
      checkout: "Checkout",
      terms: "Terms and Conditions",
      agree: "I agree to the Terms and Conditions"
    },
    Tamil: {
      personalInfo: "தனிப்பட்ட தகவல்",
      messyArea: "குப்பை பகுதியின் விவரங்கள்",
      email: "உங்கள் மின்னஞ்சலை உள்ளிடவும்",
      location: "இடத்தை உள்ளிடவும்",
      selectDistrict: "மாவட்டத்தை தேர்ந்தெடுக்கவும்",
      numberOfDays: "நாட்களின் எண்ணிக்கை",
      hoursPerDay: "ஒரு நாளில் தேவையான மணி நேரம்",
      additionalInfo: "கூடுதல் தகவல்",
      checkout: "சரிபார்க்கவும்",
      terms: "விதிமுறைகள் மற்றும் நிபந்தனைகள்",
      agree: "நான் விதிமுறைகளுக்கும் நிபந்தனைகளுக்கும் சம்மதிக்கிறேன்"
    },
    Sinhala: {
      personalInfo: "පෞද්ගලික තොරතුරු",
      messyArea: "අපද්‍රව්‍ය ප්‍රදේශය පිළිබඳ විස්තර",
      email: "ඔබගේ ඊමේල් ලිපිනය ඇතුළත් කරන්න",
      location: "ස්ථානය ඇතුළත් කරන්න",
      selectDistrict: "දිස්ත්‍රික්කය තෝරන්න",
      numberOfDays: "දින ගණන ඇතුළත් කරන්න",
      hoursPerDay: "දිනකට අවශ්‍ය පැය",
      additionalInfo: "අමතර තොරතුරු",
      checkout: "පරීක්ෂා කරන්න",
      terms: "කොන්දේසි සහ නියමයන්",
      agree: "මම කොන්දේසි හා නියමයන් පිළිගනිමි"
    }
  };

  const districts = {
    English: ["Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya"],
    Tamil: ["கொழும்பு", "கம்பஹா", "களுத்துறை", "கண்டி", "மத்தளை", "நுவரெலியா"],
    Sinhala: ["කොළඹ", "ගම්පහ", "කළුතර", "කැඳි", "මතාළේ", "නුවර එළිය"]
  };

  return (
    <section className="py-10 bg-gray-900 text-gray-200">
      {/* Navbar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-gray-800 p-6 rounded-lg mb-8 shadow-md">
        <div>
          <h1 className="text-2xl font-bold text-green-400">Smart Waste Management System</h1>
          <p className="text-sm text-gray-400">Green Harvest</p>
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-4 mt-4 md:mt-0">
          <button onClick={() => navigate("/")} className="px-4 py-2 bg-green-600 rounded-lg text-white hover:bg-green-700">Home</button>
          
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
          >
            <option value="English">English</option>
            <option value="Tamil">Tamil</option>
            <option value="Sinhala">Sinhala</option>
          </select>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-md">
        <form onSubmit={handleAddDetail} className="space-y-6">
          <h3 className="text-2xl font-semibold text-green-500">{textLabels[language].personalInfo}</h3>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200" placeholder={textLabels[language].email} />

          <h3 className="text-2xl font-semibold text-green-500">{textLabels[language].messyArea}</h3>
          <input type="text" value={locationValue} onChange={(e) => setLocation(e.target.value)} required className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200" placeholder={textLabels[language].location} />

          <select value={district} onChange={(e) => setDistrict(e.target.value)} required className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200">
            <option value="">{textLabels[language].selectDistrict}</option>
            {districts[language].map((d, index) => (
              <option key={index} value={d}>{d}</option>
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
              today.setHours(0, 0, 0, 0);
              if (selectedDate <= today) {
                alert("Please select a future date for Expected Finish Date.");
                setExpectedDeadline('');
              } else {
                setExpectedDeadline(e.target.value);
              }
            }}
            required
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200"
          />

          <input type="number" value={days} onChange={(e) => setDays(e.target.value)} min="1" max="30" required className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200" placeholder={textLabels[language].numberOfDays} />

          <input type="number" value={hours} onChange={(e) => setHours(e.target.value)} min="0" max="12" required className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200" placeholder={textLabels[language].hoursPerDay} />

          <input type="text" value={additionalInformation} onChange={(e) => setAdditionalInformation(e.target.value)} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200" placeholder={textLabels[language].additionalInfo} />

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => { if (!isChecked) setShowModal(true); }}
              className="w-5 h-5"
            />
            <span>{textLabels[language].agree}</span>
          </label>

          <button type="submit" className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">{textLabels[language].checkout}</button>
        </form>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg text-gray-200">
            <h2 className="text-xl font-semibold text-green-500">{textLabels[language].terms}</h2>
            <p className="mt-4 text-gray-300">
                  By agreeing to our Terms and Conditions, you confirm that the provided information is accurate to the best of your knowledge.
                  Green Harvest reserves the right to verify the submitted details. All payments made are final and non-refundable after the service is confirmed.
                  Please ensure your availability on scheduled days. Thank you for trusting Smart Waste Management System of Green Harvest.
                </p>
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
