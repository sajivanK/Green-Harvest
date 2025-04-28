
import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axiosApi from "../config/axiosConfig";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const GenerateFullReport = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportData, setReportData] = useState(null);
  const [farmerName, setFarmerName] = useState("");
  const [farmLogo, setFarmLogo] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchReportData = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select a valid date range");
      return;
    }

    try {
      setLoading(true);
      const reportResponse = await axiosApi.get(`/api/orders/report?startDate=${startDate}&endDate=${endDate}`, { withCredentials: true });
      const farmerResponse = await axiosApi.get("/api/farmer/profile", { withCredentials: true });

      if (reportResponse.data.success && farmerResponse.data.success) {
        setReportData(reportResponse.data);
        setFarmerName(farmerResponse.data.farmer.farmName || "Unknown Farmer");
        setFarmLogo(farmerResponse.data.farmer.profileImage || "");
        toast.success("Report data fetched successfully!");
      } else {
        toast.error("Failed to fetch report or farmer details.");
      }
    } catch (error) {
      console.error("Error fetching report:", error);
      toast.error("Error fetching report data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!reportData || !farmerName) {
      toast.error("Generate the report first!");
      return;
    }

    const doc = new jsPDF();

    const totalQuantity = reportData.productSales.reduce((acc, curr) => acc + curr.quantity, 0);
    const totalRevenue = reportData.productSales.reduce((acc, curr) => acc + curr.revenue, 0);

    if (farmLogo) {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = farmLogo.startsWith("http") ? farmLogo : `http://localhost:4000/uploads/${farmLogo}`;

      img.onload = () => {
        doc.addImage(img, "JPEG", 80, 10, 50, 50);
        addContent(doc, totalQuantity, totalRevenue);
      };
      img.onerror = () => {
        addContent(doc, totalQuantity, totalRevenue);
      };
    } else {
      addContent(doc, totalQuantity, totalRevenue);
    }

    function addContent(doc, totalQty, totalRev) {
      doc.setFontSize(18);
      doc.text("GreenHarvest - Sales Report", 105, 70, { align: "center" });

      doc.setFontSize(12);
      doc.text(`Farmer: ${farmerName}`, 14, 85);
      doc.text(`Period: ${startDate} ➔ ${endDate}`, 14, 92);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 99);

      autoTable(doc, {
        startY: 110,
        head: [["Product", "Quantity Sold", "Revenue (LKR)"]],
        body: [
          ...reportData.productSales.map((item) => [
            item.name,
            item.quantity,
            item.revenue.toLocaleString(),
          ]),
          ["Total", totalQty, totalRev.toLocaleString()],
        ],
        styles: { halign: "center" },
      });

      doc.setFontSize(16);
      doc.text("Top Selling Products", 14, doc.lastAutoTable.finalY + 10);

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 20,
        head: [["Product", "Units Sold"]],
        body: reportData.topProducts.map((item) => [
          item.name,
          item.quantity,
        ]),
        styles: { halign: "center" },
      });

      doc.save("GreenHarvest_Farmer_Report.pdf");
    }
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-gray-100 mb-6">Generate Full Sales Report</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex flex-col">
          <label className="text-gray-300 mb-2">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-gray-700 text-white rounded-lg py-2 px-4"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-300 mb-2">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-gray-700 text-white rounded-lg py-2 px-4"
          />
        </div>
        <button
          onClick={fetchReportData}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg self-end"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Report"}
        </button>
      </div>

      {reportData && (
        <div className="bg-white rounded-lg text-black p-6">
          <h3 className="text-2xl font-bold mb-2">GreenHarvest - Sales Report</h3>
          <p><b>Farmer:</b> {farmerName}</p>
          <p><b>Period:</b> {startDate} ➔ {endDate}</p>
          <p><b>Generated:</b> {new Date().toLocaleDateString()}</p>

          <h4 className="text-xl font-semibold mt-6 mb-2">Product Sales Breakdown</h4>
          <table className="w-full border border-gray-300 text-sm mb-6">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-2 py-1">Product</th>
                <th className="border px-2 py-1">Quantity Sold</th>
                <th className="border px-2 py-1">Revenue (LKR)</th>
              </tr>
            </thead>
            <tbody>
              {reportData.productSales.map((item, index) => (
                <tr key={index}>
                  <td className="border px-2 py-1">{item.name}</td>
                  <td className="border px-2 py-1">{item.quantity}</td>
                  <td className="border px-2 py-1">{item.revenue.toLocaleString()}</td>
                </tr>
              ))}
              <tr className="font-bold">
                <td className="border px-2 py-1">Total</td>
                <td className="border px-2 py-1">
                  {reportData.productSales.reduce((acc, curr) => acc + curr.quantity, 0)}
                </td>
                <td className="border px-2 py-1">
                  {reportData.productSales.reduce((acc, curr) => acc + curr.revenue, 0).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>

          <h4 className="text-xl font-semibold mt-6 mb-2">Top Selling Products</h4>
          <ol className="list-decimal ml-6">
            {reportData.topProducts.map((product, index) => (
              <li key={index} className="mb-1">{product.name} - {product.quantity} units</li>
            ))}
          </ol>

          <button
            onClick={handleDownload}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg mt-8"
          >
            Download PDF
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default GenerateFullReport;
