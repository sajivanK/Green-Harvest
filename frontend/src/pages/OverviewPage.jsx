

import React, { useEffect, useState } from 'react';
import Header from '../components/common/Header';
import { motion } from "framer-motion";
import StatCard from '../components/common/StatCard';
import { BarChart2, ShoppingBag, Users, Zap } from 'lucide-react';
import SalesOverviewChart from '../components/overview/SalesOverviewChart';
import CategoryDistributionChart from '../components/overview/CategoryDistributionChart';
import SalesChannelChart from '../components/overview/SalesChannelChart';
import axiosApi from '../config/axiosConfig';

const OverviewPage = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosApi.get('/api/overview/farmer-stats', {
          withCredentials: true
        });

        if (res.data.success) {
          setStats(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch overview stats:', error);
      }
    };

    fetchStats();
  }, []);

  if (!stats) {
    return <div className="text-center py-10 text-white">Loading Overview...</div>;
  }

  return (
    <div className='flex-1 overflow-auto relative z-10'>
      <Header title="Overview" />

      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        {/* STATS */}
        <motion.div
          className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Sales"
            icon={Zap}
            value={`Rs.${stats.totalRevenue.toLocaleString()}`}
            color='#6366F1'
          />
          <StatCard
            name="New Users Today"
            icon={Users}
            value={stats.newUsersToday}
            color='#10B981'
          />
          <StatCard
            name="Total Products"
            icon={ShoppingBag}
            value={stats.totalProducts}
            color='#F59E0B'
          />
          <StatCard
            name="Conversion Rate"
            icon={BarChart2}
            value="-" // 🚫 optional: can calculate if you have visitor tracking
            color='#EF4444'
          />
        </motion.div>

        {/* CHARTS */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <SalesOverviewChart />
          <CategoryDistributionChart />
          <SalesChannelChart />
        </div>
      </main>
    </div>
  );
};

export default OverviewPage;
