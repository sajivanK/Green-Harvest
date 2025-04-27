import { useEffect, useState } from "react";
import axiosApi from "../config/axiosConfig";
import { Mail, Phone, MapPin, User } from "lucide-react";
import { useNavigate } from "react-router-dom";      //vishnu added this for passing 


const ViewWorkers = () => {

//vishnuja added this code for navigation
const navigate = useNavigate();

  const [workers, setWorkers] = useState([]);

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

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8 text-center">Available Sanitary Workers</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {workers.map((worker) => (
          <div key={worker._id} className="bg-gray-800 rounded-2xl shadow-lg p-6 hover:scale-105 transition-transform duration-300">
            <img
              src={`http://localhost:4000${worker.profileImage}`}
              alt={worker.name}
              className="w-32 h-32 mx-auto rounded-full border-4 border-blue-500 object-cover"
            />
            <h2 className="text-xl font-bold text-center mt-4">{worker.name}</h2>

            <div className="mt-4 text-sm space-y-2">
              <p className="flex items-center gap-2"><MapPin size={16} className="text-blue-400" /> {worker.location}</p>
              <p className="flex items-center gap-2"><Mail size={16} className="text-green-400" /> {worker.email}</p>
              <p className="flex items-center gap-2"><Phone size={16} className="text-pink-400" /> {worker.phone}</p>
            </div>

            <button
              className="mt-6 w-full py-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg text-white font-semibold hover:opacity-90 transition-all"
              onClick={() => navigate("/add-detail", { state: { workeremail: worker.email } })}  // vishnu added this code 
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
