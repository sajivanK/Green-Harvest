import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import { QRCodeCanvas } from "qrcode.react";
import axiosApi from "../config/axiosConfig";
import { useLocation, useNavigate } from "react-router-dom";

const CATEGORY_OPTIONS = ["Fruits", "Vegetables", "Grains", "Dairy", "Meat", "Spices", "Others"];

const AddNewProductPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editingProduct = location.state?.product || null;

  const initialProductState = {
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    image: null,
    qrCode: "",
  };

  const [product, setProduct] = useState(editingProduct || initialProductState);
  const qrCodeRef = useRef();
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingProduct) {
      setProduct(editingProduct);
    }
  }, [editingProduct]);

  const validateForm = () => {
    const newErrors = {};
    if (!product.name.trim()) newErrors.name = "Product name is required.";
    if (!product.category.trim()) newErrors.category = "Category is required.";
    if (!product.price) newErrors.price = "Price is required.";
    if (product.price <= 0) newErrors.price = "Price must be greater than zero.";
    if (!product.stock) newErrors.stock = "Stock quantity is required.";
    if (product.stock < 0) newErrors.stock = "Stock cannot be negative.";
    if (!product.image) newErrors.image = "Product image is required.";
    return newErrors;
};


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setProduct((prev) => ({ ...prev, image: files[0] }));
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const canvas = qrCodeRef.current.querySelector("canvas");
    const qrCodeDataUrl = canvas.toDataURL();

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("category", product.category);
    formData.append("price", product.price);
    formData.append("stock", product.stock);
    formData.append("description", product.description);
    if (product.image && typeof product.image !== "string") {
      formData.append("image", product.image);
    }
    formData.append("qrCode", qrCodeDataUrl);

    try {
      if (editingProduct) {
        await axiosApi.patch(`/api/products/update/${editingProduct._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        alert("Product updated successfully.");
      } else {
        await axiosApi.post("/api/products/create", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        alert("Product added successfully.");
      }

      navigate("/products");
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title={editingProduct ? "Edit Product" : "Add New Product"} />
      <main className="max-w-4xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              placeholder="Product Name"
              className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            <select
              name="category"
              value={product.category}
              onChange={handleChange}
              className="w-full bg-gray-700 text-white rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>
                Select Category
              </option>
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category}</p>}
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              placeholder="Price"
              className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.price && <p className="text-red-400 text-sm mt-1">{errors.price}</p>}
            <input
              type="number"
              name="stock"
              value={product.stock}
              onChange={handleChange}
              placeholder="Stock"
              className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.stock && <p className="text-red-400 text-sm mt-1">{errors.stock}</p>} 
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full bg-gray-700 text-white rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {errors.image && <p className="text-red-400 text-sm mt-1">{errors.image}</p>}

            <div ref={qrCodeRef} className="hidden">
              <QRCodeCanvas value={`${product.name}-${product.category}-${product.price}`} />
            </div>

            <button
              type="submit"
              className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {editingProduct ? "Update Product" : "Add Product"}
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default AddNewProductPage;
