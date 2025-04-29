
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import axiosApi from "../../config/axiosConfig";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";

const FarmerSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await axiosApi.get("/api/subscription/farmer-subscriptions", {
          withCredentials: true,
        });
        if (response.data.success) {
          setSubscriptions(response.data.subscriptions);
        }
      } catch (error) {
        console.error("Failed to fetch subscriptions:", error);
        toast.error("Failed to load subscriptions.");
      }
    };

    fetchSubscriptions();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filtered = subscriptions.filter(
    (sub) =>
      sub.packageName.toLowerCase().includes(searchTerm) ||
      `${sub.deliveryInfo.firstName} ${sub.deliveryInfo.lastName}`.toLowerCase().includes(searchTerm)
  );

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(34, 197, 94);
    doc.text("GreenHarvest - Subscription Summary", 20, 20);

    const columns = ["Customer", "Package", "Price", "Phone", "Subscribed", "Expires", "Status"];
    const rows = filtered.map((sub) => [
      `${sub.deliveryInfo.firstName} ${sub.deliveryInfo.lastName}`,
      sub.packageName,
      `Rs.${sub.packagePrice}`,
      sub.deliveryInfo.phone,
      new Date(sub.subscribedAt).toLocaleDateString(),
      new Date(sub.expiredAt).toLocaleDateString(),
      sub.subscriptionStatus.toUpperCase(),
    ]);

    autoTable(doc, {
		startY: 30,
		head: [columns],
		body: rows,
		styles: { fontSize: 10 },
		headStyles: { fillColor: [34, 197, 94] },
		alternateRowStyles: { fillColor: [240, 240, 240] },
	  });	  

    doc.save("FarmerSubscriptions.pdf");
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Subscriptions</h2>
        <div className="relative flex gap-2">
          <input
            type="text"
            placeholder="Search subscriptions..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <button
            onClick={downloadPDF}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
          >
            Download PDF
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Package</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Subscribed</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Expires</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {filtered.map((sub) => (
              <motion.tr
                key={sub._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {sub.deliveryInfo.firstName} {sub.deliveryInfo.lastName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{sub.packageName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400 font-semibold">Rs.{sub.packagePrice}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{sub.deliveryInfo.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(sub.subscribedAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(sub.expiredAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${sub.subscriptionStatus === "expired" ? "bg-red-600" : "bg-green-600"}`}>
                    {sub.subscriptionStatus.toUpperCase()}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default FarmerSubscriptions;
