import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Billing = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { orderId, workerEmail, userEmail } = location.state || {}; // ✅ Get from location
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (orderId) {
      axios
        .get(`http://localhost:4000/api/detail/${orderId}`)
        .then((response) => {
          setOrder({
            ...response.data.data,
            id: orderId,
            workerEmail: workerEmail || "",
            userEmail: userEmail || "",
          });
        })
        .catch((err) => {
          setError("Error fetching order details.");
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError("Order ID not provided.");
      setLoading(false);
    }
  }, [orderId, workerEmail, userEmail]);

  const payment = order ? 500 * order.days * order.hours : 0;

  const handlePayment = () => {
    navigate("/transaction", {
      state: {
        paymentAmount: payment,
        orderId: order?.id,
        workerEmail: order?.workerEmail,
        userEmail: order?.userEmail, // ✅ Pass it here too
      },
    });
  };

  const handleChangeRequirements = () => {
    navigate("/add-detail", {
      state: { order },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-200">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-200">
      <div className="flex flex-col md:flex-row justify-center items-stretch container mx-auto p-8 gap-8 flex-grow">

        {/* Left Image */}
        <div className="w-full md:w-1/2 bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
          <img
            src="/src/assets/billing.jpg"
            alt="Billing"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Summary */}
        <div className="w-full md:w-1/2 bg-gray-800 rounded-lg p-8 flex flex-col justify-center">
          <h2 className="text-center text-3xl font-semibold text-green-400 mb-6">
            Billing Summary
          </h2>

          {error ? (
            <div className="bg-yellow-100 text-yellow-900 p-4 rounded-lg shadow-sm mb-4 text-center">
              <p>{error}</p>
            </div>
          ) : (
            <>
              <p className="text-lg mb-4">
                <strong>Working Days:</strong> {order.days} Day(s)
              </p>
              <p className="text-lg mb-4">
                <strong>Hours per Day:</strong> {order.hours} Hour(s)
              </p>
              <p className="text-lg mb-4">
                <strong>Total Payment:</strong> Rs. {payment}
              </p>
              {order.workerEmail && (
                <p className="text-sm mt-3 text-gray-400 italic">
                  Assigned Worker: {order.workerEmail}
                </p>
              )}

              <div className="flex flex-col gap-4 mt-6">
                <button
                  onClick={handlePayment}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition w-full"
                >
                  Pay Now
                </button>
                <button
                  onClick={handleChangeRequirements}
                  className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md transition w-full"
                >
                  Change the Requirements
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <footer className="bg-gray-800 text-gray-400 py-4 mt-auto">
        <div className="text-center">
          <p>© 2025 GreenHarvest. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Billing;
