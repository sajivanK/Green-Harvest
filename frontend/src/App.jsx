

// // export default App;
// import { Route, Routes, useLocation } from 'react-router-dom';
// import OverviewPage from './pages/OverviewPage';
// import ProductPage from './pages/ProductPage';
// import Sidebar from './components/common/Sidebar';
// import WorkerSidebar from './components/common/WorkerSidebar';
// import UsersPage from './pages/UsersPage';
// import AddProductPage from './pages/AddProductPage';
// import OrdersPage from './pages/OrdersPage';
// import SettingPage from './pages/SettingPage';
// import PackagePage from './pages/packagePage';
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
// import FarmerRegistration from './pages/FarmerRegistration';
// import DisplayProductPage from './pages/DisplayProductPage';
// import DisplayPackagePage from './pages/DisplayPackagePage';
// import ChatBot from './pages/Chatbot';
// import BuyNowPage from './pages/BuyNowPage';
// import PaymentPage from './pages/PaymentPage';
// import CartPage from './pages/CartPage';
// import Signup from './components/Signup';
// import DisplayProof from './pages/DisplayProof';
// import UploadProof from './pages/UploadProof';
// import WorkerDashboard from './pages/WorkerDashboard';
// import CompletedTask from './pages/CompletedTask';
// import Earnings from './pages/Earnings';
// import ProfileSettings from './pages/ProfileSettings';
// import ViewWorkers from "./pages/ViewWorkers"; 

// function App() {
//   const location = useLocation();

//   // Routes that should NOT show any sidebar
//   const isAuthPage = [
//     '/login',
//     '/register',
//     '/register-farmer',
//     '/',
//     '/display-package',
//     '/payment',
//     '/cart',
//     '/view-workers'
//   ].some(path => location.pathname.startsWith(path) || location.pathname.startsWith('/buy-product/'));

//   // Worker-only routes
//   const workerRoutes = [
//     '/dashboard',
//     '/completed',
//     '/earnings',
//     '/profile-settings',
//     '/display-proof',
//     '/upload-proof'
//   ];

//   // Farmer/Admin routes
//   const farmerRoutes = [
//     '/overview',
//     '/products',
//     '/users',
//     '/orders',
//     '/add-product',
//     '/add-package',
//     '/chatbot',
//     '/settings'
//   ];

//   const isWorkerPage = workerRoutes.some(path => location.pathname.startsWith(path));
//   const isFarmerPage = farmerRoutes.some(path => location.pathname.startsWith(path));

//   const showSidebar = isWorkerPage || isFarmerPage;
//   const SidebarComponent = isWorkerPage ? WorkerSidebar : Sidebar;

//   return (
//     <div className="flex h-screen bg-gray-900 text-gray-100">
//       {/* ✅ Background */}
//       {showSidebar && (
//         <div className="fixed inset-0 z-0">
//           <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
//           <div className="absolute inset-0 backdrop-blur-sm" />
//         </div>
//       )}

//       {/* ✅ Sidebar */}
//       {showSidebar && <SidebarComponent />}

//       {/* ✅ Content Wrapper */}
//       <div className={`relative z-10 flex-grow overflow-auto ${isWorkerPage ? 'ml-64 p-6' : ''}`}>
//         <Routes>
//           {/* ✅ Public Routes */}
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/register" element={<RegisterPage />} />
//           <Route path="/register-farmer" element={<FarmerRegistration />} />
//           <Route path="/" element={<DisplayProductPage />} />
//           <Route path="/display-package" element={<DisplayPackagePage />} />
//           <Route path="/cart" element={<CartPage />} />
//           <Route path="/view-workers" element={<ViewWorkers />} />

//           {/* ✅ Farmer/Admin Routes */}
//           <Route path="/overview" element={<OverviewPage />} />
//           <Route path="/products" element={<ProductPage />} />
//           <Route path="/users" element={<UsersPage />} />
//           <Route path="/orders" element={<OrdersPage />} />
//           <Route path="/add-product" element={<AddProductPage />} />
//           <Route path="/add-package" element={<PackagePage />} />
//           <Route path="/chatbot" element={<ChatBot />} />
//           <Route path="/settings" element={<SettingPage />} />
//           <Route path="/buy-product/:id" element={<BuyNowPage />} />
//           <Route path="/payment" element={<PaymentPage />} />

//           {/* ✅ Common Signup */}
//           <Route path="/signup" element={<Signup />} />

//           {/* ✅ Worker Routes */}
//           <Route path="/display-proof" element={<DisplayProof />} />
//           <Route path="/upload-proof" element={<UploadProof />} />
//           <Route path="/dashboard" element={<WorkerDashboard />} />
//           <Route path="/completed" element={<CompletedTask />} />
//           <Route path="/earnings" element={<Earnings />} />
//           <Route path="/profile-settings" element={<ProfileSettings />} />
//         </Routes>
//       </div>
//     </div>
//   );
// }

// export default App;

// App.jsx
import { Route, Routes, useLocation } from 'react-router-dom';
import OverviewPage from './pages/OverviewPage';
import ProductPage from './pages/ProductPage';
import Sidebar from './components/common/Sidebar';
import WorkerSidebar from './components/common/WorkerSidebar';
import UserSidebar from './components/common/UserSidebar';
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
import Signup from './components/Signup';
import DisplayProof from './pages/DisplayProof';
import UploadProof from './pages/UploadProof';
import WorkerDashboard from './pages/WorkerDashboard';
import CompletedTask from './pages/CompletedTask';
import Earnings from './pages/Earnings';
import ProfileSettings from './pages/ProfileSettings';
import ViewWorkers from './pages/ViewWorkers';
import First from './pages/First'; // ✅ your new welcome page for normal user
import UpdateProfile from './pages/UpdateProfile';

function App() {
  const location = useLocation();

  // ✅ Paths that should NOT show any sidebar
  const isAuthPage = [
    '/login',
    '/register',
    '/register-farmer',
    '/',
    '/display-package',
    '/payment',
    '/view-workers'
  ].some(path => location.pathname.startsWith(path) || location.pathname.startsWith('/buy-product/'));

  // ✅ Worker-only paths
  const workerRoutes = [
    '/dashboard',
    '/completed',
    '/earnings',
    '/profile-settings',
    '/display-proof',
    '/upload-proof'
  ];

  // ✅ Farmer/Admin paths
  const farmerRoutes = [
    '/overview',
    '/products',
    '/users',
    '/orders',
    '/add-product',
    '/add-package',
    '/chatbot',
    '/settings'
  ];

  // ✅ User-only paths (currently only profile, will expand later)
  const userRoutes = [
    '/profile',
    '/update-profile',
    '/cart'

  ];

  const isWorkerPage = workerRoutes.some(path => location.pathname.startsWith(path));
  const isFarmerPage = farmerRoutes.some(path => location.pathname.startsWith(path));
  const isUserPage = userRoutes.some(path => location.pathname.startsWith(path));

  const showSidebar = isWorkerPage || isFarmerPage || isUserPage;

  let SidebarComponent = null;
  if (isWorkerPage) SidebarComponent = WorkerSidebar;
  else if (isFarmerPage) SidebarComponent = Sidebar;
  else if (isUserPage) SidebarComponent = UserSidebar;

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* ✅ Background effect for sidebar routes */}
      {showSidebar && (
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
          <div className="absolute inset-0 backdrop-blur-sm" />
        </div>
      )}

      {/* ✅ Sidebar */}
      {showSidebar && <SidebarComponent />}

      {/* ✅ Page Content */}
      <div
        className={`relative z-10 flex-grow overflow-auto ${
        isWorkerPage ? 'ml-64 p-6 bg-gray-900 text-gray-100' :
        isFarmerPage ? 'p-6 bg-gray-900 text-gray-100' :
       ''
       }`}
      >

        <Routes>
          {/* ✅ Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register-farmer" element={<FarmerRegistration />} />
          <Route path="/" element={<DisplayProductPage />} />
          <Route path="/display-package" element={<DisplayPackagePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/view-workers" element={<ViewWorkers />} />

          {/* ✅ Farmer/Admin Routes */}
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/add-product" element={<AddProductPage />} />
          <Route path="/add-package" element={<PackagePage />} />
          <Route path="/chatbot" element={<ChatBot />} />
          <Route path="/settings" element={<SettingPage />} />
          <Route path="/buy-product/:id" element={<BuyNowPage />} />
          <Route path="/payment" element={<PaymentPage />} />

          {/* ✅ Signup */}
          <Route path="/signup" element={<Signup />} />

          {/* ✅ Worker Routes */}
          <Route path="/display-proof" element={<DisplayProof />} />
          <Route path="/upload-proof" element={<UploadProof />} />
          <Route path="/dashboard" element={<WorkerDashboard />} />
          <Route path="/completed" element={<CompletedTask />} />
          <Route path="/earnings" element={<Earnings />} />
          <Route path="/profile-settings" element={<ProfileSettings />} />

          {/* ✅ User Route: only /profile for now */}
          <Route path="/profile" element={<First />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

