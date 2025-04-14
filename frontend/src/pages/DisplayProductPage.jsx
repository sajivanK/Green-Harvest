import React, { useEffect, useState } from 'react';
import axiosApi from '../config/axiosConfig';
import { useNavigate } from 'react-router-dom';

const DisplayProductPage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosApi.get('/api/products/all', {
          withCredentials: true,
        });

        if (response.data.success) {
          setProducts(response.data.products);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch products');
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="p-10 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Available Products</h1>
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white text-gray-900 rounded-2xl shadow-lg overflow-hidden transition-transform transform hover:scale-[1.02] duration-300"
          >
            <div className="h-48 w-full overflow-hidden">
              <img
                src={`http://localhost:4000/uploads/${product.image}`}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4 space-y-2">
              <div className="flex justify-between items-center">
                <h2 className="text-xl text-blue-600 font-semibold">{product.name}</h2>
                {/* Optional: Rating placeholder */}
                {/* <img src="/assets/stars.png" alt="Rating" className="w-20 h-5 object-contain" /> */}
              </div>

              <p className="text-sm text-gray-600">{product.description}</p>
              <p className="text-green-600 font-bold text-lg">
                Rs. {Number(product.price).toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">Stock: {product.stock}</p>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => navigate(`/buy-product/${product._id}`)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayProductPage;
