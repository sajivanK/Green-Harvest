

// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axiosApi from '../config/axiosConfig';

// const LoginPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkLogin = async () => {
//       try {
//         const response = await axiosApi.get('/api/auth/check', { withCredentials: true });
//         if (response.data.success) {
//           const userRoles = response.data.user.roles || [];
//           redirectToRolePage(userRoles);
//         }
//       } catch {
//         // User not logged in, stay here
//       }
//     };

//     checkLogin();
//   }, [navigate]);

//   const redirectToRolePage = (roles) => {
//     if (roles.includes("Worker")) {
//       navigate("/dashboard");
//     } else if (roles.includes("Farmer")) {
//       navigate("/overview");
//     } else {
//       navigate("/");
//     }
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axiosApi.post('/api/auth/login', { email, password }, {
//         withCredentials: true,
//       });

//       if (response.data.success) {
//         const roles = response.data.roles || [];
//         redirectToRolePage(roles);
//       } else {
//         console.error(response.data.message);
//       }
//     } catch (error) {
//       console.error('Login failed:', error.response?.data || error.message);
//     }
//   };

//   return (
//     <div className="pl-76 flex items-center justify-center h-screen bg-gray-900 px-6">
//       <form
//         onSubmit={handleLogin}
//         className="bg-gray-800 p-6 rounded-lg shadow-lg w-96"
//       >
//         <h2 className="text-2xl font-bold text-white mb-4">Login</h2>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full mb-4 p-2 bg-gray-700 text-white rounded"
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full mb-4 p-2 bg-gray-700 text-white rounded"
//           required
//         />
//         <button type="submit" className="w-full bg-green-500 p-2 rounded text-white">
//           Login
//         </button>
//       </form>
//     </div>
//   );
// };

// export default LoginPage;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosApi from '../config/axiosConfig';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await axiosApi.get('/api/auth/check', { withCredentials: true });
        if (response.data.success) {
          const userRoles = response.data.user.roles || [];
          redirectToRolePage(userRoles);
        }
      } catch {
        // User not logged in, stay here
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

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosApi.post('/api/auth/login', { email, password }, {
        withCredentials: true,
      });

      if (response.data.success) {
        const roles = response.data.roles || [];
        redirectToRolePage(roles);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-green-800 to-white'>
      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>Login</h2>
        <p className='text-center text-sm text-[#e2eeeb] mb-6'>Login to your account</p>

        <form onSubmit={handleLogin}>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#115a4b]'>
            <img src={assets.mail_icon} alt="" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='bg-transparent outline-none text-white placeholder:text-indigo-200 w-full'
              placeholder='Email'
              required
            />
          </div>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#115a4b]'>
            <img src={assets.lock_icon} alt="" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='bg-transparent outline-none text-white placeholder:text-indigo-200 w-full'
              placeholder='Password'
              required
            />
          </div>

          <p
            onClick={() => navigate('/reset-password')}
            className='mb-4 text-sm text-[#9bdccf] cursor-pointer'
          >
            Forgot password?
          </p>

          <button className="w-full py-2.5 rounded-full bg-[#092f2c] text-white font-bold">
            Login
          </button>
        </form>

        <p className='text-gray-400 text-center text-xs mt-4'>
          Don't have an account?{' '}
          <span onClick={() => navigate('/register')} className='text-blue-400 cursor-pointer underline'>
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;