import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosApi from "../config/axiosConfig";
import Swal from "sweetalert2";

const OrderSummary = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { orderId } = state || {}; // Getting orderId passed from the previous page

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axiosApi.get(`/api/temporaryOrder/order/${orderId}`);
        if (response.data.success) {
          setOrderData(response.data.order);
        } else {
          setError("Order not found");
        }
      } catch (err) {
        setError("Error fetching order details");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const handleEdit = () => {
    navigate("/edit", {
      state: {
        orderData,
      },
    });
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure you want to cancel this order?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep it",
    });

    if (result.isConfirmed) {
      await Swal.fire({
        title: "Cancelled!",
        text: "Your order has been successfully cancelled.",
        icon: "success",
        confirmButtonColor: "#22c55e",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/");
    }
  };

  const handleConfirmOrder = async () => {
    const result = await Swal.fire({
      title: "Choose Payment Method",
      text: "How would you like to pay?",
      icon: "question",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Cash on Delivery",
      denyButtonText: "Card Payment",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await Swal.fire({
        title: "Order Placed Successfully!",
        text: "You chose Cash on Delivery.",
        icon: "success",
        confirmButtonColor: "#22c55e",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/");
    } else if (result.isDenied) {
      navigate("/orderpayment", {
        state: {
          orderData,
        },
      });
    }
    // If Cancel pressed, nothing happens
  };

  if (loading) return <p className="p-4 text-white">Loading order details...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8 flex justify-center items-start">
      <div className="w-full max-w-5xl bg-white text-gray-800 rounded-xl shadow-lg p-8 space-y-8">
        <h2 className="text-2xl font-bold text-center">Order Summary</h2>

        {/* Product Details */}
        {orderData?.items?.map((item, index) => (
          <div key={index} className="flex flex-col md:flex-row items-center gap-6">
            <img
              src={`http://localhost:4000/uploads/${item.image}`}
              alt={item.name}
              className="w-32 h-32 rounded object-cover shadow"
            />
            <div className="flex-1 space-y-2">
              <h3 className="text-xl font-semibold">{item.name}</h3>
              <p>Price: Rs. {item.price.toFixed(2)}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
          </div>
        ))}

        {/* Delivery Information */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Delivery Information</h3>
          <p>Name: {orderData?.deliveryDetails?.name}</p>
          <p>Email: {orderData?.deliveryDetails?.email}</p>
          <p>Phone: {orderData?.deliveryDetails?.phone}</p>
          <p>Address: {orderData?.deliveryDetails?.address}</p>
        </div>

        {/* Price Summary */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Cart Total</span>
            <span>Rs.{orderData?.totalAmount?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span>Rs. 100.00</span>
          </div>
          <div className="flex justify-between font-bold border-t pt-2 mt-2">
            <span>Total</span>
            <span className="text-red-600">Rs.{(orderData?.totalAmount + 100).toFixed(2)}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <button
            onClick={handleEdit}
            className="flex-1 py-3 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Delete
          </button>
          <button
            onClick={handleConfirmOrder}
            className="flex-1 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
