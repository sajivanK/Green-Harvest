
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosApi from "../config/axiosConfig";

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phone: "",
  });

  const [payment, setPayment] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({});
  const deliveryFee = 100;

  // Check if state.items is defined and has products
  const items = state?.items || [];
  const cartTotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const grandTotal = cartTotal + deliveryFee;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const formatCardNumber = (value) => {
    return value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (value) => {
    const cleaned = value.replace(/[^0-9]/g, "");
    if (cleaned.length <= 2) return cleaned;
    return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
  };

  const handlePaymentChange = (e) => {
    let { name, value } = e.target;

    if (name === "cardNumber") {
      value = formatCardNumber(value);
    } else if (name === "expiry") {
      value = formatExpiry(value);
    }

    setPayment({ ...payment, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Invalid email";

    if (!form.address.trim()) newErrors.address = "Delivery address is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^(\+94|0)?7\d{8}$/.test(form.phone)) newErrors.phone = "Invalid Sri Lankan phone number";

    if (!payment.cardName.trim() || payment.cardName.length < 3) newErrors.cardName = "Cardholder name is required";
    if (!/^\d{4} \d{4} \d{4} \d{4}$/.test(payment.cardNumber)) newErrors.cardNumber = "Card number must be 16 digits";
    if (!/^(0[1-9]|1[0-2])\/(\d{2})$/.test(payment.expiry)) newErrors.expiry = "Expiry must be in MM/YY format";
    if (!/^[0-9]{3}$/.test(payment.cvv)) newErrors.cvv = "CVV must be 3 digits";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaymentSubmit = async () => {
    if (!validateForm()) return;

    try {
      const res = await axiosApi.post(
        "/api/payment/checkout",
        {
          items,
          deliveryInfo: form,
        },
        { withCredentials: true }
      );

      // const url = state?.from === "buyNow"
      //   ? "/api/payment/checkout"  // for single payment
      //   : "/api/checkout/cart";    // for cart payment

      // const res = await axiosApi.post(
      //   url,
      //   {
      //     items,
      //     deliveryInfo: form,
      //   },
      //   { withCredentials: true }
      // );


      if (res.status === 200) {
        alert("Payment successful! Order placed.");
        navigate("/");
      } else {
        alert("There was an issue with the payment.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed! Please try again.");
    }
  };

  return (
    <div className="w-full bg-gray-900 text-gray-500 min-h-screen flex justify-center items-center py-10 px-4">
      <div className="w-full max-w-7xl bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row gap-10">
        {/* LEFT SIDE - Delivery Info + Summary */}
        <div className="flex-1 space-y-6">
          <h2 className="text-xl font-bold">Delivery Information</h2>

          <div className="space-y-4 max-w-md">
            {Object.entries(form).map(([field, value]) => (
              <div key={field}>
                <input
                  name={field}
                  value={value}
                  onChange={handleChange}
                  placeholder={
                    field === "firstName"
                      ? "First name"
                      : field === "lastName"
                      ? "Last name"
                      : field === "email"
                      ? "Email address"
                      : field === "address"
                      ? "Delivery address"
                      : "Phone number"
                  }
                  className={`w-full border rounded p-2 outline-none placeholder:text-gray-400 ${
                    errors[field] ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-green-600 focus:ring-green-600"
                  }`}
                />
                {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="pt-4 max-w-md">
            <div className="border-t pt-4 space-y-2 text-sm text-gray-800">
              <div className="flex justify-between">
                <span>Cart Total</span>
                <span>Rs.{cartTotal.toFixed(2)}</span>
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

        {/* RIGHT SIDE - Payment */}
        <div className="flex-1 space-y-4 max-w-md">
          <h2 className="text-xl font-bold">Payment Details</h2>
          <div>
            <input
              name="cardName"
              value={payment.cardName}
              onChange={handlePaymentChange}
              placeholder="Cardholder Name"
              className={`w-full border rounded p-2 outline-none placeholder:text-gray-400 ${
                errors.cardName ? "border-red-500" : "border-gray-300 focus:border-green-600 focus:ring-green-600"
              }`}
            />
            {errors.cardName && <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>}
          </div>
          <div>
            <input
              name="cardNumber"
              value={payment.cardNumber}
              onChange={handlePaymentChange}
              placeholder="Card Number"
              className={`w-full border rounded p-2 outline-none placeholder:text-gray-400 ${
                errors.cardNumber ? "border-red-500" : "border-gray-300 focus:border-green-600 focus:ring-green-600"
              }`}
            />
            {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
          </div>
          <div className="flex gap-2">
            <div className="w-1/2">
              <input
                name="expiry"
                value={payment.expiry}
                onChange={handlePaymentChange}
                placeholder="MM/YY"
                className={`w-full border rounded p-2 outline-none placeholder:text-gray-400 ${
                  errors.expiry ? "border-red-500" : "border-gray-300 focus:border-green-600 focus:ring-green-600"
                }`}
              />
              {errors.expiry && <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>}
            </div>
            <div className="w-1/2">
              <input
                name="cvv"
                value={payment.cvv}
                onChange={handlePaymentChange}
                placeholder="CVV"
                type="password"
                maxLength={3}
                className={`w-full border rounded p-2 outline-none placeholder:text-gray-400 ${
                  errors.cvv ? "border-red-500" : "border-gray-300 focus:border-green-600 focus:ring-green-600"
                }`}
              />
              {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
            </div>
          </div>
          <button
            onClick={handlePaymentSubmit}
            className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
          >
            Proceed Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;




