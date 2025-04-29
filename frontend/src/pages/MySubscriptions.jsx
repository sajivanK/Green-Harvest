
import React, { useEffect, useState } from "react";
import axiosApi from "../config/axiosConfig";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/logo.png"; // ✅ Import your logo

const MySubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await axiosApi.get("/api/subscription/my-subscriptions", { withCredentials: true });
        if (res.data.success) {
          setSubscriptions(res.data.subscriptions);
        } else {
          setError(res.data.message || "Failed to fetch subscriptions.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load subscriptions.");
      }
    };

    fetchSubscriptions();
  }, []);

  const downloadPDF = () => {
    const doc = new jsPDF();
  
    // Title
    doc.setFontSize(18);
    doc.setTextColor(34, 197, 94);
    doc.text("GreenHarvest - My Subscriptions", 20, 20);
  
    // Today's date
    const today = new Date();
    const formattedDate = today.toLocaleDateString();
  
    // Table
    const tableColumn = ["Package", "Price", "Frequency", "Duration", "Subscribed", "Expires", "Status"];
    const tableRows = [];
  
    subscriptions.forEach((sub) => {
      const subData = [
        sub.packageName,
        `Rs.${sub.packagePrice}`,
        sub.deliveryFrequency,
        sub.duration,
        new Date(sub.subscribedAt).toLocaleDateString(),
        new Date(sub.expiredAt).toLocaleDateString(),
        sub.subscriptionStatus.toUpperCase(),
      ];
      tableRows.push(subData);
    });
  
    // 🛠 Call autoTable like this:
    autoTable(doc, {
      startY: 30,
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [34, 197, 94], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });
  
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(`Generated on: ${formattedDate}`, 15, doc.internal.pageSize.height - 10);
  
    doc.save("MySubscriptionsReport.pdf");
  };
  
  

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  if (subscriptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-[#1da358] via-[#4c906a] to-[#7ec89e] text-white">
        <h2 className="text-2xl font-bold mb-4">No Subscriptions Yet</h2>
        <Link to="/display-package" className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg">
          Browse Packages
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#1da358] via-[#4c906a] to-[#7ec89e] text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">📦 My Subscriptions</h1>
        <button
          onClick={downloadPDF}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition"
        >
          Download PDF 📥
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {subscriptions.map((sub) => (
          <motion.div
            key={sub._id}
            className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{sub.packageName}</h2>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${sub.subscriptionStatus === "expired" ? "bg-red-600" : "bg-green-600"}`}>
                {sub.subscriptionStatus.toUpperCase()}
              </span>
            </div>

            <p className="text-green-400 font-semibold mb-2">Rs.{sub.packagePrice.toFixed(2)}</p>
            <p><b>Delivery:</b> {sub.deliveryFrequency}</p>
            <p><b>Duration:</b> {sub.duration}</p>
            <p><b>Subscribed At:</b> {new Date(sub.subscribedAt).toLocaleDateString()}</p>
            <p><b>Expires At:</b> {new Date(sub.expiredAt).toLocaleDateString()}</p>

            {sub.subscriptionStatus === "expired" && (
              <Link
                to="/display-package"
                className="mt-4 inline-block bg-yellow-500 hover:bg-yellow-600 text-black py-2 px-4 rounded-full font-semibold text-sm transition"
              >
                Renew Package
              </Link>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MySubscriptions;
