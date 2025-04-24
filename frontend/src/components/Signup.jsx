// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axiosApi from "../config/axiosConfig";

// const Signup = () => {
//   useEffect(() => {
//     document.body.style.overflowX = "hidden";
//     return () => {
//       document.body.style.overflowX = "auto";
//     };
//   }, []);

//   const [worker, setWorker] = useState({
//     name: "",
//     email: "",
//     password: "",
//     nicNumber: "", 
//     phone: "",
//     location: "",
//     bankName: "",
//     accountNumber: "",
//     agreedToTerms: false,
//   });

//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();


//   useEffect(() => {
//     const checkUserLogin = async () => {
//       try {
//         const response = await axiosApi.get("/api/auth/check", {
//           withCredentials: true,
//         });

//         if (response.data.success) {
//           console.log("User is logged in:", response.data.user);
//         }
//       } catch (error) {
//         console.log("User is NOT logged in, allowing registration.");
//       }
//     };

//     checkUserLogin();
//   }, []);

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setWorker({ ...worker, [name]: value });
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!worker.agreedToTerms) {
//       setMessage("You must agree to the Terms and Conditions.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await axiosApi.post(
//         "/api/worker/apply-worker",
//         {
//           phone: worker.phone,
//           location: worker.location,
//           nicNumber: worker.nicNumber, 
//           bankName: worker.bankName || "",
//           accountNumber: worker.accountNumber || "",
//           profileImage: "https://example.com/profile.jpg", // Placeholder image
//         },
//         { withCredentials: true }
//       );

//       if (response.data.success) {
//         setMessage("Worker application submitted successfully!");
//         setTimeout(() => navigate("/dashboard"), 2000); // Redirect after success
//       } else {
//         setMessage(response.data.message);
//       }
//     } catch (error) {
//       console.error("Signup Error:", error.response?.data || error.message);
//       setMessage(error.response?.data?.message || "Worker registration failed.");
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="relative w-full h-screen overflow-hidden">
//       <div
//         className="fixed inset-0 bg-cover bg-center"
//         style={{
//           backgroundImage: "url('/pngtree.jpg')",
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           backgroundRepeat: "no-repeat",
//           filter: "brightness(70%) blur(5px)",
//         }}
//       ></div>

//       <div className="relative z-10 flex items-center justify-center h-full">
//         <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
//           <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
//             Worker Registration
//           </h2>

//           {message && (
//             <p className={`mb-4 text-center text-sm ${message.includes("success") ? "text-green-500" : "text-red-500"}`}>
//               {message}
//             </p>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <input
//               className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500"
//               type="text"
//               name="name"
//               placeholder="Full Name"
//               value={worker.name}
//               onChange={handleChange}
//               required
//             />
//             <input
//               className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500"
//               type="email"
//               name="email"
//               placeholder="Email"
//               value={worker.email}
//               onChange={handleChange}
//               required
//             />
//             <input
//               className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500"
//               type="password"
//               name="password"
//               placeholder="Password"
//               value={worker.password}
//               onChange={handleChange}
//               required
//             />
//             <input
//               className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500"
//               type="text"
//               name="nicNumber"
//               placeholder="NIC Number"
//               value={worker.nicNumber}
//               onChange={handleChange}
//               required
//             />
//             <input
//               className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500"
//               type="tel"
//               name="phone"
//               placeholder="Phone Number"
//               value={worker.phone}
//               onChange={handleChange}
//               required
//             />
//             <input
//               className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500"
//               type="text"
//               name="location"
//               placeholder="Location (City/Area)"
//               value={worker.location}
//               onChange={handleChange}
//               required
//             />


//             <h3 className="text-lg font-semibold text-gray-700">
//               Bank Account Details (Optional)
//             </h3>
//             <input
//               className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500"
//               type="text"
//               name="bankName"
//               placeholder="Bank Name"
//               value={worker.bankName}
//               onChange={handleChange}
//             />
//             <input
//               className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500"
//               type="text"
//               name="accountNumber"
//               placeholder="Account Number"
//               value={worker.accountNumber}
//               onChange={handleChange}
//             />

//             <div className="flex items-center space-x-2">
//               <input
//                 type="checkbox"
//                 checked={worker.agreedToTerms}
//                 onChange={() => setWorker({ ...worker, agreedToTerms: !worker.agreedToTerms })}
//                 className="w-4 h-4"
//                 required
//               />
//               <label className="text-gray-600 text-sm">
//                 I agree to the Terms and Conditions
//               </label>
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition-all"
//               disabled={loading}
//             >
//               {loading ? "Registering..." : "REGISTER"}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosApi from "../config/axiosConfig";

const Signup = () => {
  useEffect(() => {
    document.body.style.overflowX = "hidden";
    return () => {
      document.body.style.overflowX = "auto";
    };
  }, []);

  const [worker, setWorker] = useState({
    name: "",
    email: "",
    password: "",
    nicNumber: "", 
    phone: "",
    location: "",
    bankName: "",
    accountNumber: "",
    agreedToTerms: false,
    profileImage: null,
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserLogin = async () => {
      try {
        const response = await axiosApi.get("/api/auth/check", { withCredentials: true });
        if (response.data.success) {
          console.log("User is logged in:", response.data.user);
        }
      } catch (error) {
        console.log("User is NOT logged in, allowing registration.");
      }
    };
    checkUserLogin();
  }, []);

  // Input handler
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      setWorker({ ...worker, profileImage: files[0] });
    } else {
      setWorker({ ...worker, [name]: value });
    }
  };

  // Form validation
  const validateForm = () => {
    const { name, email, password, phone, nicNumber, location, profileImage, agreedToTerms } = worker;

    if (!name || !email || !password || !phone || !nicNumber || !location || !profileImage) {
      return "Please fill all required fields and upload your profile image.";
    }
    if (!/^\d{10}$/.test(phone)) {
      return "Phone number must be exactly 10 digits.";
    }
    if (!/^\d{9}[vV]$|^\d{12}$/.test(nicNumber)) {
      return "NIC number must be 9 digits + V or 12 digits.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Invalid email format.";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters long.";
    }
    if (!agreedToTerms) {
      return "You must agree to the Terms and Conditions.";
    }

    return null;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      setMessage(error);
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("phone", worker.phone);
    formData.append("location", worker.location);
    formData.append("nicNumber", worker.nicNumber);
    formData.append("bankName", worker.bankName || "");
    formData.append("accountNumber", worker.accountNumber || "");
    formData.append("profileImage", worker.profileImage);

    try {
      const response = await axiosApi.post("/api/worker/apply-worker", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (response.data.success) {
        setMessage("Worker application submitted successfully!");
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);
      setMessage(error.response?.data?.message || "Worker registration failed.");
    }

    setLoading(false);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/pngtree.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "brightness(70%) blur(5px)",
        }}
      ></div>

      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Worker Registration
          </h2>

          {message && (
            <p className={`mb-4 text-center text-sm ${message.includes("success") ? "text-green-500" : "text-red-500"}`}>
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500"
              type="text" name="name" placeholder="Full Name" value={worker.name} onChange={handleChange} required />
            <input className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500"
              type="email" name="email" placeholder="Email" value={worker.email} onChange={handleChange} required />
            <input className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500"
              type="password" name="password" placeholder="Password" value={worker.password} onChange={handleChange} required />
            <input className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500"
              type="text" name="nicNumber" placeholder="NIC Number" value={worker.nicNumber} onChange={handleChange} required />
            <input className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500"
              type="tel" name="phone" placeholder="Phone Number" value={worker.phone} onChange={handleChange} required />
            <input className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500"
              type="text" name="location" placeholder="Location (City/Area)" value={worker.location} onChange={handleChange} required />

            <h3 className="text-lg font-semibold text-gray-700">Bank Account Details (Optional)</h3>
            <input className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500"
              type="text" name="bankName" placeholder="Bank Name" value={worker.bankName} onChange={handleChange} />
            <input className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500"
              type="text" name="accountNumber" placeholder="Account Number" value={worker.accountNumber} onChange={handleChange} />

            {/* ✅ Profile Image Upload */}
            <input className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500"
              type="file" name="profileImage" accept="image/*" onChange={handleChange} required />

            <div className="flex items-center space-x-2">
              <input type="checkbox" checked={worker.agreedToTerms} onChange={() => setWorker({ ...worker, agreedToTerms: !worker.agreedToTerms })} className="w-4 h-4" required />
              <label className="text-gray-600 text-sm">I agree to the Terms and Conditions</label>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition-all">
              {loading ? "Registering..." : "REGISTER"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
