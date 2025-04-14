import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import axiosApi from "../../config/axiosConfig";

const SubscriptionForm = ({ onSubmit, editingPackage, setEditingPackage, fetchPackages }) => {
  const [form, setForm] = useState({
    packageName: "",
    description: "",
    image: null, // ✅ Now handles image properly
    price: "",
    duration: "",
    deliveryFrequency: "",
    products: [
      { productName: "", quantity: "" },
      { productName: "", quantity: "" },
      { productName: "", quantity: "" },
    ],
  });

  useEffect(() => {
    if (editingPackage) {
      setForm({
        ...editingPackage,
        image: null, // ✅ Keep existing image unless a new one is uploaded
      });
    }
  }, [editingPackage]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...form.products];
    updatedProducts[index][field] = value;
    setForm({ ...form, products: updatedProducts });
  };

  const addProductField = () => {
    setForm({ ...form, products: [...form.products, { productName: "", quantity: "" }] });
  };

  const validateForm = () => {
    if (!form.packageName || !form.description || !form.price || !form.duration || !form.deliveryFrequency) {
      alert("Please fill all required fields.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("packageName", form.packageName);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("duration", form.duration);
    formData.append("deliveryFrequency", form.deliveryFrequency);
    formData.append("products", JSON.stringify(form.products));

    if (form.image) {
      formData.append("image", form.image); // ✅ Only add image if a new file is selected
    }

    console.log("🔹 Sending Form Data:", Object.fromEntries(formData.entries()));

    try {
      let response;
      if (editingPackage && editingPackage._id) {
        response = await axiosApi.patch(`/api/package/update/${editingPackage._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        console.log("✅ Package updated:", response.data);
        alert("Package updated successfully.");
      } else {
        response = await axiosApi.post("/api/package/create", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        console.log("✅ Package created:", response.data);
        alert("Package created successfully.");
      }

      fetchPackages();
      setEditingPackage(null);
      setForm({
        packageName: "",
        description: "",
        image: null,
        price: "",
        duration: "",
        deliveryFrequency: "",
        products: [
          { productName: "", quantity: "" },
          { productName: "", quantity: "" },
          { productName: "", quantity: "" },
        ],
      });
    } catch (error) {
      console.error("❌ Failed to process package:", error.response?.data || error.message);
      alert(`Error: ${error.response?.data?.message || "Failed to update package"}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        id="packageName"
        name="packageName"
        placeholder="Package Name"
        className="w-full bg-gray-700 text-white rounded-lg p-4"
        value={form.packageName}
        onChange={handleChange}
        required
      />

      <textarea
        id="description"
        name="description"
        placeholder="Description"
        className="w-full bg-gray-700 text-white rounded-lg p-4"
        value={form.description}
        onChange={handleChange}
        required
      />

      <input
        type="file"
        id="image"
        name="image"
        accept="image/*"
        className="w-full bg-gray-700 text-white rounded-lg p-4"
        onChange={handleChange}
      />

      <input
        type="number"
        id="price"
        name="price"
        placeholder="Price"
        className="w-full bg-gray-700 text-white rounded-lg p-4"
        value={form.price}
        onChange={handleChange}
        required
      />

      <select
        id="duration"
        name="duration"
        className="w-full bg-gray-700 text-white rounded-lg p-4"
        value={form.duration}
        onChange={handleChange}
        required
      >
        <option value="">Select Duration</option>
        <option value="Weekly">Weekly</option>
        <option value="Monthly">Monthly</option>
        <option value="Quarterly">Quarterly</option>
      </select>

      <select
        id="deliveryFrequency"
        name="deliveryFrequency"
        className="w-full bg-gray-700 text-white rounded-lg p-4"
        value={form.deliveryFrequency}
        onChange={handleChange}
        required
      >
        <option value="">Select Delivery Frequency</option>
        <option value="Daily">Daily</option>
        <option value="Weekly">Weekly</option>
        <option value="Monthly">Monthly</option>
      </select>

      {form.products.map((product, index) => (
        <div key={index} className="flex gap-2">
          <input
            type="text"
            id={`productName-${index}`}
            name={`productName-${index}`}
            placeholder="Product Name"
            className="w-1/2 bg-gray-700 text-white rounded-lg p-4"
            value={product.productName}
            onChange={(e) => handleProductChange(index, "productName", e.target.value)}
            required
          />

          <input
            type="number"
            id={`quantity-${index}`}
            name={`quantity-${index}`}
            placeholder="Quantity"
            className="w-1/2 bg-gray-700 text-white rounded-lg p-4"
            value={product.quantity}
            onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
            required
          />
        </div>
      ))}

      <button type="button" onClick={addProductField} className="flex items-center gap-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500">
        <Plus /> Add More Product
      </button>

      <button type="submit" className="w-full p-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
        {editingPackage ? "Update Package" : "Create Package"}
      </button>
    </form>
  );
};

export default SubscriptionForm;
