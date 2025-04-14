import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import axiosApi from "../../config/axiosConfig"; // ✅ Import axios
import { useNavigate } from "react-router-dom"; // ✅ Import navigate hook

const DangerZone = () => {
    const navigate = useNavigate(); // ✅ Hook to navigate after logout

    // ✅ Logout Function
    const handleLogout = async () => {
        try {
            const response = await axiosApi.post("/api/auth/logout", {}, { withCredentials: true });

            if (response.data.succes) {
                console.log("✅ Logged out successfully");
                navigate("/login"); // ✅ Redirect to login page
            } else {
                console.error("❌ Logout failed:", response.data.message);
            }
        } catch (error) {
            console.error("❌ Logout Error:", error.response?.data?.message || error.message);
        }
    };

    return (
        <motion.div
            className='bg-red-900 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-red-700 mb-8'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <div className='flex items-center mb-4'>
                <Trash2 className='text-red-400 mr-3' size={24} />
                <h2 className='text-xl font-semibold text-gray-100'>Danger Zone</h2>
            </div>
            <p className='text-gray-300 mb-4'>Permanently delete your account and all of your content.</p>
            <button
                onClick={handleLogout} // ✅ Call logout function on click
                className='bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200'
            >
                Log out
            </button>
        </motion.div>
    );
};

export default DangerZone;
