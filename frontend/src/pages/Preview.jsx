import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";

const Preview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [order, setOrder] = useState(location.state?.order || {});
  const orderId = order?.id || order?._id || id;
  const workerEmail = order?.workerEmail || "";
  const userEmail = order.userEmail || "";

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/detail/${orderId}`);
        setOrder(prev => ({
          ...response.data.data,
          workerEmail: prev.workerEmail || ""
        }));
      } catch (error) {
        console.error("Fetch Error:", error);
        alert("Failed to fetch order data");
        navigate("/");
      }
    };

    if (orderId && !order._id) {
      fetchOrderData();
    }
  }, [orderId, order._id, navigate]);

  if (!order) {
    return (
      <div className="text-center text-white bg-gray-900 min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:4000/api/detail/delete/${orderId}`);
      alert("Order deleted successfully!");
      navigate("/view-workers");
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Failed to delete order");
    }
  };

  const handleEdit = () => {
    navigate("/add-detail", { state: { order } });
  };
  const handleNext = () => {
    navigate("/billing", 
        { state: { orderId, workerEmail ,userEmail} }); // ✅ Correct! Pass both
  };
  

  return (
    <div className="container mx-auto bg-gray-900 text-gray-200 min-h-screen p-6">
      <div className="card shadow-lg p-6 bg-gray-800 mt-6 rounded-lg">
        <h2 className="text-center mb-6 text-green-400 text-2xl font-bold">
          Preview of your Order
        </h2>

        <div>
          <p className="mb-4"><span className="font-semibold">Email:</span> {order.email || "Not provided"}</p>
          <p className="mb-4"><span className="font-semibold">Location:</span> {order.location || "Not provided"}</p>
          <p className="mb-4"><span className="font-semibold">District:</span> {order.workDistrict || "Not provided"}</p>
          <p className="mb-4"><span className="font-semibold">Deadline:</span> {order.expectedDateToFinish?.split('T')[0] || "Not provided"}</p>
          <p className="mb-4"><span className="font-semibold">Days:</span> {order.days || "Not provided"}</p>
          <p className="mb-4"><span className="font-semibold">Hours per Day:</span> {order.hours || "Not provided"}</p>
          <p className="mb-4"><span className="font-semibold">Additional Info:</span> {order.additionalInformation || "None provided"}</p>

          {order.image && (
            <div className="flex flex-col items-center my-4">
              <h5 className="text-xl font-semibold mb-2">Uploaded Image</h5>
              <img
                src={`http://localhost:4000${order.image}`}
                alt="Messy Area"
                className="w-48 h-48 object-cover rounded-xl shadow-md"
              />
            </div>
          )}
        </div>

        <div className="flex justify-between mt-6">
          <div>
            <button
              className="bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700"
              onClick={handleEdit}
            >
              Edit
            </button>

            <button
              className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 ml-4"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>

          <button
            className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600"
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Preview;
