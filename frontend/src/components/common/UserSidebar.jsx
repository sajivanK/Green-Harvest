
import React, { useState } from 'react';
import {
  BarChart2,
  CatIcon,
  Contact2Icon,
  DollarSign,
  HomeIcon,
  Menu,
  PackagePlus,
  Phone,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Square,
  SquareActivity,
  SquareCode,
  TrendingUp,
  User2Icon,
  Users,
  VariableIcon,
  LogOut
} from "lucide-react";
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import axiosApi from '../../config/axiosConfig';

const SIDEBAR_ITEMS = [
  { name: "Home", icon: HomeIcon, color: "#11de07", href: "/" },
  { name: "Update profile", icon: Contact2Icon, color: "#F59E0B", href: "/update-profile" },
  //{ name: "Contact us", icon: Phone, color: "#9532a8", href: "/contactus" },
  { name: "Shoppingcart", icon: ShoppingCart, color: "#de078f", href: "/cart" },
  { name: "My-subscriptions", icon: ShoppingBag, color: "#F59E0B", href: "/my-subscriptions" },
  { name: "My-Orders", icon: CatIcon, color: "#9532a8", href: "/my-orders" },
  { name: "Apply Farmer", icon: Users, color: "#11de07", href: "/register-farmer" },
  { name: "Apply Worker", icon: User2Icon, color: "#de078f", href: "/signup" },
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosApi.post('/api/auth/logout', {}, { withCredentials: true });
      toast.success("Logged out successfully");
      navigate('/');
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Failed to logout");
    }
  };

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${isSidebarOpen ? 'w-64' : 'w-20'}`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div className='h-full bg-green-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700'>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className='p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit'
        >
          <Menu size={24} />
        </motion.button>

        <nav className='mt-8 flex-grow'>
          {SIDEBAR_ITEMS.map((item) => (
            <Link key={item.href} to={item.href}>
              <motion.div
                className='flex items-center p-4 text-sm font-medium rounded-lg hover:bg-green-700 transition-colors mb-2'
              >
                <item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      className='ml-4 whitespace-nowrap'
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2, delay: 0.3 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          ))}

          {/* 🚪 Logout button */}
          <motion.div
            onClick={handleLogout}
            className='flex items-center p-4 text-sm font-medium text-red-500 rounded-lg hover:bg-red-700 hover:text-white cursor-pointer transition-colors mt-4'
          >
            <LogOut size={20} />
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.span
                  className='ml-4 whitespace-nowrap'
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2, delay: 0.3 }}
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;

