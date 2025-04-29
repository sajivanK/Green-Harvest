import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";



const Transaction = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  const paymentAmount = location.state?.paymentAmount || 0;
  const workerEmail = location.state?.workerEmail || "";
  const orderId = location.state?.orderId || "";
  const userEmail = location.state?.userEmail || "";
  const workingDays = location.state?.workingDays || "";
  const workingHours = location.state?.workingHours || "";
  

  const [paymentDetails, setPaymentDetails] = useState({
    cardHolder: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({ cardNumber: "" });
  const [otp, setOtp] = useState("");
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    let countdown;
    if (showOtpPopup) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(countdown);
            setShowOtpPopup(false);
            return 60;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [showOtpPopup]);

  const handleInputChange = (e) => {
    setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value });
    if (e.target.name === "cardNumber") setErrors({ ...errors, cardNumber: "" });
  };

  const validateCardNumber = () => {
    const cardNumberRegex = /^\d{16}$/;
    if (!cardNumberRegex.test(paymentDetails.cardNumber)) {
      setErrors({ ...errors, cardNumber: "Card number must be exactly 16 digits." });
      return false;
    }
    return true;
  };

  const sendOtp = async () => {
    try {
      await axios.post("http://localhost:4000/api/transaction/send-otp", { email: userEmail });
      setShowOtpPopup(true);
      setTimer(60);
      setResendEnabled(false);
      alert("OTP sent to your email!");
    } catch (error) {
      console.error(error);
      alert("Failed to send OTP.");
    }
  };

  const resendOtp = () => {
    sendOtp();
  };

  

  const verifyOtpAndPay = async () => {
    try {
      const res = await axios.post("http://localhost:4000/api/transaction/verify-otp", {
        email: userEmail,
        otp,
      });
  
      if (res.status === 200) {
        await axios.post(
          "http://localhost:4000/api/transaction/complete",
          {
            email: userEmail,
            cardHolder: paymentDetails.cardHolder,
            cardNumber: paymentDetails.cardNumber,
            expiryDate: paymentDetails.expiryDate,
            cvv: paymentDetails.cvv,
            orderId,
            workerEmail,
            paymentAmount,
          },
          { withCredentials: true }
        );
  
        alert("Payment Successful! 🎉");
  
      // 🚀 Instead of immediately navigating, show popup first
      setShowDownloadPopup(true);
  
        // ✅ After navigation, optionally fire notifyWorker
        axios.post("http://localhost:4000/api/transaction/notify-worker", {
          workerEmail,
          userEmail,
          workingDays,
          workingHours,
        }).catch((error) => {
          console.error("Worker notification failed, but payment successful.", error);
        });
  
      } else {
        alert("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Invalid OTP or Payment Failed.");
    }
  };
  
  

  const handlePayment = (e) => {
    e.preventDefault();
    if (validateCardNumber()) {
      sendOtp();
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
  
    // ✅ Draw Green Border
    doc.setDrawColor(0, 128, 0); // Green color (RGB)
    doc.setLineWidth(2.5);
    doc.rect(10, 10, 190, 277); // (x, y, width, height)
  
    // ✅ Title
    doc.setFontSize(20);
    doc.setTextColor(0, 128, 0); // Green
    doc.text("Welcome to Smart Waste Management System", 105, 30, { align: 'center' });
    doc.text("of Green Harvest", 105, 40, { align: 'center' });
  
    // ✅ Line separator
    doc.setDrawColor(0, 128, 0);
    doc.line(20, 50, 190, 50); // (x1, y1, x2, y2)
  
    // ✅ Thank you message
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Thank you for booking the order!", 20, 65);
  
    // ✅ Booking Details Heading
    doc.setFontSize(16);
    doc.setTextColor(0, 128, 0);
    doc.text("Booking Details:", 20, 80);
  
    // ✅ Booking Details Content
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`User Email      : ${userEmail}`, 20, 95);
    doc.text(`Worker Email    : ${workerEmail}`, 20, 105);
    doc.text(`Working Days    : ${workingDays}`, 20, 115);
    doc.text(`Working Hours   :${workingHours}`, 20, 125);
    doc.text(`Payment Amount  : LKR ${paymentAmount}`, 20, 135);
  
    // ✅ Footer
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Smart Waste Management - Green Harvest © 2025", 105, 290, { align: 'center' });
  
    doc.save("Payment_Invoice.pdf");
  };
  

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-gray-200 p-6">
      <div className="container p-6 rounded-lg shadow-lg bg-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Image */}
          <div className="flex justify-center items-center">
            <img src="src/assets/creditcard.png" alt="Payment" className="max-w-full rounded-lg" />
          </div>

          {/* Right Form */}
          <div className="p-6">
            <h2 className="text-center text-3xl font-bold text-green-400 mb-6">Complete Your Payment</h2>

            <form onSubmit={handlePayment} className="bg-gray-700 p-6 rounded-lg">
              <div className="text-lg font-semibold text-green-400 mb-4">
                Amount to Pay: Rs. {paymentAmount}
              </div>

              <input type="text" name="cardHolder" value={paymentDetails.cardHolder} onChange={handleInputChange}
                placeholder="Card Holder Name" required
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-gray-200 mb-4" />

              <input type="text" name="cardNumber" value={paymentDetails.cardNumber} onChange={handleInputChange} maxLength="16"
                placeholder="Card Number" required
                className={`w-full p-3 border ${errors.cardNumber ? 'border-red-500' : 'border-gray-600'} rounded-lg bg-gray-800 text-gray-200 mb-4`} />
              {errors.cardNumber && <p className="text-red-500 text-xs mb-2">{errors.cardNumber}</p>}

              <div className="grid grid-cols-2 gap-4 mb-4">
                <input type="month" name="expiryDate" value={paymentDetails.expiryDate} onChange={handleInputChange}
                  placeholder="Expiry Date" required
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-gray-200" />

                <input type="password" name="cvv" value={paymentDetails.cvv} onChange={handleInputChange} maxLength="3"
                  placeholder="CVV" required
                  className="w-full p-3 border border-gray-600 rounded-lg bg-gray-800 text-gray-200" />
              </div>

              <button type="submit"
                className="w-full py-3 mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg">
                Pay Now
              </button>

              <button type="button" onClick={() => navigate(-1)}
                className="w-full py-3 mt-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg">
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* OTP Popup */}
      {showOtpPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full text-gray-200">
            <h2 className="text-xl text-green-400 font-bold text-center mb-4">Enter OTP</h2>

            <p className="text-center text-sm text-gray-400 mb-2">Time Remaining: {timer} sec</p>

            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP"
              className="w-full p-3 mb-4 border border-gray-600 rounded-lg bg-gray-900 text-gray-200" />

            <div className="flex justify-between">
              <button className="bg-green-600 px-4 py-2 rounded" onClick={verifyOtpAndPay}>Confirm</button>
              <button className="bg-red-600 px-4 py-2 rounded" onClick={() => setShowOtpPopup(false)}>Cancel</button>
            </div>

            {timer <= 0 && (
              <button className="w-full mt-4 bg-blue-600 py-2 rounded" onClick={resendOtp}>
                Resend OTP
              </button>
            )}
          </div>
        </div>
      )}


            {/* Download Invoice Popup */}
            {showDownloadPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full text-gray-200 text-center">
            <h2 className="text-xl text-green-400 font-bold mb-4">Download Payment Invoice</h2>

            <p className="mb-6">Do you want to download your payment invoice?</p>

            <div className="flex justify-around">
              <button
                className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
                onClick={() => {
                  generatePDF();
                  navigate("/view-workers");
                }}
              >
                Download
              </button>

              <button
                className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
                onClick={() => navigate("/view-workers")}
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Transaction;













