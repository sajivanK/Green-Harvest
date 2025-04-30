
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axiosApi from "../config/axiosConfig";

const OrderEditPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = useState(state?.deliveryInfo || {
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phone: ""
  });

  const [items, setItems] = useState(state?.items || []);
  const [orderIds, setOrderIds] = useState([]);
  const [showSummary, setShowSummary] = useState(false);

  const deliveryFee = 100;
  const cartTotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const grandTotal = cartTotal + deliveryFee;

  useEffect(() => {
    console.log("🧾 Items loaded:", items); // Confirm each item has _id
  }, [items]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleQuantityChange = (index, value) => {
    const updatedItems = [...items];
    updatedItems[index].quantity = Math.max(1, parseInt(value));
    setItems(updatedItems);
  };

  const handleSubmit = async () => {
    try {
      const res = await axiosApi.put(
        "/api/paymentOrder/editOrder",
        {
          item: {
            orderId: items[0]._id, // ✅ now sending just one
            productId: items[0].productId,
            farmerId: items[0].farmerId,
            quantity: items[0].quantity,
            price: items[0].price
          },
          deliveryInfo: form
        },
        { withCredentials: true }
      );
  
      if (res.status === 200) {
        await Swal.fire({
          title: "Changes Saved!",
          text: "Your order has been updated.",
          icon: "success",
          confirmButtonText: "Show Summary"
        });
  
        setOrderIds([res.data.orders[0]._id]);
        setShowSummary(true);
      } else {
        Swal.fire("Error", "Failed to save order.", "error");
      }
    } catch (err) {
      console.error("Edit Order Error:", err);
      Swal.fire("Error", "Something went wrong.", "error");
    }
  };
  

  return (
    <div className="w-full bg-gray-900 text-gray-500 min-h-screen flex justify-center items-center py-10 px-4">
      <div className="w-full max-w-7xl bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row gap-10">
        {/* LEFT SIDE */}
        <div className="flex-1 space-y-6">
          <h2 className="text-xl font-bold">Edit Delivery Information</h2>
          <div className="space-y-4 max-w-md">
            {Object.entries(form).map(([field, value]) => (
              <div key={field}>
                <input
                  name={field}
                  value={value}
                  onChange={handleChange}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className="w-full border rounded p-2 outline-none placeholder:text-gray-400"
                />
              </div>
            ))}
          </div>

          <div className="pt-6">
            <h3 className="text-md font-semibold mb-2">Update Quantities</h3>
            <ul className="space-y-2">
              {items.map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <p className="w-40">{item.productName || item.name}</p>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                    className="w-20 border rounded p-1"
                  />
                  <span>× Rs.{item.price}</span>
                </li>
              ))}
            </ul>
          </div>

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
              <div className="flex justify-between font-bold border-t pt-2 mt-2 text-red-600">
                <span>Total</span>
                <span>Rs.{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 space-y-6 max-w-md">
          <h2 className="text-xl font-bold">Review & Save</h2>
          <p className="text-sm text-gray-600">Review your changes and confirm when ready.</p>
          <button
            onClick={handleSubmit}
            className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
          >
            Save & Continue
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-gray-200 text-gray-800 py-3 rounded hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* SUMMARY POPUP */}
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
              <button onClick={() => setShowSummary(false)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded">Edit</button>
              <button
                onClick={async () => {
                  const result = await Swal.fire({
                    title: "Cancel Order?",
                    text: "Are you sure you want to delete this order?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#d33",
                    cancelButtonColor: "#3085d6",
                    confirmButtonText: "Yes, delete it!"
                  });
                  if (result.isConfirmed) {
                    for (const id of orderIds) {
                      await axiosApi.delete(`/api/paymentOrder/deleteOrder/${id}`, { withCredentials: true });
                    }
                    Swal.fire("Deleted!", "Your order has been cancelled.", "success");
                    navigate("/");
                  }
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
              <button
                onClick={async () => {
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
                    const res = await axiosApi.post("/api/paymentOrder/confirmOrder", { orderIds }, { withCredentials: true });
                    if (res.data.success) {
                      Swal.fire("Success!", "Your order is confirmed.", "success");
                      navigate("/");
                    } else {
                      Swal.fire("Failed", "Order confirmation failed.", "error");
                    }
                  }
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderEditPage;
