
import React, { useEffect, useState, useRef } from 'react';
import axiosApi from '../config/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import logo from '../assets/logo.png';
import { product_list } from '../assets/assets';

const DisplayProductPage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [isSmartBuyerEnabled, setIsSmartBuyerEnabled] = useState(false);
  const [smartBuyerOption, setSmartBuyerOption] = useState(null);
  const [listItems, setListItems] = useState(['']);
  const [activeCategory, setActiveCategory] = useState(null);
  const navigate = useNavigate();
  const productsRef = useRef(null);

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

  const handleSmartBuyerToggle = () => {
    if (isSmartBuyerEnabled) setSmartBuyerOption(null);
    setIsSmartBuyerEnabled(!isSmartBuyerEnabled);
  };

  const handleListItemChange = (index, value) => {
    const updatedItems = [...listItems];
    updatedItems[index] = value;
    if (index === updatedItems.length - 1 && value.trim() !== '') {
      updatedItems.push('');
    }
    setListItems(updatedItems);
  };

  const handleScrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCategoryClick = (index) => {
    setActiveCategory(activeCategory === index ? null : index);
  };

  const filteredProducts = activeCategory !== null
    ? products.filter((product) => product.category === product_list[activeCategory].product_name)
    : products;

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between p-4 bg-gray-800 shadow-md">
        <img src={logo} alt="Logo" className="h-10 w-auto" />
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-white hover:text-blue-400 text-sm font-medium">Home</Link>
          <Link to="/myorders" className="text-white hover:text-blue-400 text-sm font-medium">My Orders</Link>
          <Link to="/display-package" className="text-white hover:text-blue-400 text-sm font-medium">Package</Link>
          <Link to="/about" className="text-white hover:text-blue-400 text-sm font-medium">About</Link>
          <Link to="/profile" className="text-white hover:text-blue-400 text-sm font-medium">Profile</Link>
          <Link to="/login" className="text-white hover:text-blue-400 text-sm font-medium">LogIn</Link>
          <Link to="/cart" className="text-white hover:text-blue-400">
            <ShoppingCart size={20} />
          </Link>
          <button
            onClick={() => navigate('/view-workers')}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm font-semibold"
          >
            SmartWaste
          </button>
        </div>
      </nav>

      {/* Header Section */}
      <div
        className="relative h-[60vh] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: 'url("/header_img.jpg")' }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h2 className="text-4xl font-bold mb-4">Order Your Favourite Food Here</h2>
          <p className="text-lg mb-6">Fresh, quality groceries — just a click away</p>
          <button
            onClick={handleScrollToProducts}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded text-sm font-semibold transition duration-300"
          >
            View Products
          </button>
        </div>
      </div>

      {/* Smart Buyer Option Toggle */}
      <div className="text-center py-6">
        <h3 className="text-xl text-white mb-4">Smart Buyer Option</h3>
        <button
          onClick={handleSmartBuyerToggle}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold"
        >
          {isSmartBuyerEnabled ? 'Disable Smart Buyer Option' : 'Enable Smart Buyer Option'}
        </button>
      </div>

      {/* Smart Buyer Option Input (List Only) */}
      {isSmartBuyerEnabled && (
        <div className="text-center py-4">
          <button
            onClick={() => setSmartBuyerOption('Option1')}
            className={`${
              smartBuyerOption === 'Option1' ? 'bg-green-700' : 'bg-green-600'
            } hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-semibold`}
          >
            Add your list
          </button>
        </div>
      )}

      {smartBuyerOption === 'Option1' && (
        <div className="p-10 bg-gray-800 text-white rounded-lg max-w-xl mx-auto mb-10">
          <h4 className="text-2xl font-semibold mb-6">Add your List</h4>
          <form>
            {listItems.map((item, index) => (
              <div key={index} className="mb-4">
                <label className="block text-lg mb-1">Item {index + 1}</label>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleListItemChange(index, e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-600 bg-gray-900 text-white"
                  placeholder={`Enter item ${index + 1}`}
                />
              </div>
            ))}
          </form>
        </div>
      )}

      {/* Category Section */}
      <div className="py-10 text-center bg-gray-900">
        <h2 className="text-2xl font-semibold mb-6">Shop by Category</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {product_list.map((cat, index) => (
            <div
              key={cat.product_name}
              onClick={() => handleCategoryClick(index)}
              className={`cursor-pointer p-3 rounded-full border-4 transition duration-300 ${
                activeCategory === index ? 'border-green-500' : 'border-transparent'
              }`}
            >
              <img src={cat.product_image} alt={cat.product_name} className="w-24 h-24 object-cover rounded-full" />
              <p className="text-sm mt-2">{cat.product_name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div ref={productsRef} className="p-10 bg-gray-900">
        <h1 className="text-3xl text-blue-900 font-bold mb-6">Available Products</h1>
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
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
    </div>
  );
};

export default DisplayProductPage;
