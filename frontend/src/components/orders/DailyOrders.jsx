
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axiosApi from "../../config/axiosConfig"; 
import { toast } from "react-toastify";

const DailyOrders = () => {
  const [dailyOrdersData, setDailyOrdersData] = useState([]);

  useEffect(() => {
    const fetchDailyOrders = async () => {
      try {
        const response = await axiosApi.get("/api/orders/daily-orders", {
          withCredentials: true,
        });
        if (response.data.success) {
          setDailyOrdersData(response.data.dailyOrders);
        }
      } catch (error) {
        console.error("Failed to fetch daily orders:", error);
        toast.error("Failed to load daily orders.");
      }
    };

    fetchDailyOrders();
  }, []);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-xl font-semibold text-gray-100 mb-4">Daily Orders</h2>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={dailyOrdersData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="_id" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend />
            <Line type="monotone" dataKey="orders" stroke="#8B5CF6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default DailyOrders;
