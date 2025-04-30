

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axiosApi from "../config/axiosConfig";
// import { toast } from "react-toastify";

// const BuyNowPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [product, setProduct] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const res = await axiosApi.get(`/api/products/${id}`);
//         setProduct(res.data.product);
//       } catch (err) {
//         setError("Product not found");
//       }
//     };
//     fetchProduct();
//   }, [id]);

//   const increaseQty = () => {
//     if (quantity < product.stock) setQuantity(quantity + 1);
//   };

//   const decreaseQty = () => {
//     if (quantity > 1) setQuantity(quantity - 1);
//   };

//   const handleCheckout = () => {
//     navigate("/payment", {
//       state: {
//         from: "buyNow",
//         items: [
//           {
//             productId: product._id,
//             name: product.name,
//             price: product.price,
//             quantity,
//             image: product.image,
//             farmerId: product.farmerId,
//           },
//         ],
//       },
//     });
//   };

//   const handleAddToCart = async () => {
//     try {
//       const res = await axiosApi.post(
//         `/api/cart/add-to-cart`,
//         {
//           productId: product._id,
//           quantity: quantity,
//         },
//         { withCredentials: true }
//       );
  
//       if (res.data.success) {
//         toast.success("Product added to cart successfully!");
//         navigate("/");  // Auto redirect to Product Display Page
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to add product to cart");
//     }
//   };
  

//   if (!product && !error) return <p className="p-4 text-white">Loading product...</p>;
//   if (error) return <p className="p-4 text-red-500">{error}</p>;

//   const total = product.price * quantity;

//   return (
//     <div className="absolute inset-0 bg-gray-900 flex justify-center items-center p-4 z-10">
//       <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row items-center justify-between gap-8">
//         <div className="flex-1 flex justify-center items-center w-82 h-82 overflow-hidden rounded-2xl shadow-lg">
//           <img
//             src={`http://localhost:4000/uploads/${product.image}`}
//             alt={product.name}
//             className="w-full h-full object-cover"
//           />
//         </div>

//         <div className="flex-1 h-full flex flex-col justify-center space-y-4 ml-30">
//           <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
//           <p className="text-gray-600">{product.description}</p>

//           <div className="text-3xl font-bold text-green-600">Rs. {product.price.toFixed(2)}</div>
//           <div className="text-sm text-gray-500">Available Stock: {product.stock}</div>

//           <div className="flex items-center mt-4 space-x-2">
//             <button
//               onClick={decreaseQty}
//               className="px-3 py-1 rounded bg-gray-200 text-lg font-bold text-gray-800"
//             >−</button>
//             <span className="px-4 text-xl text-gray-800">{quantity}</span>
//             <button
//               onClick={increaseQty}
//               className="px-3 py-1 rounded bg-gray-200 text-lg font-bold text-gray-800"
//             >+</button>
//           </div>

//           <div className="text-lg font-medium mt-2 text-gray-800">
//             Total: <span className="text-green-700 font-bold">Rs. {total.toFixed(2)}</span>
//           </div>

//           <div className="flex flex-col w-full md:w-1/2 space-y-2">
//             <button
//               onClick={handleCheckout}
//               className="bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
//             >
//               Checkout Now
//             </button>

//             <button
//               onClick={handleAddToCart}
//               className="bg-orange-600 text-white py-3 rounded hover:bg-orange-700 transition"
//             >
//               Add to Cart
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BuyNowPage;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosApi from "../config/axiosConfig";
import { toast } from "react-toastify";

const BuyNowPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosApi.get(`/api/products/${id}`);
        setProduct(res.data.product);
      } catch (err) {
        setError("Product not found");
      }
    };
    fetchProduct();
  }, [id]);

  const increaseQty = () => {
    if (quantity < product.stock) setQuantity(quantity + 1);
  };

  const decreaseQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleCheckout = () => {
    navigate("/delivery-info", {
      state: {
        from: "buyNow",
        items: [
          {
            productId: product._id,
            name: product.name,
            price: product.price,
            quantity,
            image: product.image,
            farmerId: product.farmerId,
          },
        ],
      },
    });
  };

  const handleAddToCart = async () => {
    try {
      const res = await axiosApi.post(
        `/api/cart/add-to-cart`,
        {
          productId: product._id,
          quantity: quantity,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Product added to cart successfully!");
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add product to cart");
    }
  };

  if (!product && !error) return <p className="p-4 text-white">Loading product...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  const total = product.price * quantity;

  return (
    <div className="absolute inset-0 bg-gray-900 flex justify-center items-center p-4 z-10">

      {/* ✅ BACK BUTTON */}
      <div className="absolute top-4 left-4">
        <button
          onClick={() => navigate("/")}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          ← Back
        </button>
      </div>

      {/* ✅ MAIN PRODUCT CARD */}
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1 flex justify-center items-center w-82 h-82 overflow-hidden rounded-2xl shadow-lg">
          <img
            src={`http://localhost:4000/uploads/${product.image}`}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 h-full flex flex-col justify-center space-y-4 ml-30">
          <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-gray-600">{product.description}</p>

          <div className="text-3xl font-bold text-green-600">Rs. {product.price.toFixed(2)}</div>
          <div className="text-sm text-gray-500">Available Stock: {product.stock}</div>

          <div className="flex items-center mt-4 space-x-2">
            <button
              onClick={decreaseQty}
              className="px-3 py-1 rounded bg-gray-200 text-lg font-bold text-gray-800"
            >−</button>
            <span className="px-4 text-xl text-gray-800">{quantity}</span>
            <button
              onClick={increaseQty}
              className="px-3 py-1 rounded bg-gray-200 text-lg font-bold text-gray-800"
            >+</button>
          </div>

          <div className="text-lg font-medium mt-2 text-gray-800">
            Total: <span className="text-green-700 font-bold">Rs. {total.toFixed(2)}</span>
          </div>

          <div className="flex flex-col w-full md:w-1/2 space-y-2">
            <button
              onClick={handleCheckout}
              className="bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
            >
              Checkout Now
            </button>

            <button
              onClick={handleAddToCart}
              className="bg-orange-600 text-white py-3 rounded hover:bg-orange-700 transition"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default BuyNowPage;
