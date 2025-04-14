import { useEffect, useState } from "react";
import { User } from "lucide-react";
import axiosApi from "../../config/axiosConfig";
import SettingSection from "./SettingSection";
import FarmerRegistration from "../../pages/FarmerRegistration"; // ✅ Import the existing form

const Profile = () => {
    const [farmer, setFarmer] = useState(null);
    const [user, setUser] = useState(null); // ✅ Fetch User Data
    const [isEditing, setIsEditing] = useState(false);

    // ✅ Fetch Farmer & User Data
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const farmerResponse = await axiosApi.get("/api/farmer/profile", { withCredentials: true });
                const userResponse = await axiosApi.get("/api/auth/check", { withCredentials: true });

                if (farmerResponse.data.success && farmerResponse.data.farmer) {
                    setFarmer(farmerResponse.data.farmer);
                } else {
                    console.error("⚠️ Failed to fetch farmer data.");
                }

                if (userResponse.data.success && userResponse.data.user) {
                    setUser(userResponse.data.user);
                } else {
                    console.error("⚠️ Failed to fetch user data.");
                }
            } catch (error) {
                console.error("⚠️ Error fetching profile data:", error);
            }
        };

        fetchProfileData();
    }, []);

    // ✅ Handle Profile Image Correctly
    const profileImageUrl = farmer?.profileImage
  ? `http://localhost:4000/uploads/${farmer.profileImage}`
  : "https://randomuser.me/api/portraits/men/3.jpg";


    return (
        <SettingSection icon={User} title={"Farmer Profile"}>
            {!isEditing ? (
                <>
                    <div className="flex flex-col sm:flex-row items-center mb-6">
                        <img
                            src={profileImageUrl}
                            alt="Farmer Profile"
                            className="rounded-full w-20 h-20 object-cover mr-4 border-2 border-gray-500"
                        />

                        <div>
                            <h3 className="text-lg font-semibold text-gray-100">{farmer?.farmName || "Loading..."}</h3>
                            <p className="text-gray-400">{user?.email || "Loading..."}</p> {/* ✅ Display user email */}
                        </div>
                    </div>

                    <button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-200 w-full sm:w-auto"
                        onClick={() => setIsEditing(true)}
                    >
                        Edit Profile
                    </button>
                </>
            ) : (
                <FarmerRegistration initialData={farmer} onClose={() => setIsEditing(false)} />
            )}
        </SettingSection>
    );
};

export default Profile;
