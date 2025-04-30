import React from "react";
import { Briefcase, Clock, CheckCircle } from "lucide-react";
import StatCard from "../Components/common/WorkerStatCard";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Legend } from "recharts";
import { motion } from "framer-motion";

const COLORS = ["#10B981", "#F59E0B", "#EF4444"];

const WorkerDashboard = () => {
  const stats = {
    total: 25,
    approved: 17,
    pending: 5,
    rejected: 3,
  };

  const taskStats = [
    { name: "Total Proofs", value: stats.total, icon: Briefcase, color: "#6366F1" },
    { name: "Pending", value: stats.pending, icon: Clock, color: "#F59E0B" },
    { name: "Approved", value: stats.approved, icon: CheckCircle, color: "#10B981" },
  ];

  const pieData = [
    { name: "Approved", value: stats.approved },
    { name: "Pending", value: stats.pending },
    { name: "Rejected", value: stats.rejected },
  ];

  const barChartData = [
    { day: "Mon", tasks: 3 },
    { day: "Tue", tasks: 5 },
    { day: "Wed", tasks: 4 },
    { day: "Thu", tasks: 6 },
    { day: "Fri", tasks: 3 },
    { day: "Sat", tasks: 2 },
    { day: "Sun", tasks: 2 },
  ];

  const lineChartData = [
    { day: "Week 1", proofs: 5 },
    { day: "Week 2", proofs: 6 },
    { day: "Week 3", proofs: 8 },
    { day: "Week 4", proofs: 6 },
  ];

  return (
    <div className="relative flex-1 overflow-auto z-10 p-6 min-h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center brightness-50"
        style={{ backgroundImage: "url('/cleaning-city02.jpg')" }}
      ></div>

      <div className="relative z-10">
        <motion.h1 
          className="text-4xl font-bold text-white"
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
        >
          Worker Dashboard
        </motion.h1>
        <motion.p 
          className="mt-2 text-gray-300 text-lg"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.5 }}
        >
          Track your tasks, proofs and progress.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {taskStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Welcome Message Below Charts */}
        <motion.div 
          className="mt-10 bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-700"
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-bold text-white mb-2">Welcome Back, GreenHero! 🌿</h2>
          <p className="text-gray-300">
            You’ve been making a real difference by submitting your work on time.
            Let’s keep that momentum going! 🚀
          </p>
        </motion.div>

        {/* Charts Section - One Row */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Proof Status Overview</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Tasks Completed (This Week)</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="#ccc" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tasks" fill="#6366F1" barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Weekly Proof Trend</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="#ccc" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="proofs" stroke="#F59E0B" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default WorkerDashboard;
