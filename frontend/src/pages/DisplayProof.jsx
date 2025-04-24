import React, { useState, useEffect } from "react";
import axiosApi from "../config/axiosConfig";
import UploadProof from "./UploadProof";
import { Trash2, Edit, Image } from "lucide-react";

const DisplayProof = () => {
    const [proofs, setProofs] = useState([]);
    const [proofToEdit, setProofToEdit] = useState(null);

    // Fetch all proofs of the worker
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

    // Handle delete proof
    const handleDelete = async (id) => {
        try {
            await axiosApi.delete(`/api/proof/delete-proof/${id}`);
            fetchProofs(); // Refresh proof list
        } catch (error) {
            console.error("Error deleting proof:", error);
        }
    };

    return (
        <div className="p-6 flex justify-center">
            <div className="w-full max-w-3xl bg-gray-900 p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-white">My Proofs</h1>

                {proofs.length === 0 ? (
                    <p className="mt-4 text-gray-400">No proofs uploaded yet.</p>
                ) : (
                    <div className="mt-6 space-y-4">
                        {proofs.map((proof) => (
                            <div key={proof._id} className="bg-gray-800 p-4 rounded-lg flex flex-col gap-4">
                                {/* Display Proof Image */}

                                {proof.proofImage && proof.proofImage !== "null" && (
                                    <img
                                        src={proof.proofImage.startsWith("http") ? proof.proofImage : `http://localhost:4000${proof.proofImage}`} // ✅ Ensure Correct URL
                                        alt="Uploaded Proof"
                                        className="w-full h-40 object-cover rounded-md"
                                        onError={(e) => e.target.style.display = "none"} // ✅ Hide broken images
                                    />
                                )}


                                {/* Proof Details */}
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-white font-bold">{proof.location}</h3>
                                        <p className="text-gray-400">{proof.phone} | {proof.email}</p>
                                    </div>

                                    {/* Edit & Delete Buttons */}
                                    <div className="flex gap-3">
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
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {proofToEdit && (
                    <UploadProof proofToEdit={proofToEdit} setProofToEdit={setProofToEdit} fetchProofs={fetchProofs} />
                )}
            </div>
        </div>
    );
};

export default DisplayProof;