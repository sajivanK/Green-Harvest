import React, { useState, useEffect } from "react";
import axiosApi from "../config/axiosConfig";
import UploadProof from "./UploadProof";
import { Trash2, Edit } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Logo from "../assets/Grennlogo.png";

const DisplayProof = () => {
  const [proofs, setProofs] = useState([]);
  const [proofToEdit, setProofToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null); // 👈 for image popup
  const proofsPerPage = 5;

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
    const pageWidth = doc.internal.pageSize.getWidth();

    const logoBase64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      fetch(Logo)
        .then((res) => res.blob())
        .then((blob) => {
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
    });

    if (logoBase64) {
      doc.addImage(logoBase64, "PNG", 30, 5, 40, 40);
    }

    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("GreenHarvest Pvt Ltd", pageWidth / 2, 20, { align: "center" });

    doc.setFontSize(18);
    doc.setFont("helvetica", "normal");
    doc.text("Task Proof Report", pageWidth / 2, 30, { align: "center" });

    const tableData = [];
    const imageCache = {};

    const toBase64 = async (url) => {
      if (imageCache[url]) return imageCache[url];
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

    let count = 1;
    for (const proof of proofs) {
      const beforeImageUrl = proof.beforeImage?.startsWith("http")
        ? proof.beforeImage
        : `http://localhost:4000${proof.beforeImage}`;
      const afterImageUrl = proof.afterImage?.startsWith("http")
        ? proof.afterImage
        : `http://localhost:4000${proof.afterImage}`;

      tableData.push({
        id: count++,
        location: proof.location,
        phone: proof.phone,
        email: proof.email,
        beforeImage: await toBase64(beforeImageUrl),
        afterImage: await toBase64(afterImageUrl),
      });
    }

    autoTable(doc, {
      startY: 50,
      head: [["No", "Location", "Phone", "Email", "Before Image", "After Image"]],
      body: tableData.map((row) => [
        row.id,
        row.location,
        row.phone,
        row.email,
        "",
        "",
      ]),
      didDrawCell: (data) => {
        const rowIndex = data.row.index;
        const columnIndex = data.column.index;

        if (
          data.section === "body" &&
          (columnIndex === 4 || columnIndex === 5) &&
          tableData[rowIndex]
        ) {
          const imageData =
            columnIndex === 4
              ? tableData[rowIndex].beforeImage
              : tableData[rowIndex].afterImage;

          if (imageData) {
            const imageWidth = 30;
            const imageHeight = 20;
            const xCenter = data.cell.x + (data.cell.width - imageWidth) / 2;
            const yCenter = data.cell.y + (data.cell.height - imageHeight) / 2;

            doc.addImage(imageData, "JPEG", xCenter, yCenter, imageWidth, imageHeight);
          }
        }
      },
      styles: {
        fontSize: 10,
        cellPadding: { top: 12, bottom: 12 },
        valign: "middle",
        halign: "center",
      },
      headStyles: {
        fontSize: 14,
        fillColor: [34, 197, 94],
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
      theme: "grid",
      margin: { top: 40 },
    });

    const pageHeight = doc.internal.pageSize.getHeight();
    const now = new Date();
    const currentDateTime = now.toLocaleString();

    doc.setFontSize(10);
    doc.text(`Reported by: Worker Management`, 14, pageHeight - 15);
    doc.text(`Generated on: ${currentDateTime}`, pageWidth - 80, pageHeight - 15);

    doc.save("GreenHarvest_Proof_Report.pdf");
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

                  {/* Before Image with Popup */}
                  <td className="py-2 px-4">
                    {proof.beforeImage ? (
                      <img
                        src={
                          proof.beforeImage.startsWith("http")
                            ? proof.beforeImage
                            : `http://localhost:4000${proof.beforeImage}`
                        }
                        alt="Before"
                        className="h-16 w-28 object-cover rounded cursor-pointer hover:opacity-80"
                        onClick={() =>
                          setSelectedImage({
                            src: proof.beforeImage.startsWith("http")
                              ? proof.beforeImage
                              : `http://localhost:4000${proof.beforeImage}`,
                            label: "Before Image",
                          })
                        }
                      />
                    ) : (
                      <span className="text-gray-500">No Image</span>
                    )}
                  </td>

                  {/* After Image with Popup */}
                  <td className="py-2 px-4">
                    {proof.afterImage ? (
                      <img
                        src={
                          proof.afterImage.startsWith("http")
                            ? proof.afterImage
                            : `http://localhost:4000${proof.afterImage}`
                        }
                        alt="After"
                        className="h-16 w-28 object-cover rounded cursor-pointer hover:opacity-80"
                        onClick={() =>
                          setSelectedImage({
                            src: proof.afterImage.startsWith("http")
                              ? proof.afterImage
                              : `http://localhost:4000${proof.afterImage}`,
                            label: "After Image",
                          })
                        }
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

      {/* 🔥 Image Popup Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-transparent bg-opacity-70 z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-lg max-w-3xl p-4">
            <button
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full px-3 py-1 text-sm hover:bg-red-700"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
            <p className="text-center text-lg font-semibold mb-4 text-gray-700">
              {selectedImage.label}
            </p>
            <img
              src={selectedImage.src}
              alt="Popup"
              className="max-h-[80vh] w-auto mx-auto rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayProof;
