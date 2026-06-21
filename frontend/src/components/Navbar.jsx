import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext';
import { Utensils, ShoppingCart, User as UserIcon, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = ({ onCartClick }) => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel rounded-none border-t-0 border-x-0 border-b-dark-border px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 text-primary-500 hover:text-primary-400 transition-colors">
          <Utensils className="h-8 w-8" />
          <span className="text-xl font-bold tracking-tight text-white">OFOS</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          {user ? (
            <>
              {/* Role-specific links */}
              {user.role === 'CUSTOMER' && (
                <button onClick={onCartClick} className="relative text-slate-300 hover:text-primary-400 transition-colors">
                  <ShoppingCart className="h-6 w-6" />
                  {cart && cart.totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                      {cart.totalItems}
                    </span>
                  )}
                </button>
              )}
              
              {(user.role === 'ADMIN' || user.role === 'RESTAURANT_STAFF') && (
                <Link to={user.role === 'ADMIN' ? "/admin" : "/staff"} className="text-slate-300 hover:text-primary-400 transition-colors flex items-center gap-1">
                  <LayoutDashboard className="h-5 w-5" />
                  <span className="text-sm font-medium">Dashboard</span>
                </Link>
              )}

              {user.role === 'CUSTOMER' && (
                  <Link to="/apply-partner" className="text-primary-400 hover:text-primary-300 transition-colors text-sm font-medium">
                    Become a Partner
                  </Link>
              )}

              {/* User Dropdown / Profile (Simplified) */}
              <div className="flex items-center space-x-4 border-l border-dark-border pl-4">
                <div className="flex items-center space-x-2 text-sm text-slate-300">
                  <UserIcon className="h-5 w-5" />
                  <span>{user.fullName}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-primary-500 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Log In
              </Link>
              <Link to="/register" className="btn-primary text-sm py-1.5 px-4">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
