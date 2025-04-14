// pages/LoginPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosApi from '../config/axiosConfig';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // ✅ Check if the user is already logged in
    useEffect(() => {
        const checkLogin = async () => {
            try {
                const response = await axiosApi.get('/api/auth/check');
                if (response.data.success) {
                    navigate('/');
                }
            } catch {
                // Not logged in, stay on login page
            }
        };

        checkLogin();
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosApi.post('/api/auth/login', { email, password });
            if (response.data.success) {
                navigate('/');
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Login failed:', error.response?.data || error.message);
        }
    };

    return (
        <div className="pl-76 flex items-center justify-center h-screen bg-gray-900 px-6">
            <form
                onSubmit={handleLogin}
                className="bg-gray-800 p-6 rounded-lg shadow-lg w-96"
            >
                <h2 className="text-2xl font-bold text-white mb-4">Login</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-4 p-2 bg-gray-700 text-white rounded"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-4 p-2 bg-gray-700 text-white rounded"
                    required
                />
                <button type="submit" className="w-full bg-green-500 p-2 rounded text-white">
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
