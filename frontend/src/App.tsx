import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { useAuth } from './hooks/useAuth';

// Layouts & Shared
import Navbar from './components/Navbar';
import CartSidebar from './components/CartSidebar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Menu from './pages/Menu';
import Checkout from './pages/Checkout';
import StaffDashboard from './pages/StaffDashboard';
import AdminDashboard from './pages/AdminDashboard';
import RestaurantList from './pages/RestaurantList';
import RestaurantApplication from './pages/RestaurantApplication';
import Profile from './pages/Profile';
import MyOrders from './pages/MyOrders';
import About from './pages/About';
import Contact from './pages/Contact';
import Favorites from './pages/Favorites';

const ProtectedRoute = ({ children, allowedRoles = [] }: { children: React.ReactNode; allowedRoles?: string[] }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

const AdminStaffRedirect = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  if (user) {
    if (user.role === 'ADMIN') {
      return <Navigate to="/admin" replace />;
    }
    if (user.role === 'RESTAURANT_STAFF') {
      return <Navigate to="/staff" replace />;
    }
  }

  return <>{children}</>;
};

const App = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-dark text-slate-100 flex flex-col">
            <Navbar onCartClick={() => setIsCartOpen(true)} />
            <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <main className="flex-1 container mx-auto px-4 pt-28 pb-8">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<AdminStaffRedirect><Home /></AdminStaffRedirect>} />
                <Route path="/login" element={<AdminStaffRedirect><Login /></AdminStaffRedirect>} />
                <Route path="/register" element={<AdminStaffRedirect><Register /></AdminStaffRedirect>} />
                <Route path="/forgot-password" element={<AdminStaffRedirect><ForgotPassword /></AdminStaffRedirect>} />
                <Route path="/reset-password" element={<AdminStaffRedirect><ResetPassword /></AdminStaffRedirect>} />
                <Route path="/restaurants" element={<AdminStaffRedirect><RestaurantList /></AdminStaffRedirect>} />
                <Route path="/restaurants/:id/menu" element={<AdminStaffRedirect><Menu /></AdminStaffRedirect>} />
                <Route path="/about" element={<AdminStaffRedirect><About /></AdminStaffRedirect>} />
                <Route path="/contact" element={<AdminStaffRedirect><Contact /></AdminStaffRedirect>} />
                
                {/* Customer Routes */}
                <Route path="/checkout" element={
                  <ProtectedRoute allowedRoles={['CUSTOMER']}>
                    <Checkout />
                  </ProtectedRoute>
                } />
                <Route path="/apply-partner" element={
                  <ProtectedRoute allowedRoles={['CUSTOMER']}>
                    <RestaurantApplication />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/orders" element={
                  <ProtectedRoute allowedRoles={['CUSTOMER']}>
                    <MyOrders />
                  </ProtectedRoute>
                } />
                <Route path="/favorites" element={
                  <ProtectedRoute allowedRoles={['CUSTOMER']}>
                    <Favorites />
                  </ProtectedRoute>
                } />
                
                {/* Staff Routes */}
                <Route path="/staff" element={
                  <ProtectedRoute allowedRoles={['RESTAURANT_STAFF', 'ADMIN']}>
                    <StaffDashboard />
                  </ProtectedRoute>
                } />
                
                {/* Admin Routes */}
                <Route path="/admin" element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
