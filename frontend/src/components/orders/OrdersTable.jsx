
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import axiosApi from "../../config/axiosConfig"; 
import { toast } from "react-toastify";

const OrdersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosApi.get("/api/orders/my-orders", {
          withCredentials: true,
        });
        if (response.data.success) {
          setOrders(response.data.orders);
          setFilteredOrders(response.data.orders);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        toast.error("Failed to load orders.");
      }
    };

    fetchOrders();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = orders.filter(
      (order) =>
        order.productId?.name.toLowerCase().includes(term) ||
        (order.deliveryInfo.firstName + " " + order.deliveryInfo.lastName).toLowerCase().includes(term)
    );
    setFilteredOrders(filtered);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axiosApi.patch(`/api/orders/${orderId}/status`, { status: newStatus }, {
        withCredentials: true,
      });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      setFilteredOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success("Order status updated successfully!");
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update order status.");
    }
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Order List</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search orders..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Quantity</th> {/* ✅ NEW Quantity */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {filteredOrders.map((order) => (
              <motion.tr
                key={order._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Product Image + Name */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 flex gap-2 items-center">
                  <img
                    src={order.productId?.image ? `http://localhost:4000/uploads/${order.productId.image}` : "/default-image.jpg"}
                    alt="Product img"
                    className="size-10 rounded-full"
                  />
                  {order.productId?.name || "Unknown Product"}
                </td>

                {/* Customer Name */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                  {order.deliveryInfo.firstName} {order.deliveryInfo.lastName}
                </td>

                {/* Address */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {order.deliveryInfo.address}
                </td>

                {/* Phone */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {order.deliveryInfo.phone}
                </td>

                {/* Quantity */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {order.quantity}
                </td>

                {/* Status Dropdown */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="bg-gray-700 text-white rounded-lg py-1 px-2 focus:outline-none"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Deliverd">Deliverd</option>
                  </select>
                </td>

                {/* Order Date */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default OrdersTable;
