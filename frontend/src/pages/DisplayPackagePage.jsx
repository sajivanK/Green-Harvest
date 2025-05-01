
import React, { useEffect, useState } from 'react';
import axiosApi from '../config/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import logo from '../assets/logo.png';

const DisplayPackagePage = () => {
    const [packages, setPackages] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate(); // ✅ Navigation setup

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await axiosApi.get('/api/package/all', {
                    withCredentials: true,
                });

                if (response.data.success) {
                    setPackages(response.data.packages);
                } else {
                    setError(response.data.message);
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch packages');
            }
        };

        fetchPackages();
    }, []);

    // ✅ New updated subscribe handler
    const handleSubscribe = (selectedPackage) => {
        navigate('/subscription-payment', { state: { selectedPackage } });
    };

    return (
        <div className="p-6 bg-gray-900 text-white">

            {/* Navbar */}
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

            {/* Page Heading */}
            <h1 className="text-3xl font-bold mb-6 py-4">Available Subscription Packages</h1>

            {/* Error Message */}
            {error && <p className="text-red-500">{error}</p>}

            {/* Package List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                    <div key={pkg._id} className="p-4 bg-gray-800 rounded-lg shadow-lg">
                        <img
                            src={`http://localhost:4000/uploads/${pkg.image}`}
                            alt={pkg.packageName}
                            className="w-full h-48 object-cover rounded-md mb-4"
                        />
                        <h2 className="text-xl font-semibold">{pkg.packageName}</h2>
                        <p className="text-gray-400">{pkg.description}</p>
                        <p className="text-green-400 font-bold">Price: LKR {pkg.price}</p>
                        <p className="text-gray-400">Duration: {pkg.duration}</p>
                        <p className="text-gray-400">Delivery Frequency: {pkg.deliveryFrequency}</p>

                        {/* ✅ Subscribe Button updated */}
                        <button
                            onClick={() => handleSubscribe(pkg)}
                            className="w-full mt-4 bg-green-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition duration-300"
                        >
                            Subscribe
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DisplayPackagePage;

