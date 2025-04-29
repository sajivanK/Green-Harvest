
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import axiosApi from "../../config/axiosConfig"; // ✅ Your API file

const UserGrowthChart = () => {
  const [userGrowthData, setUserGrowthData] = useState([]);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        const response = await axiosApi.get("/api/subscription/farmer-subscriptions", {
          withCredentials: true,
        });

        if (response.data.success) {
          const subscriptions = response.data.subscriptions;

          // ✅ Process into month-wise counts
          const monthlyCounts = {};

          subscriptions.forEach((sub) => {
            const date = new Date(sub.subscribedAt);
            const month = date.toLocaleString('default', { month: 'short' }); // Jan, Feb, etc.

            if (monthlyCounts[month]) {
              monthlyCounts[month]++;
            } else {
              monthlyCounts[month] = 1;
            }
          });

          // ✅ Format for Recharts
          const growthData = Object.keys(monthlyCounts).map((month) => ({
            month,
            users: monthlyCounts[month],
          }));

          // ✅ Sort by month order (Jan → Dec)
          const monthsOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const sortedGrowthData = monthsOrder
            .map((month) => growthData.find((m) => m.month === month))
            .filter(Boolean); // remove undefined months

          setUserGrowthData(sortedGrowthData);
        }
      } catch (error) {
        console.error("Failed to fetch subscriptions:", error);
      }
    };

    fetchSubscriptionData();
  }, []);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 lg:col-span-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-gray-100 mb-4">Subscriber Growth</h2>
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={userGrowthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default UserGrowthChart;
