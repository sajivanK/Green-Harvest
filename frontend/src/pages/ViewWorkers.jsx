import { useEffect, useState } from "react";
import axiosApi from "../config/axiosConfig";
import { Mail, Phone, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ViewWorkers = () => {
  const navigate = useNavigate();

  const [workers, setWorkers] = useState([]);
  const [searchLocation, setSearchLocation] = useState("");

  // ✅ Theme state
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const res = await axiosApi.get("/api/worker/all");
        if (res.data.success) {
          setWorkers(res.data.workers);
        }
      } catch (err) {
        console.error("Error fetching workers:", err);
      }
    };

    fetchWorkers();
  }, []);

  const filteredWorkers = workers.filter((worker) =>
    worker.location.toLowerCase().includes(searchLocation.toLowerCase())
  );

  return (
    <div className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      
      {/* Navbar with Title, Company Name, Navigation, Search and Theme Toggle */}
      <div className={`flex flex-col md:flex-row md:items-center md:justify-between ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'} p-6 rounded-lg mb-8 shadow-md`}>
        <div>
          <h1 className="text-2xl font-bold text-green-400">Smart Waste Management System</h1>
          <p className="text-sm text-gray-400">Green Harvest</p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-4 mt-4 md:mt-0">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-green-600 rounded-lg text-white hover:bg-green-700"
          >
            Home
          </button>
          

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by Location..."
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            className={`w-full md:w-72 px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 border-gray-600 placeholder-gray-400 text-white' : 'bg-gray-100 border-gray-300 placeholder-gray-600 text-gray-900'}`}
          />

          {/* ✅ Theme Toggle Button AFTER Search Input */}
          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-green-600 rounded-lg text-white hover:bg-green-700"
          >
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>

        </div>
      </div>

      {/* Workers Section */}
      <h2 className="text-3xl font-bold mb-6">Available Sanitary Workers</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredWorkers.map((worker) => (
          <div
            key={worker._id}
            className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-2xl shadow-lg p-6 hover:scale-105 transition-transform duration-300`}
          >
            {/* <img
              src={`http://localhost:4000${worker.profileImage}`}
              alt={worker.name}
              className="w-32 h-32 mx-auto rounded-full border-4 border-green-400 object-cover"
            /> */}
            <img
              src={`http://localhost:4000${worker.profileImage || '/uploads/default-avatar.png'}`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `http://localhost:4000/uploads/default-avatar.png`;
              }}
              alt={worker.name}
              className="w-32 h-32 mx-auto rounded-full border-4 border-green-400 object-cover"
            />


            <h2 className="text-xl font-bold text-center mt-4 text-green-400">{worker.name}</h2>

            <div className={`mt-4 text-sm space-y-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              <p className="flex items-center gap-2"><MapPin size={16} className="text-green-400" /> {worker.location}</p>
              <p className="flex items-center gap-2"><Mail size={16} className="text-green-400" /> {worker.email}</p>
              <p className="flex items-center gap-2"><Phone size={16} className="text-green-400" /> {worker.phone}</p>
            </div>

            <button
              className="mt-6 w-full py-2 bg-gradient-to-r from-green-500 to-green-700 rounded-lg text-white font-semibold hover:opacity-90 transition-all"
              onClick={() => navigate("/add-detail", { state: { workerEmail: worker.email } })}
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewWorkers;
