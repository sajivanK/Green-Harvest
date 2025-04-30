// React component for DeliveryInfoPage — enhanced popup with delivery info and product image

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosApi from "../config/axiosConfig";
import Swal from 'sweetalert2';
import { useEffect } from "react";


const DeliveryInfoPage = () => {
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", address: "", phone: "" });
  const [payment, setPayment] = useState({ cardName: "", cardNumber: "", expiry: "", cvv: "" });
  const [errors, setErrors] = useState({});
  const [orderIds, setOrderIds] = useState([]);
  const [showSummary, setShowSummary] = useState(state?.showSummary || false);

  const deliveryFee = 100;
  const items = state?.items || [];
  const cartTotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const grandTotal = cartTotal + deliveryFee;

  useEffect(() => {
    if (state?.triggerSummary) {
      createOrderAndShowSummary();
    }
  }, [state?.triggerSummary]);
  
  const createOrderAndShowSummary = async () => {
    setLoading(true);
    try {
      const res = await axiosApi.post("/api/paymentOrder/createOrder", {
        items,
        deliveryInfo: form
      }, { withCredentials: true });
  
      if (res.status === 200) {
        setOrderIds(res.data.orders.map(order => order._id));
        setShowSummary(true);
      } else {
        Swal.fire("Error", "Could not create order.", "error");
      }
    } catch (err) {
      console.error("Auto order create error:", err);
      Swal.fire("Error", "Something went wrong.", "error");
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handlePaymentChange = (e) => {
    let { name, value } = e.target;
    if (name === "cardNumber") value = value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
    if (name === "expiry") {
      const cleaned = value.replace(/[^0-9]/g, "");
      value = cleaned.length <= 2 ? cleaned : cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
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
      const res = await axiosApi.post("/api/paymentOrder/createOrder", {
        items,
        deliveryInfo: form
      }, { withCredentials: true });

      if (res.status === 200) {
        setOrderIds(res.data.orders.map(order => order._id));
        setShowSummary(true);
      } else {
        alert("There was an issue creating the order.");
      }
    } catch (err) {
      console.error("Create Order Error:", err);
      alert("Something went wrong while creating the order.");
    }
  };

  const handleEdit = () => {
    // Attach _id to the item so that OrderEditPage can use it as orderId
    const editableItems = items.map((item, index) => ({
      ...item,
      _id: orderIds[index], // ✅ map orderIds to the items
    }));
  
    navigate("/edit", {
      state: {
        items: editableItems,
        deliveryInfo: form,
      }
    });
  };
  
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    });
  
    if (result.isConfirmed) {
      try {
        for (const id of orderIds) {
          await axiosApi.delete(`/api/paymentOrder/deleteOrder/${id}`, { withCredentials: true });
        }
        Swal.fire("Deleted!", "Your order has been removed.", "success");
        navigate("/");
      } catch (err) {
        console.error("Delete failed", err);
        Swal.fire("Error!", "Could not delete order.", "error");
      }
    }
  };
  

  const handleConfirm = async () => {
    const result = await Swal.fire({
      title: "Confirm Order?",
      text: "Do you want to place this order now?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, confirm it!"
    });
  
    if (result.isConfirmed) {
      try {
        const res = await axiosApi.post("/api/paymentOrder/confirmOrder", { orderIds }, { withCredentials: true });
  
        if (res.data.success) {
          await Swal.fire("Success!", "Your order has been confirmed.", "success");
          navigate("/");
        } else {
          Swal.fire("Failed", "Order confirmation failed.", "error");
        }
      } catch (err) {
        console.error("Confirm failed", err);
        Swal.fire("Error", "Something went wrong while confirming your order.", "error");
      }
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
      {showSummary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-xl w-full">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="mb-4">
              <h3 className="font-semibold text-sm mb-1">Delivery Info:</h3>
              <p className="text-sm">{form.firstName} {form.lastName}</p>
              <p className="text-sm">📧 {form.email}</p>
              <p className="text-sm">📦 {form.address}</p>
              <p className="text-sm">📞 {form.phone}</p>
            </div>
            <ul className="text-sm mb-4 space-y-2 max-h-52 overflow-y-auto">
              {items.map((item, index) => (
                <li key={index} className="flex items-center gap-3 border-b pb-2">
                  <div className="flex-1">
                    <p>{item.productName || item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity} × Rs.{item.price}</p>
                  </div>
                  <p className="text-sm font-semibold">Rs.{item.quantity * item.price}</p>
                </li>
              ))}
            </ul>
            <ul className="text-sm mb-4 space-y-1">
              <li className="flex justify-between">
                <span>Delivery Fee:</span>
                <span>Rs.{deliveryFee}</span>
              </li>
              <li className="flex justify-between font-bold text-red-600 border-t pt-2">
                <span>Total:</span>
                <span>Rs.{grandTotal}</span>
              </li>
            </ul>
            <div className="flex justify-between mt-4">
              <button onClick={handleEdit} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded">Edit</button>
              <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Delete</button>
              <button onClick={handleConfirm} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryInfoPage;




