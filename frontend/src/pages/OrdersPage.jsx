// import { CheckCircle, Clock, DollarSign, ShoppingBag } from "lucide-react";
// import { motion } from "framer-motion";

// import Header from "../components/common/Header";
// import StatCard from "../components/common/StatCard";
// import DailyOrders from "../components/orders/DailyOrders";
// import OrderDistribution from "../components/orders/OrderDistribution";
// import OrdersTable from "../components/orders/OrdersTable";

// const orderStats = {
// 	totalOrders: "1,234",
// 	pendingOrders: "56",
// 	completedOrders: "1,178",
// 	totalRevenue: "LKR 98,765",
// };

// const OrdersPage = () => {
// 	return (
// 		<div className='flex-1 relative z-10 overflow-auto'>
// 			<Header title={"Orders"} />

// 			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
// 				<motion.div
// 					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
// 					initial={{ opacity: 0, y: 20 }}
// 					animate={{ opacity: 1, y: 0 }}
// 					transition={{ duration: 1 }}
// 				>
// 					<StatCard name='Total Orders' icon={ShoppingBag} value={orderStats.totalOrders} color='#6366F1' />
// 					<StatCard name='Pending Orders' icon={Clock} value={orderStats.pendingOrders} color='#F59E0B' />
// 					<StatCard
// 						name='Completed Orders'
// 						icon={CheckCircle}
// 						value={orderStats.completedOrders}
// 						color='#10B981'
// 					/>
// 					<StatCard name='Total Revenue' icon={DollarSign} value={orderStats.totalRevenue} color='#EF4444' />
// 				</motion.div>

// 				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
// 					<DailyOrders />
// 					<OrderDistribution />
// 				</div>

// 				<OrdersTable />
// 			</main>
// 		</div>
// 	);
// };
// export default OrdersPage;
import { useEffect, useState } from "react";
import { CheckCircle, Clock, DollarSign, ShoppingBag, Truck } from "lucide-react"; // Added Truck icon for shipped
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import DailyOrders from "../components/orders/DailyOrders";
import OrderDistribution from "../components/orders/OrderDistribution";
import OrdersTable from "../components/orders/OrdersTable";

import axiosApi from "../config/axiosConfig";
import { toast } from "react-toastify";

const OrdersPage = () => {
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    paidOrders: 0,
    pendingOrders: 0,
    shippedOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchOrderStats = async () => {
      try {
        const response = await axiosApi.get("/api/orders/stats", {
          withCredentials: true,
        });
        if (response.data.success) {
          setOrderStats(response.data.stats);
        }
      } catch (error) {
        console.error("Failed to fetch order stats:", error);
        toast.error("Failed to load order stats.");
      }
    };

    fetchOrderStats();
  }, []);

  return (
    <div className="flex-1 relative z-10 overflow-auto">
      <Header title={"Orders"} />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard name="Total Orders" icon={ShoppingBag} value={orderStats.totalOrders} color="#6366F1" />
          <StatCard name="Paid Orders" icon={DollarSign} value={orderStats.paidOrders} color="#34D399" />
          <StatCard name="Pending Orders" icon={Clock} value={orderStats.pendingOrders} color="#F59E0B" />
          <StatCard name="Shipped Orders" icon={Truck} value={orderStats.shippedOrders} color="#3B82F6" />
          <StatCard name="Completed Orders" icon={CheckCircle} value={orderStats.completedOrders} color="#10B981" />
          <StatCard name="Total Revenue" icon={DollarSign} value={`LKR ${orderStats.totalRevenue.toLocaleString()}`} color="#EF4444" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <DailyOrders />
          <OrderDistribution />
        </div>

        <OrdersTable />
      </main>
    </div>
  );
};

export default OrdersPage;
