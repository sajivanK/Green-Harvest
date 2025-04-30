

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
import ProfileSettings from './pages/ProfileSettings';
import ViewWorkers from './pages/ViewWorkers';
import First from './pages/First'; 
import UpdateProfile from './pages/UpdateProfile';
import GenerateFullReport from './pages/GenerateFullReport';
import SubscriptionPayment from './pages/SubscriptionPayment';
import MySubscriptions from './pages/MySubscriptions';
import DeliveryInfoPage from './pages/DeliveryInfoPage';  // ✅
import OrderSummary from './pages/OrderSummary'; 
import OrderEditPage from './pages/OrderEditPage';



import AddDetail from './pages/AddDetail';  //vishnu added this line 
import Preview from './pages/Preview';    //vishnu added this line
import Billing from './pages/Billing';
import Transaction from './pages/Transaction';  // ✅ import at the top




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
    '/view-workers',
    '/add-detail',
    '/preview',
    '/billing',
    '/transaction',
    '/subscription-payment',
    '/signup'

  ].some(path => location.pathname.startsWith(path) || location.pathname.startsWith('/buy-product/'));

  // ✅ Worker-only paths
  const workerRoutes = [
    '/dashboard',
    '/completed',
    // '/earnings',
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
    '/settings',
    '/farmer-report'
  ];

  // ✅ User-only paths (currently only profile, will expand later)
  const userRoutes = [
    '/profile',
    '/update-profile',
    '/cart',
    '/my-subscriptions'
    

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

          <Route path="/add-detail" element={<AddDetail />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/transaction" element={<Transaction />} />
          <Route path="/subscription-payment" element={<SubscriptionPayment />} />
          <Route path="/delivery-info" element={<DeliveryInfoPage />} />
          <Route path="/summary" element={<OrderSummary />} /> 
          <Route path="/edit" element={<OrderEditPage />} /> 




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
          <Route path="/farmer-report" element={<GenerateFullReport />} />

          {/* ✅ Signup */}
          <Route path="/signup" element={<Signup />} />

          {/* ✅ Worker Routes */}
          <Route path="/display-proof" element={<DisplayProof />} />
          <Route path="/upload-proof" element={<UploadProof />} />
          <Route path="/dashboard" element={<WorkerDashboard />} />
          <Route path="/completed" element={<CompletedTask />} />
          {/* <Route path="/earnings" element={<Earnings />} /> */}
          <Route path="/profile-settings" element={<ProfileSettings />} />

          {/* ✅ User Route: only /profile for now */}
          <Route path="/profile" element={<First />} />
          <Route path="/update-profile" element={<UpdateProfile />}/>
          <Route path="/my-subscriptions" element={<MySubscriptions />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

