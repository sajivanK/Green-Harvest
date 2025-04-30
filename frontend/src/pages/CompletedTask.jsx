import React, { useState, useEffect } from "react";
import axiosApi from "../config/axiosConfig";
import { CheckCircle, ClipboardList, Trash2, List } from "lucide-react";

const CompletedTask = () => {
  const [tasks, setTasks] = useState([]);

  // Fetch approved proofs
  const fetchCompletedTasks = async () => {
    try {
      const res = await axiosApi.get("/api/proof/worker-proofs");
      const completedProofs = res.data.proofs.filter(
        (proof) => proof.proofStatus === "Approved"
      );

      const formattedTasks = completedProofs.map((proof) => ({
        id: proof._id,
        title: proof.task || "Unnamed Task",
        date: new Date(proof.createdAt).toLocaleDateString(),
        status: "Completed",
      }));

      setTasks(formattedTasks);
    } catch (error) {
      console.error("Failed to load completed tasks:", error);
    }
  };

  useEffect(() => {
    fetchCompletedTasks();
  }, []);

  const handleDelete = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-950">
      {/* Page Title */}
      <h1 className="text-4xl font-extrabold text-white flex items-center gap-3">
        <ClipboardList className="w-8 h-8 text-blue-400" /> Completed Tasks
      </h1>
      <p className="mt-2 text-gray-400 text-lg">
        Review all your completed tasks uploaded as proof.
      </p>

      {/* Total Completed Tasks Card */}
      <div className="mt-6 bg-green-500 text-white py-4 px-6 rounded-lg shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-8 h-8" />
          <h2 className="text-xl font-semibold">Total Completed Tasks</h2>
        </div>
        <span className="text-3xl font-bold">{tasks.length}</span>
      </div>

      {/* Task Table */}
      <div className="mt-8 bg-gray-900 p-6 rounded-lg shadow-xl overflow-x-auto border-2 border-green-500">
        <h2 className="text-xl font-semibold text-white flex items-center gap-3 border-b border-gray-700 pb-3">
          <List className="w-6 h-6 text-blue-400" />
          Completed Task Details
        </h2>

        <table className="w-full text-white mt-4">
          <thead>
            <tr className="bg-gray-800 text-lg">
              <th className="py-4 px-6 text-left border-b border-gray-600">Task Id</th>
              <th className="py-4 px-6 text-left border-b border-gray-600">Task</th>
              <th className="py-4 px-6 text-left border-b border-gray-600">Date</th>
              <th className="py-4 px-6 text-left border-b border-gray-600">Status</th>
              <th className="py-4 px-6 text-left border-b border-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? (
              tasks.map((task, index) => (
                <tr
                  key={task.id}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                  } hover:bg-gray-600 transition-all`}
                >
                                    <td className="py-2 px-4 text-gray-300 font-mono">#{task.id.slice(-5)}</td>
                  <td className="py-4 px-6">{task.title}</td>
                  <td className="py-4 px-6">{task.date}</td>
                  <td className="py-4 px-6 text-green-400 flex items-center gap-2 text-lg">
                    <CheckCircle className="w-6 h-6" /> {task.status}
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-600 hover:text-white rounded-md transition-all text-lg"
                    >
                      <Trash2 className="w-6 h-6" /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-6 text-center text-gray-400 text-lg">
                  No completed tasks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompletedTask;
