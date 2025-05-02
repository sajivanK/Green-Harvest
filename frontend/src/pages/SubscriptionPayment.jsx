
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosApi from "../config/axiosConfig";

const SubscriptionPayment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const selectedPackage = state?.selectedPackage;

  const [deliveryInfo, setDeliveryInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phone: "",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({});
  
  const deliveryFee = 100; // ✅ Add Delivery Fee Rs.100
  const grandTotal = selectedPackage ? selectedPackage.price + deliveryFee : 0; // ✅ Grand total calculation

  if (!selectedPackage) {
    return (
      <div className="text-center text-red-500 mt-10">
        No package selected! Please go back to Packages page.
      </div>
    );
  }

  const formatCardNumber = (value) => value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (value) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 2) return cleaned;
    return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
  };

  const validateExpiryDate = (expiry) => {
    const [month, year] = expiry.split("/").map(Number);
    if (!month || !year || month < 1 || month > 12) return false;

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear() % 100;

    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;

    return true;
  };

  const handleDeliveryChange = (e) => {
    setDeliveryInfo({ ...deliveryInfo, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handlePaymentChange = (e) => {
    let { name, value } = e.target;
    if (name === "cardNumber") value = formatCardNumber(value);
    if (name === "expiry") value = formatExpiry(value);

    setPaymentInfo({ ...paymentInfo, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};

    // Delivery Info Validation
    if (!deliveryInfo.firstName.trim()) newErrors.firstName = "First name is required.";
    if (!deliveryInfo.lastName.trim()) newErrors.lastName = "Last name is required.";
    if (!deliveryInfo.email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(deliveryInfo.email)) newErrors.email = "Invalid email address.";
    if (!deliveryInfo.address.trim()) newErrors.address = "Address is required.";
    if (!/^(\+94|0)?7\d{8}$/.test(deliveryInfo.phone)) newErrors.phone = "Invalid Sri Lankan phone number.";

    // Payment Info Validation
    if (!paymentInfo.cardName.trim()) newErrors.cardName = "Cardholder name is required.";
    if (!/^\d{4} \d{4} \d{4} \d{4}$/.test(paymentInfo.cardNumber)) newErrors.cardNumber = "Card number must be 16 digits.";
    if (!/^(0[1-9]|1[0-2])\/(\d{2})$/.test(paymentInfo.expiry)) newErrors.expiry = "Expiry must be MM/YY format.";
    else if (!validateExpiryDate(paymentInfo.expiry)) newErrors.expiry = "Card expiry cannot be in the past.";
    if (!/^\d{3}$/.test(paymentInfo.cvv)) newErrors.cvv = "CVV must be 3 digits.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaymentSubmit = async () => {
    if (!validateForm()) return;

    try {
      const res = await axiosApi.post(
        "/api/subscription/subscribe",
        {
          packageId: selectedPackage._id,
          deliveryInfo,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        alert("🎉 Subscription successful! Confirmation email sent.");
        navigate("/");
      } else {
        alert("There was an issue subscribing. Please try again.");
      }
    } catch (err) {
      console.error("❌ Subscription error:", err);
      alert("Payment failed. Please try again later.");
    }
  };

  return (
    <div className="w-full bg-gray-900 text-gray-200 min-h-screen flex justify-center items-center py-10 px-4">
      <div className="w-full max-w-6xl bg-white text-black rounded-xl shadow-lg p-8 flex flex-col md:flex-row gap-10">
        
        {/* LEFT SIDE: Delivery Info */}
        <div className="flex-1 space-y-6">
          <h2 className="text-xl font-bold">Delivery Information</h2>

          <div className="space-y-4 max-w-md">
            {Object.entries(deliveryInfo).map(([field, value]) => (
              <div key={field}>
                <input
                  name={field}
                  value={value}
                  onChange={handleDeliveryChange}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className={`w-full border rounded p-2 ${
                    errors[field] ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
              </div>
            ))}
          </div>

          {/* Package Summary with Delivery Fee */}
          <div className="pt-4 max-w-md">
            <div className="border-t pt-4 space-y-2 text-sm text-gray-800">
              <div className="flex justify-between">
                <span>Package Price</span>
                <span>Rs.{selectedPackage.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>Rs.{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-2 mt-2">
                <span>Total</span>
                <span>Rs.{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Payment Info */}
        <div className="flex-1 space-y-6">
          <h2 className="text-xl font-bold">Payment Details</h2>

          <input
            name="cardName"
            value={paymentInfo.cardName}
            onChange={handlePaymentChange}
            placeholder="Cardholder Name"
            className={`w-full border rounded p-2 ${
              errors.cardName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.cardName && <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>}

          <input
            name="cardNumber"
            value={paymentInfo.cardNumber}
            onChange={handlePaymentChange}
            placeholder="Card Number"
            className={`w-full border rounded p-2 ${
              errors.cardNumber ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}

          <div className="flex gap-2">
            <input
              name="expiry"
              value={paymentInfo.expiry}
              onChange={handlePaymentChange}
              placeholder="MM/YY"
              className={`w-1/2 border rounded p-2 ${
                errors.expiry ? "border-red-500" : "border-gray-300"
              }`}
            />
            <input
              name="cvv"
              value={paymentInfo.cvv}
              onChange={handlePaymentChange}
              placeholder="CVV"
              type="password"
              maxLength={3}
              className={`w-1/2 border rounded p-2 ${
                errors.cvv ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>

          <button
            onClick={handlePaymentSubmit}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold"
          >
            Subscribe Now
          </button>
        </div>

      </div>
    </div>
  );
};

export default SubscriptionPayment;
