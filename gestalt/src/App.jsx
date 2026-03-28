import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Luxury Background (Global)
import LuxuryBackground from './components/LuxuryBackground';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// User Pages
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import ProductDetail from './pages/ProductDetail';
import CustomizePage from './pages/CustomizePage';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminDesigns from './pages/admin/AdminDesigns';
import AdminSettings from './pages/admin/AdminSettings';

// Layout Wrappers
const UserLayout = ({ children }) => (
  <>
    <LuxuryBackground />
    <Navbar />
    {children}
    <Footer />
  </>
);

// Private Route logic
const AdminRoute = ({ children }) => {
  const isAuth = sessionStorage.getItem('gestalt_admin') === '1';
  return isAuth ? children : <Navigate to="/admin" replace />;
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* USER ROUTES */}
          <Route path="/" element={<UserLayout><Home /></UserLayout>} />
          <Route path="/category/:category" element={<UserLayout><CategoryPage /></UserLayout>} />
          <Route path="/product/:id" element={<UserLayout><ProductDetail /></UserLayout>} />
          <Route path="/customize" element={<UserLayout><CustomizePage /></UserLayout>} />
          <Route path="/about" element={<UserLayout><About /></UserLayout>} />
          <Route path="/contact" element={<UserLayout><Contact /></UserLayout>} />
          <Route path="/faq" element={<UserLayout><FAQ /></UserLayout>} />

          {/* Fallbacks for Dial mapping */}
          <Route path="/trending" element={<Navigate to="/category/hoodies" />} />
          <Route path="/collections" element={<Navigate to="/" />} />

          {/* ADMIN ROUTES */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
          <Route path="/admin/designs" element={<AdminRoute><AdminDesigns /></AdminRoute>} />
          
          {/* Settings / fallback */}
          <Route path="/admin/stock" element={<Navigate to="/admin/products" />} />
          <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
          
          {/* 404 */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
