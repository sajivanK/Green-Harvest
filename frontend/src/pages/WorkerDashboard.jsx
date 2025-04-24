import React from "react";
import { Briefcase, Clock, CheckCircle, DollarSign } from "lucide-react";
import StatCard from "../Components/common/WorkerStatCard"; // Ensure correct import

const WorkerDashboard = () => {
  // Mock Task Data
  const taskStats = [
    { name: "Total Tasks", value: 25, icon: Briefcase, color: "#6366F1" },
    { name: "In Progress", value: 8, icon: Clock, color: "#F59E0B" },
    { name: "Completed", value: 17, icon: CheckCircle, color: "#10B981" },
    { name: "Earnings", value: "$1,250", icon: DollarSign, color: "#EC4899" },
  ];

  return (
    <div className="relative flex-1 overflow-auto z-10 p-6 min-h-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center brightness-50"
        style={{
          backgroundImage: "url('/cleaning-city02.jpg')", // Ensure the image exists in `public/`
        }}
      ></div>

      {/* Main Content */}
      <div className="relative z-10">
        <h1 className="text-4xl font-bold text-white">Worker Dashboard</h1>
        <p className="mt-2 text-gray-300 text-lg">
          Track your tasks, progress, and earnings.
        </p>

        {/* STATISTICS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {taskStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* ADDITIONAL CONTENT */}
        <div className="mt-10">
          <div className="bg-gray-900 bg-opacity-80 p-6 rounded-lg shadow-lg border border-gray-700 backdrop-blur-md">
            <h2 className="text-2xl font-bold text-white">Welcome Back!</h2>
            <p className="text-gray-300 mt-2">
              Stay updated with your daily progress and earnings. Your hard work keeps the system running smoothly!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;