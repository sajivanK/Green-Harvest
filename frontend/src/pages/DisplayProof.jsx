// import React, { useState, useEffect } from "react";
// import axiosApi from "../config/axiosConfig";
// import UploadProof from "./UploadProof";
// import { Trash2, Edit, Image } from "lucide-react";

// const DisplayProof = () => {
//     const [proofs, setProofs] = useState([]);
//     const [proofToEdit, setProofToEdit] = useState(null);

//     // Fetch all proofs of the worker
//     const fetchProofs = async () => {
//         try {
//             const response = await axiosApi.get("/api/proof/worker-proofs");
//             console.log("data ",response)
//             setProofs(response.data.proofs);
//         } catch (error) {
//             console.error("Error fetching proofs:", error);
//         }
//     };

//     useEffect(() => {
//         fetchProofs();
//     }, []);

//     // Handle delete proof
//     const handleDelete = async (id) => {
//         try {
//             await axiosApi.delete(`/api/proof/delete-proof/${id}`);
//             fetchProofs(); // Refresh proof list
//         } catch (error) {
//             console.error("Error deleting proof:", error);
//         }
//     };

//     return (
//         <div className="p-6 flex justify-center">
//             <div className="w-full max-w-3xl bg-gray-900 p-8 rounded-lg shadow-lg">
//                 <h1 className="text-3xl font-bold text-white">My Proofs</h1>

//                 {proofs.length === 0 ? (
//                     <p className="mt-4 text-gray-400">No proofs uploaded yet.</p>
//                 ) : (
//                     <div className="mt-6 space-y-4">
//                         {proofs.map((proof) => (
//                             <div key={proof._id} className="bg-gray-800 p-4 rounded-lg flex flex-col gap-4">
//                                 {/* Display Proof Image */}

//                                 {proof.proofImage && proof.proofImage !== "null" && (
//                                     <img
//                                         src={proof.proofImage.startsWith("http") ? proof.proofImage : `http://localhost:4000${proof.proofImage}`} // ✅ Ensure Correct URL
//                                         alt="Uploaded Proof"
//                                         className="w-full h-40 object-cover rounded-md"
//                                         onError={(e) => e.target.style.display = "none"} // ✅ Hide broken images
//                                     />
//                                 )}


//                                 {/* Proof Details */}
//                                 <div className="flex justify-between items-center">
//                                     <div>
//                                         <h3 className="text-white font-bold">{proof.location}</h3>
//                                         <p className="text-gray-400">{proof.phone} | {proof.email}</p>
//                                     </div>

//                                     {/* Edit & Delete Buttons */}
//                                     <div className="flex gap-3">
//                                         <button
//                                             className="text-blue-400 hover:text-blue-600"
//                                             onClick={() => setProofToEdit(proof)}
//                                         >
//                                             <Edit />
//                                         </button>
//                                         <button
//                                             className="text-red-400 hover:text-red-600"
//                                             onClick={() => handleDelete(proof._id)}
//                                         >
//                                             <Trash2 />
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}

//                 {proofToEdit && (
//                     <UploadProof proofToEdit={proofToEdit} setProofToEdit={setProofToEdit} fetchProofs={fetchProofs} />
//                 )}
//             </div>
//         </div>
//     );
// };

// export default DisplayProof;

import React, { useState, useEffect } from "react";
import axiosApi from "../config/axiosConfig";
import UploadProof from "./UploadProof";
import { Trash2, Edit } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const DisplayProof = () => {
  const [proofs, setProofs] = useState([]);
  const [proofToEdit, setProofToEdit] = useState(null);

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

  // Delete proof
  const handleDelete = async (id) => {
    try {
      await axiosApi.delete(`/api/proof/delete-proof/${id}`);
      fetchProofs();
    } catch (error) {
      console.error("Error deleting proof:", error);
    }
  };

  // Generate PDF
  const handleGeneratePDF = () => {
    console.log("Generating PDF...");
    const doc = new jsPDF({ orientation: "landscape" });

    doc.setFontSize(18);
    doc.text("GreenHarvest - Proof Report", 14, 20);

    const tableColumn = ["Location", "Phone", "Email", "Before Image", "After Image"];
    const tableRows = [];

    proofs.forEach((proof) => {
      tableRows.push([
        proof.location || "N/A",
        proof.phone || "N/A",
        proof.email || "N/A",
        proof.beforeImage ? "✔️" : "❌",
        proof.afterImage ? "✔️" : "❌",
      ]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 10 },
    });

    doc.save("proofs_report.pdf");
  };

  return (
    <div className="p-6 flex justify-center">
      <div className="w-full max-w-6xl bg-gray-900 p-8 rounded-lg shadow-lg overflow-x-auto">

        {/* Header and PDF button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">My Proofs</h1>
          {proofs.length > 0 && (
            <button
              onClick={handleGeneratePDF}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow"
            >
              Generate PDF
            </button>
          )}
        </div>

        {proofs.length === 0 ? (
          <p className="text-gray-400">No proofs uploaded yet.</p>
        ) : (
          <table className="min-w-full bg-gray-800 text-white rounded-lg overflow-hidden">
            <thead className="bg-gray-700 text-gray-300">
              <tr>
                <th className="py-3 px-4 text-left">Before Image</th>
                <th className="py-3 px-4 text-left">After Image</th>
                <th className="py-3 px-4 text-left">Location</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {proofs.map((proof) => (
                <tr key={proof._id} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="py-2 px-4">
                    {proof.beforeImage ? (
                      <img
                        src={
                          proof.beforeImage.startsWith("http")
                            ? proof.beforeImage
                            : `http://localhost:4000${proof.beforeImage}`
                        }
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
                        src={
                          proof.afterImage.startsWith("http")
                            ? proof.afterImage
                            : `http://localhost:4000${proof.afterImage}`
                        }
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

        {/* Edit form */}
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
