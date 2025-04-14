import SubscriptionForm from "../components/package/subscriptionForm";
import { useState, useEffect } from "react";
import Header from "../components/common/Header";
import { motion } from "framer-motion";
import { Edit, Trash2 } from "lucide-react";
import axiosApi from "../config/axiosConfig";

const PackagePage = () => {
  const [packages, setPackages] = useState([]);
  const [editingPackage, setEditingPackage] = useState(null);

  const fetchPackages = async () => {
    try {
      const response = await axiosApi.get("/api/package/all");
      if (response.data.success) {
        setPackages(response.data.packages);
      }
    } catch (error) {
      console.error("Failed to fetch packages:", error);
    }
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
  };

  const handleDelete = async (id) => {
    try {
      await axiosApi.delete(`/api/package/delete/${id}`, { withCredentials: true });
      setPackages(packages.filter((pkg) => pkg._id !== id));
    } catch (error) {
      console.error("Failed to delete package:", error);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Create Subscription Package" />
      <main className="max-w-4xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SubscriptionForm onSubmit={fetchPackages} editingPackage={editingPackage} setEditingPackage={setEditingPackage} fetchPackages={fetchPackages} />
        </motion.div>
        <section className="mt-6">
          <h2 className="text-xl font-bold text-white mb-4">My Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {packages.map((pkg) => (
              <div key={pkg._id} className="bg-gray-800 p-4 border border-gray-700 rounded-lg shadow">
                <img src={`http://localhost:4000/uploads/${pkg.image}`} alt={pkg.packageName} className="w-full h-40 object-cover rounded" />
                <h3 className="mt-2 text-lg font-bold text-white">{pkg.packageName}</h3>
                <p className="text-gray-400">{pkg.description}</p>
                <p className="text-green-400 font-semibold">Price: LKR {pkg.price}</p>
                <p className="text-gray-400">Duration: {pkg.duration}</p>
                <p className="text-gray-400">Frequency: {pkg.deliveryFrequency}</p>
                <div className="flex justify-end gap-2">
                  <button onClick={() => handleEdit(pkg)} className="p-2 bg-yellow-500 text-white rounded">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(pkg._id)} className="p-2 bg-red-500 text-white rounded">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default PackagePage;
