
import React, { useEffect, useState } from 'react';
import Header from '../components/common/Header';
import StatCard from '../components/common/StatCard';
import { motion } from 'framer-motion';
import { UserCheck, UserPlus, UsersIcon, UserX } from 'lucide-react';
import UsersTable from '../components/users/UsersTable';
import UserGrowthChart from '../components/users/UserGrowthChart';
import axiosApi from '../config/axiosConfig'; // ✅ Import axios
import { toast } from 'react-toastify';

const UsersPage = () => {
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    newUsersToday: 0,
    activeUsers: 0,
    churnRate: "0%",
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosApi.get('/api/subscription/stats', { withCredentials: true });
        if (res.data.success) {
          setUserStats(res.data.stats);
        } else {
          toast.error("Failed to fetch user stats.");
        }
      } catch (error) {
        console.error("Failed to fetch user stats:", error);
        toast.error("Failed to load statistics.");
      }
    };

    fetchStats();
  }, []);

  return (
    <div className='flex-1 overflow-auto relative z-10'> 
      <Header title="Subscribers" />

      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        {/* STATS */}
        <motion.div
          className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name='Total Users'
            icon={UsersIcon}
            value={userStats.totalUsers.toLocaleString()}
            color='#6366F1'
          />
          <StatCard
            name='New Users Today'
            icon={UserPlus}
            value={userStats.newUsersToday.toLocaleString()}
            color='#10B981'
          />
          <StatCard
            name='Active Users'
            icon={UserCheck}
            value={userStats.activeUsers.toLocaleString()}
            color='#F59E0B'
          />
          <StatCard
            name='Churn Rate'
            icon={UserX}
            value={userStats.churnRate}
            color={parseFloat(userStats.churnRate) > 5 ? "#EF4444" : "#10B981"} // ✅ Auto color
          />
        </motion.div>

        {/* USERS TABLE */}
        <UsersTable />

        {/* USER CHARTS */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8'>
          <UserGrowthChart />
          {/* You can enable this later if needed */}
          {/* <UserDemographicsChart /> */}
        </div>
      </main>
    </div>
  );
};

export default UsersPage;

