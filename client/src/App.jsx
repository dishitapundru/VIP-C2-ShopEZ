import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import ChatBot from './components/ChatBot';
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import { ShopProvider } from './context/ShopContext';
import { Toaster } from 'react-hot-toast';

import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Success from './pages/Success';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProducts from './pages/admin/AdminProducts';
import AdminAddProduct from './pages/admin/AdminAddProduct';
import AdminOrders from './pages/admin/AdminOrders';

import { useLocation } from 'react-router-dom';

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
        <Route path="/admin/users" element={<ProtectedAdminRoute><AdminUsers /></ProtectedAdminRoute>} />
        <Route path="/admin/products" element={<ProtectedAdminRoute><AdminProducts /></ProtectedAdminRoute>} />
        <Route path="/admin/products/add" element={<ProtectedAdminRoute><AdminAddProduct /></ProtectedAdminRoute>} />
        <Route path="/admin/products/edit/:id" element={<ProtectedAdminRoute><AdminAddProduct /></ProtectedAdminRoute>} />
        <Route path="/admin/orders" element={<ProtectedAdminRoute><AdminOrders /></ProtectedAdminRoute>} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Toaster position="bottom-right" />
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<Success />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
      <ChatBot />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ShopProvider>
        <Router>
          <ScrollToTop />
          <AppContent />
        </Router>
      </ShopProvider>
    </AuthProvider>
  );
}

export default App;
