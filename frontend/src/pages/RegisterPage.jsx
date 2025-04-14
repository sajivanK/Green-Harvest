import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosApi from '../config/axiosConfig';

const RegisterPage = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        address: '',
    });

    const navigate = useNavigate();

    // ✅ Redirect if already logged in
    useEffect(() => {
        const checkLogin = async () => {
            try {
                const response = await axiosApi.get('/api/auth/check');
                if (response.data.success) {
                    navigate('/');
                }
            } catch {
                // Not logged in, stay on register page
            }
        };

        checkLogin();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosApi.post('/api/auth/register', form, {
                withCredentials: true,
            });

            if (response.data.success) {
                // Auto-login after successful registration
                navigate('/');
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Registration failed:', error.response?.data || error.message);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-900">
            <form
                onSubmit={handleRegister}
                className="bg-gray-800 p-6 rounded-lg shadow-lg w-96"
            >
                <h2 className="text-2xl font-bold text-white mb-4">Register</h2>

                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full mb-4 p-2 bg-gray-700 text-white rounded"
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full mb-4 p-2 bg-gray-700 text-white rounded"
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full mb-4 p-2 bg-gray-700 text-white rounded"
                    required
                />
                <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={form.address}
                    onChange={handleChange}
                    className="w-full mb-4 p-2 bg-gray-700 text-white rounded"
                    required
                />
                <button type="submit" className="w-full bg-green-500 p-2 rounded text-white">
                    Register
                </button>
            </form>
        </div>
    );
};

export default RegisterPage;
