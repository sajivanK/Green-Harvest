
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import axiosApi from "../../config/axiosConfig"; 
import { toast } from "react-toastify";

const COLORS = ["#00C49F", "#FFBB28", "#0088FE", "#FF8042"]; // Paid, Pending, Shipped, Delivered colors

const OrderDistribution = () => {
  const [orderStatusData, setOrderStatusData] = useState([]);

  useEffect(() => {
    const fetchOrderStatusData = async () => {
      try {
        const response = await axiosApi.get("/api/orders/status-distribution", {
          withCredentials: true,
        });
        if (response.data.success) {
          const counts = response.data.statusCounts;
          const formattedData = [
            { name: "Paid", value: counts.Paid || 0 },
            { name: "Pending", value: counts.Pending || 0 },
            { name: "Shipped", value: counts.Shipped || 0 },
            { name: "Deliverd", value: counts.Deliverd || 0 },
          ];
          setOrderStatusData(formattedData);
        }
      } catch (error) {
        console.error("Failed to fetch order status data:", error);
        toast.error("Failed to load order distribution.");
      }
    };

    fetchOrderStatusData();
  }, []);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-gray-100 mb-4">Order Status Distribution</h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={orderStatusData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {orderStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default OrderDistribution;
