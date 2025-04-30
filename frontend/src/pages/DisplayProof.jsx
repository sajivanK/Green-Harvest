import React, { useState, useEffect } from "react";
import axiosApi from "../config/axiosConfig";
import UploadProof from "./UploadProof";
import { Trash2, Edit } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const DisplayProof = () => {
  const [proofs, setProofs] = useState([]);
  const [proofToEdit, setProofToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const proofsPerPage = 5;

  // Fetch proofs
  const fetchProofs = async () => {
    try {
      const response = await axiosApi.get("/api/proof/worker-proofs");
      setProofs(response.data.proofs);
    } catch (error) {
      console.error("Error fetching proofs:", error);
    }
  };

  useEffect(() => {
    fetchProofs();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axiosApi.delete(`/api/proof/delete-proof/${id}`);
      fetchProofs();
    } catch (error) {
      console.error("Error deleting proof:", error);
    }
  };

  const handleGeneratePDF = async () => {
    const doc = new jsPDF("landscape");
    doc.setFontSize(18);
    doc.text("GreenHarvest - Proof Report", 14, 20);
  
    const tableData = [];
    const imageCache = {};
  
    const toBase64 = async (url) => {
      if (imageCache[url]) return imageCache[url]; // avoid reloading
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        return await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            imageCache[url] = reader.result;
            resolve(reader.result);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (err) {
        return null;
      }
    };
  
    for (const proof of proofs) {
      const beforeImageUrl = proof.beforeImage?.startsWith("http")
        ? proof.beforeImage
        : `http://localhost:4000${proof.beforeImage}`;
      const afterImageUrl = proof.afterImage?.startsWith("http")
        ? proof.afterImage
        : `http://localhost:4000${proof.afterImage}`;
  
      tableData.push({
        id: `#${proof._id.slice(-5)}`,
        location: proof.location,
        phone: proof.phone,
        email: proof.email,
        beforeImage: await toBase64(beforeImageUrl),
        afterImage: await toBase64(afterImageUrl),
      });
    }
  
    autoTable(doc, {
      startY: 30,
      head: [["Proof ID", "Location", "Phone", "Email", "Before", "After"]],
      body: tableData.map((row) => [
        row.id,
        row.location,
        row.phone,
        row.email,
        "", // placeholder for image
        "", // placeholder for image
      ]),
      didDrawCell: (data) => {
        const rowIndex = data.row.index;
        const columnIndex = data.column.index;
  
        if ((columnIndex === 4 || columnIndex === 5) && tableData[rowIndex]) {
          const imageData = columnIndex === 4 ? tableData[rowIndex].beforeImage : tableData[rowIndex].afterImage;
          if (imageData) {
            doc.addImage(imageData, "JPEG", data.cell.x + 8, data.cell.y + 8, 10, 10);
          }
        }
      },
      styles: { fontSize: 10, cellPadding: 8 },
      theme: "grid",
    });
  
    doc.save("proofs_with_images.pdf");
  };
  

  const filteredProofs = proofs.filter((proof) => {
    if (searchTerm.startsWith("#")) {
      const idPart = searchTerm.slice(1).toLowerCase();
      return proof._id.slice(-5).toLowerCase().includes(idPart);
    } else {
      return proof.location.toLowerCase().includes(searchTerm.toLowerCase());
    }
  });

  const indexOfLastProof = currentPage * proofsPerPage;
  const indexOfFirstProof = indexOfLastProof - proofsPerPage;
  const currentProofs = filteredProofs.slice(indexOfFirstProof, indexOfLastProof);
  const totalPages = Math.ceil(filteredProofs.length / proofsPerPage);

  return (
    <div className="p-6 flex justify-center">
      <div className="w-full max-w-6xl bg-gray-900 p-8 rounded-lg shadow-lg overflow-x-auto">
        <div className="flex flex-col md:flex-row justify-between gap-4 items-center mb-6">
          <input
            type="text"
            placeholder="Search by location or ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 rounded-md w-full md:w-80 bg-gray-800 text-white placeholder-gray-400 border border-gray-700"
          />
          {proofs.length > 0 && (
            <button
              onClick={handleGeneratePDF}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow"
            >
              Generate PDF
            </button>
          )}
        </div>

        {currentProofs.length === 0 ? (
          <p className="text-gray-400">No proofs found.</p>
        ) : (
          <table className="min-w-full bg-gray-800 text-white rounded-lg overflow-hidden">
            <thead className="bg-gray-700 text-gray-300">
              <tr>
                <th className="py-3 px-4 text-left">Proof ID</th>
                <th className="py-3 px-4 text-left">Before Image</th>
                <th className="py-3 px-4 text-left">After Image</th>
                <th className="py-3 px-4 text-left">Location</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProofs.map((proof) => (
                <tr key={proof._id} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="py-2 px-4 text-gray-300 font-mono">#{proof._id.slice(-5)}</td>
                  <td className="py-2 px-4">
                    {proof.beforeImage ? (
                      <img
                        src={proof.beforeImage.startsWith("http") ? proof.beforeImage : `http://localhost:4000${proof.beforeImage}`}
                        alt="Before"
                        className="h-16 w-28 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-500">No Image</span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {proof.afterImage ? (
                      <img
                        src={proof.afterImage.startsWith("http") ? proof.afterImage : `http://localhost:4000${proof.afterImage}`}
                        alt="After"
                        className="h-16 w-28 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-500">No Image</span>
                    )}
                  </td>
                  <td className="py-2 px-4">{proof.location}</td>
                  <td className="py-2 px-4">{proof.phone}</td>
                  <td className="py-2 px-4">{proof.email}</td>
                  <td className="py-2 px-4 text-center">
                    <div className="flex justify-center gap-4">
                      <button
                        className="text-blue-400 hover:text-blue-600"
                        onClick={() => setProofToEdit(proof)}
                      >
                        <Edit />
                      </button>
                      <button
                        className="text-red-400 hover:text-red-600"
                        onClick={() => handleDelete(proof._id)}
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "bg-green-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}

        {proofToEdit && (
          <div className="mt-6">
            <UploadProof
              proofToEdit={proofToEdit}
              setProofToEdit={setProofToEdit}
              fetchProofs={fetchProofs}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayProof;
