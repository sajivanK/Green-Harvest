import React, { useEffect, useState } from 'react';
import axiosApi from '../config/axiosConfig';

const DisplayPackagePage = () => {
    const [packages, setPackages] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await axiosApi.get('/api/package/all', {
                    withCredentials: true, // Ensures authentication
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

    const handleSubscribe = (packageId) => {
        alert(`Subscribed to package: ${packageId}`);
        // Add subscription logic here (API call to backend)
    };

    return (
        <div className="p-6 bg-gray-900 text-white">
            <h1 className="text-3xl font-bold mb-6">Available Subscription Packages</h1>

            {error && <p className="text-red-500">{error}</p>}

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

                        <button
                            onClick={() => handleSubscribe(pkg._id)}
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
