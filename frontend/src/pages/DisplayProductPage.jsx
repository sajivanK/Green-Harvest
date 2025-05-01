

import React, { useEffect, useState, useRef } from 'react';
import axiosApi from '../config/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart,ChevronLeft, ChevronRight } from 'lucide-react';
import logo from '../assets/logo.png';
import { product_list } from '../assets/assets';

const DisplayProductPage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [isSmartBuyerEnabled, setIsSmartBuyerEnabled] = useState(() => !!localStorage.getItem('smartBuyerList') || !!localStorage.getItem('smartBuyerRecipeList'));
  const [activeSmartBuyerTab, setActiveSmartBuyerTab] = useState('list');
  const [listItems, setListItems] = useState(() => JSON.parse(localStorage.getItem('smartBuyerList')) || ['']);
  const [recipeText, setRecipeText] = useState('');
  const [recipeKeywords, setRecipeKeywords] = useState(() => JSON.parse(localStorage.getItem('smartBuyerRecipeList')) || []);
  const [permanentItems, setPermanentItems] = useState(['']);
  const [permanentFilterEnabled, setPermanentFilterEnabled] = useState(false);
  const [filterListActive, setFilterListActive] = useState(!!localStorage.getItem('smartBuyerList'));
  const [filterRecipeActive, setFilterRecipeActive] = useState(!!localStorage.getItem('smartBuyerRecipeList'));
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  //last
  const [slideIndexMap, setSlideIndexMap] = useState({});

  const navigate = useNavigate();
  const productsRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosApi.get('/api/products/all', { withCredentials: true });
        if (response.data.success) {
          setProducts(response.data.products);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch products');
      }
    };

    const fetchPermanentItems = async () => {
      try {
        const response = await axiosApi.get('/api/permanent-items', { withCredentials: true });
        if (response.data.success) {
          setPermanentItems(response.data.items.length > 0 ? response.data.items : ['']);
        }
      } catch (err) {
        console.error('Could not fetch permanent items', err);
      }
    };

    fetchProducts();
    fetchPermanentItems();
  }, []);

  const handleSavePermanentItems = async () => {
    const filtered = permanentItems.filter((item) => item.trim() !== '');
    try {
      const response = await axiosApi.post('/api/permanent-items', { items: filtered }, { withCredentials: true });
      setPermanentItems(response.data.items.length > 0 ? response.data.items : ['']);
    } catch (err) {
      console.error('Failed to save permanent items:', err);
    }
  };

  const handleClearPermanentItems = async () => {
    try {
      await axiosApi.delete('/api/permanent-items', { withCredentials: true });
      setPermanentItems(['']);
    } catch (err) {
      console.error('Failed to delete permanent items:', err);
    }
  };
  const handleSmartBuyerToggle = () => {
    const updated = !isSmartBuyerEnabled;
    setIsSmartBuyerEnabled(updated);
  
    if (!updated) {
      setFilterListActive(false);
      setFilterRecipeActive(false);
      setPermanentFilterEnabled(false);
      localStorage.removeItem('smartBuyerList');
      localStorage.removeItem('smartBuyerRecipeList');
    }
  };
  

  const handlePermanentFilterToggle = () => {
    const updated = !permanentFilterEnabled;
    setPermanentFilterEnabled(updated);
    console.log('✅ Filter toggled:', updated);
    console.log('🧾 Permanent items:', permanentItems);
    console.log('📦 All products:', products.map(p => p.name));
  };
  

  const handleListItemChange = (type, index, value) => {
    if (type === 'list') {
      const updated = [...listItems];
      updated[index] = value;
      if (index === updated.length - 1 && value.trim() !== '') updated.push('');
      setListItems(updated);
      localStorage.setItem('smartBuyerList', JSON.stringify(updated.filter(item => item.trim() !== '')));
    } else if (type === 'permanent') {
      const updated = [...permanentItems];
      updated[index] = value;
      if (index === updated.length - 1 && value.trim() !== '') updated.push('');
      setPermanentItems(updated);
      localStorage.setItem('permanentItems', JSON.stringify(updated));
    }
  };

  const handleFilterList = () => {
    setFilterListActive(true);
    setFilterRecipeActive(false);
    localStorage.setItem('smartBuyerList', JSON.stringify(listItems.filter(item => item.trim() !== '')));
    localStorage.removeItem('smartBuyerRecipeList');
  };

  const handleClearList = () => {
    setListItems(['']);
    setFilterListActive(false);
    localStorage.removeItem('smartBuyerList');
  };

  const handleRecipeTextChange = (e) => {
    setRecipeText(e.target.value);
  };

  const extractKeywordsFromRecipe = () => {
    const cleaned = recipeText
      .toLowerCase()
      .replace(/\d+/g, '')
      .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2);
    return [...new Set(cleaned)];
  };

  const handleFilterRecipe = () => {
    const keywords = extractKeywordsFromRecipe();
    setRecipeKeywords(keywords);
    localStorage.setItem('smartBuyerRecipeList', JSON.stringify(keywords));
    localStorage.removeItem('smartBuyerList');
    setFilterRecipeActive(true);
    setFilterListActive(false);
  };

  const handleClearRecipe = () => {
    setRecipeText('');
    setRecipeKeywords([]);
    setFilterRecipeActive(false);
    localStorage.removeItem('smartBuyerRecipeList');
  };

  const handleScrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCategoryClick = (index) => {
    setActiveCategory(activeCategory === index ? null : index);
  };

  const filteredProducts = (
    activeCategory !== null
      ? products.filter((product) => product.category === product_list[activeCategory].product_name)
      : filterListActive
        ? products.filter(product =>
            listItems.some(item =>
              item &&
              (product.name.toLowerCase().includes(item.toLowerCase()) ||
               product.category.toLowerCase().includes(item.toLowerCase()))
            )
          )
        : filterRecipeActive
          ? products.filter(product =>
              recipeKeywords.some(keyword =>
                product.name.toLowerCase().includes(keyword.toLowerCase()) ||
                product.category.toLowerCase().includes(keyword.toLowerCase())
              )
            )
          : permanentFilterEnabled
            ? products.filter(product =>
                permanentItems.some(item =>
                  product.name?.toLowerCase().includes(item?.toLowerCase().trim())
                )
              )
            : products
  ).filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );


  //last
  const handleSlideChange = (productId, direction) => {
    setSlideIndexMap((prev) => {
      const current = prev[productId] || 0;
      const next = (current + direction + 2) % 2;
      return { ...prev, [productId]: next };
    });
  };
  
  


  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between p-4 bg-gray-800 shadow-md">
        <img src={logo} alt="Logo" className="h-10 w-auto" />
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-white hover:text-blue-400 text-sm font-medium">Home</Link>
          <Link to="/my-orders" className="text-white hover:text-blue-400 text-sm font-medium">My Orders</Link>
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

      {/* Search Filter under Category */}
      <div className="p-4 text-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by product or category"
          className="w-full max-w-md px-4 py-2 rounded bg-gray-700 text-white"
        />
      </div>

      {/* Smart Buyer Toggle */}
      <div className="text-center py-6">
        <h3 className="text-xl text-white mb-4">Smart Buyer Option</h3>
        <button
          onClick={handleSmartBuyerToggle}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold"
        >
          {isSmartBuyerEnabled ? 'Disable Smart Buyer Option' : 'Enable Smart Buyer Option'}
        </button>
      </div>

      {/* Smart Buyer Dashboard */}
      {isSmartBuyerEnabled && (
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex justify-center gap-4 mb-6">
            <button onClick={() => setActiveSmartBuyerTab('list')} className={`px-4 py-2 rounded ${activeSmartBuyerTab === 'list' ? 'bg-green-600' : 'bg-gray-700'}`}>Add List</button>
            <button onClick={() => setActiveSmartBuyerTab('recipe')} className={`px-4 py-2 rounded ${activeSmartBuyerTab === 'recipe' ? 'bg-green-600' : 'bg-gray-700'}`}>Add Recipe</button>
            <button onClick={() => setActiveSmartBuyerTab('permanent')} className={`px-4 py-2 rounded ${activeSmartBuyerTab === 'permanent' ? 'bg-green-600' : 'bg-gray-700'}`}>Permanent Items</button>
          </div>

          <div className="transition-all duration-500">
            {activeSmartBuyerTab === 'list' && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-lg font-semibold mb-2">Add Your List</h4>
                {listItems.map((item, index) => (
                  <input
                    key={index}
                    type="text"
                    value={item}
                    onChange={(e) => handleListItemChange('list', index, e.target.value)}
                    placeholder={`Item ${index + 1}`}
                    className="block w-full my-2 p-2 rounded bg-gray-700 text-white"
                  />
                ))}
                <div className="flex gap-4 mt-4">
                  <button onClick={handleFilterList} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded">Filter List</button>
                  <button onClick={handleClearList} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">Clear List</button>
                </div>
              </div>
            )}

            {activeSmartBuyerTab === 'recipe' && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-lg font-semibold mb-2">Paste Your Recipe</h4>
                <textarea
                  value={recipeText}
                  onChange={handleRecipeTextChange}
                  placeholder="Paste your full recipe here..."
                  className="w-full h-40 p-3 rounded bg-gray-700 text-white"
                />
                <div className="flex gap-4 mt-4">
                  <button onClick={handleFilterRecipe} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded">Filter Ingredients</button>
                  <button onClick={handleClearRecipe} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">Clear Recipe</button>
                </div>
              </div>
            )}

            {activeSmartBuyerTab === 'permanent' && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-lg font-semibold mb-2">Permanent Item List</h4>
                {permanentItems.map((item, index) => (
                  <input
                    key={index}
                    type="text"
                    value={item}
                    onChange={(e) => handleListItemChange('permanent', index, e.target.value)}
                    placeholder={`Permanent Item ${index + 1}`}
                    className="block w-full my-2 p-2 rounded bg-gray-700 text-white"
                  />
                ))}
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={handleSavePermanentItems}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                  >
                    Save Permanent Items
                  </button>
                  <button
                    onClick={handleClearPermanentItems}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                  >
                    Clear Permanent Items
                  </button>
                </div>

                <div className="flex items-center mt-4">
                  <input type="checkbox" checked={permanentFilterEnabled} onChange={handlePermanentFilterToggle} className="mr-2" />
                  <label>Enable Permanent List Filter</label>
                </div>

              </div>
            )}
          </div>
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
              {/*<div className="h-48 w-full overflow-hidden">
                <img
                  src={`http://localhost:4000/uploads/${product.image}`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>*/}

              <div className="relative h-48 w-full bg-white">
                <div className="absolute inset-0 z-0">
                  {slideIndexMap[product._id] === 1 ? (
                    <img
                      src={product.qrCode}
                      alt="QR Code"
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <img
                      src={`http://localhost:4000/uploads/${product.image}`}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <button
                  onClick={() => handleSlideChange(product._id, -1)}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-60 text-white rounded-full w-8 h-8 flex items-center justify-center z-30 hover:bg-gray-800"
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  onClick={() => handleSlideChange(product._id, 1)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-60 text-white rounded-full w-8 h-8 flex items-center justify-center z-30 hover:bg-gray-800"
                >
                  <ChevronRight size={20} />
                </button>
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

