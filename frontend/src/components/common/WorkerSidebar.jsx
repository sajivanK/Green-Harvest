// import React, { useState } from "react";
// import { BarChart2, ClipboardList, Upload, DollarSign, User, Settings, Menu } from "lucide-react";
// import { AnimatePresence, motion } from "framer-motion";
// import { Link } from "react-router-dom";

// const SIDEBAR_ITEMS = [
//   { name: "Dashboard", icon: BarChart2, color: "#6366f1", href: "/dashboard" },
//   { name: "My Tasks", icon: ClipboardList, color: "#8B5CF6", href: "/completed" },
//   { name: "Upload Proof", icon: Upload, color: "#EC4899", href: "/upload-proof" },
//   { name: "Earnings", icon: DollarSign, color: "#F59E0B", href: "/earnings" },
//   {name:"My Proofs",icon: Upload, color: "#EC4899", href: "/display-proof"},
//   { name: "Profile & Settings", icon: User, color: "#10B981", href: "/profile-settings" },
// ];

// const WorkerSidebar = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   return (
//     <motion.div
//       className={`fixed top-0 left-0 h-screen bg-gray-900 p-4 flex flex-col border-r border-gray-700 transition-all duration-300 ${
//         isSidebarOpen ? "w-64" : "w-20"
//       }`}
//     >
//       {/* Sidebar Toggle Button */}
//       <motion.button
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.9 }}
//         onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//         className="p-2 rounded-full hover:bg-gray-700 transition-colors"
//       >
//         <Menu size={24} className="text-white" />
//       </motion.button>

//       {/* Navigation Links */}
//       <nav className="mt-8 flex-grow">
//         {SIDEBAR_ITEMS.map((item) => (
//           <Link key={item.href} to={item.href}>
//             <motion.div className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2">
//               <item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
//               <AnimatePresence>
//                 {isSidebarOpen && (
//                   <motion.span
//                     className="ml-4 whitespace-nowrap text-white"
//                     initial={{ opacity: 0, width: 0 }}
//                     animate={{ opacity: 1, width: "auto" }}
//                     exit={{ opacity: 0, width: 0 }}
//                     transition={{ duration: 0.2, delay: 0.3 }}
//                   >
//                     {item.name}
//                   </motion.span>
//                 )}
//               </AnimatePresence>
//             </motion.div>
//           </Link>
//         ))}
//       </nav>
//     </motion.div>
//   );
// };

// export default WorkerSidebar;

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BarChart2, ClipboardList, Upload, DollarSign, User, Menu, LogOut,FileCheck } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import axiosApi from "../../config/axiosConfig";

const SIDEBAR_ITEMS = [
  { name: "Dashboard", icon: BarChart2, color: "#6366f1", href: "/dashboard" },
  { name: "My Tasks", icon: ClipboardList, color: "#8B5CF6", href: "/completed" },
  { name: "Upload Proof", icon: Upload, color: "#EC4899", href: "/upload-proof" },
  { name: "My Proofs", icon: FileCheck, color: "#EC4899", href: "/display-proof" },
  { name: "Profile & Settings", icon: User, color: "#10B981", href: "/profile-settings" },
];

const WorkerSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosApi.post("/api/auth/logout", {}, { withCredentials: true });
      localStorage.removeItem("token"); // If you store any token locally
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <motion.div
      className={`fixed top-0 left-0 h-screen bg-gray-900 p-4 flex flex-col border-r border-gray-700 transition-all duration-300 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Sidebar Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="p-2 rounded-full hover:bg-gray-700 transition-colors"
      >
        <Menu size={24} className="text-white" />
      </motion.button>

      {/* Navigation Links */}
      <nav className="mt-8 flex-grow">
        {SIDEBAR_ITEMS.map((item) => (
          <Link key={item.href} to={item.href}>
            <motion.div className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2">
              <item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.span
                    className="ml-4 whitespace-nowrap text-white"
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
      </nav>

      {/* Logout Button */}
      <motion.button
        onClick={handleLogout}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-red-600 transition-colors text-white mt-auto"
      >
        <LogOut size={20} className="text-red-400" />
        {isSidebarOpen && (
          <motion.span
            className="ml-4"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
          >
            Logout
          </motion.span>
        )}
      </motion.button>
    </motion.div>
  );
};

export default WorkerSidebar;
