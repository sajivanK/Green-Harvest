// frontend/pages/CartPage.jsx

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Trash2, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosApi from "../config/axiosConfig";
import { toast } from "react-toastify";

const CartPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axiosApi.get("/api/cart/get-cart", { withCredentials: true });
      setCart(res.data.cart);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleUpdateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    try {
      await axiosApi.patch(
        "/api/cart/update-cart-item",
        { productId, quantity },
        { withCredentials: true }
      );
      fetchCart();
    } catch (err) {
      console.error("Error updating quantity:", err);
      toast.error("Failed to update quantity");
    }
  };

  const handleRemoveItem = async (productId) => {
    if (!window.confirm("Are you sure you want to remove this item?")) return;

    try {
      await axiosApi.delete(`/api/cart/remove-cart-item/${productId}`, {
        withCredentials: true,
      });
      fetchCart();
      toast.success("Item removed from cart");
    } catch (err) {
      console.error("Error removing item:", err);
      toast.error("Failed to remove item");
    }
  };

  const filteredItems = cart?.items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm)
  );

  const totalAmount = filteredItems?.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (!cart) return <p className="p-4 text-white">Loading cart...</p>;

  return (
    <motion.div
    className="min-h-screen p-6 bg-gradient-to-r from-[#1da358] via-[#4c906a] to-[#7ec89e] text-black"      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">My Cart</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search product..."
            className="bg-gray-500 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <p className="text-gray-300">No products found in cart.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700">
              {filteredItems.map((item) => (
                <motion.tr
                  key={item._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 flex gap-2 items-center">
                    <img
                      src={`http://localhost:4000/uploads/${item.image}`}
                      alt="Product"
                      className="size-10 rounded-full"
                    />
                    {item.name}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    Rs. {item.price.toFixed(2)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                        className="bg-gray-600 text-white px-2 rounded"
                      >
                        <Minus size={16} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                        className="bg-gray-600 text-white px-2 rounded"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    Rs. {(item.price * item.quantity).toFixed(2)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <button
                      onClick={() => handleRemoveItem(item.productId)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mt-6">
            <div className="text-gray-100 text-lg font-semibold">
              Grand Total: Rs. {totalAmount.toFixed(2)}
            </div>
          </div>

          <div className="flex justify-end mt-4">
          <button
            onClick={() =>
              navigate("/payment", {
                state: {
                  from: "cart",
                  items: filteredItems,
                  totalAmount: totalAmount,
                },
              })
            }
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300"

          >
            Proceed to Checkout
          </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CartPage;
