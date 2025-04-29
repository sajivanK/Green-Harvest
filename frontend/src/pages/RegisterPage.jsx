
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosApi from '../config/axiosConfig';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await axiosApi.get('/api/auth/check', { withCredentials: true });
        if (response.data.success) {
          const roles = response.data.user.roles || [];
          redirectToRolePage(roles);
        }
      } catch {
        // stay on page
      }
    };
    checkLogin();
  }, [navigate]);

  const redirectToRolePage = (roles) => {
    if (roles.includes("Worker")) {
      navigate("/dashboard");
    } else if (roles.includes("Farmer")) {
      navigate("/overview");
    } else {
      navigate("/");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (form.name.length < 2) return toast.error("Name must be at least 2 characters");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return toast.error("Invalid email address");
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters");
    if (form.address.trim() === '') return toast.error("Address is required");

    try {
      const response = await axiosApi.post('/api/auth/register', form, { withCredentials: true });

      if (response.data.success) {
        const roles = response.data.roles || [];
        redirectToRolePage(roles);
      } else {
        toast.error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred during registration');
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-green-800 to-white'>
      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>Create Account</h2>
        <p className='text-center text-sm text-[#e2eeeb] mb-6'>Register to access the platform</p>

        <form onSubmit={handleRegister}>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#115a4b]">
            <img src={assets.person_icon} alt="" />
            <input
              name="name"
              onChange={handleChange}
              value={form.name}
              className='bg-transparent outline-none text-white placeholder:text-indigo-200 w-full'
              type="text"
              placeholder='Full Name'
              required
            />
          </div>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#115a4b]'>
            <img src={assets.mail_icon} alt="" />
            <input
              name="email"
              onChange={handleChange}
              value={form.email}
              className='bg-transparent outline-none text-white placeholder:text-indigo-200 w-full'
              type="email"
              placeholder='Email'
              required
            />
          </div>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#115a4b]'>
            <img src={assets.lock_icon} alt="" />
            <input
              name="password"
              onChange={handleChange}
              value={form.password}
              className='bg-transparent outline-none text-white placeholder:text-indigo-200 w-full'
              type="password"
              placeholder='Password'
              required
            />
          </div>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#115a4b]'>
            <img src={assets.location_icon || assets.person_icon} alt="" />
            <input
              name="address"
              onChange={handleChange}
              value={form.address}
              className='bg-transparent outline-none text-white placeholder:text-indigo-200 w-full'
              type="text"
              placeholder='Address'
              required
            />
          </div>

          <button className="w-full py-2.5 rounded-full bg-[#092f2c] text-white font-bold mt-2">
            Register
          </button>
        </form>

        <p className='text-gray-400 text-center text-xs mt-4'>
          Already have an account?{' '}
          <span onClick={() => navigate('/login')} className='text-blue-400 cursor-pointer underline'>Login</span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
