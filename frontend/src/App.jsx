import { Route, Routes, useLocation } from 'react-router-dom';
import OverviewPage from './pages/OverviewPage';
import ProductPage from './pages/ProductPage';
import Sidebar from './components/common/Sidebar';
import UsersPage from './pages/UsersPage';
import AddProductPage from './pages/AddProductPage';
import OrdersPage from './pages/OrdersPage';
import SettingPage from './pages/SettingPage';
import PackagePage from './pages/packagePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FarmerRegistration from './pages/FarmerRegistration';
import DisplayProductPage from './pages/DisplayProductPage';
import DisplayPackagePage from './pages/DisplayPackagePage';
import ChatBot from './pages/Chatbot';
import BuyNowPage from './pages/BuyNowPage';
import PaymentPage from './pages/PaymentPage';
import CartPage from './pages/CartPage';

function App() {
  const location = useLocation();

  // ✅ Include '/register-farmer' as an auth page to hide sidebar and background
  //const isAuthPage = ['/login', '/register', '/register-farmer', '/display-product','/display-package',].includes(location.pathname);

  const isAuthPage = [
    '/login',
    '/register',
    '/register-farmer',
    '/display-product',
    '/display-package',
    '/payment',
    '/cart'
  ].some(path => location.pathname.startsWith(path) || location.pathname.startsWith('/buy-product/'));
  

  return (
    <div className='flex h-screen bg-gray-900 text-gray-100'>
      
      {/* ✅ Conditional Background */}
      {!isAuthPage && (
        <div className='fixed inset-0 z-0'>
          <div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
          <div className='absolute inset-0 backdrop-blur-sm' />
        </div>
      )}

      {/* ✅ Conditional Sidebar */}
      {!isAuthPage && <Sidebar />}

      <Routes>
        {/* ✅ Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register-farmer" element={<FarmerRegistration />} />
        <Route path='/display-product' element={<DisplayProductPage />} />
        <Route path='/display-package' element={<DisplayPackagePage />} />
        <Route path='/cart' element={<CartPage />} />
      
      

        {/* ✅ Protected Routes */}
        <Route path='/' element={<OverviewPage />} />
        <Route path='/products' element={<ProductPage />} />
        <Route path='/users' element={<UsersPage />} />
        <Route path='/orders' element={<OrdersPage />} />
        <Route path='/add-product' element={<AddProductPage />} />
        <Route path='/add-package' element={<PackagePage />} />
        <Route path='/chatbot' element={<ChatBot />} />
        <Route path='/settings' element={<SettingPage />} />
        <Route path="/buy-product/:id" element={<BuyNowPage />} />
        <Route path="/payment" element={<PaymentPage />} />
      </Routes>
    </div>
  );
}

export default App;
