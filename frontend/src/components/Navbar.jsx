import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext';
import { Utensils, ShoppingCart, User as UserIcon, LogOut, LayoutDashboard, ChevronDown, ListOrdered } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const Navbar = ({ onCartClick }) => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
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

              {/* User Dropdown */}
              <div className="relative border-l border-dark-border pl-4" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 text-sm text-slate-300 hover:text-white transition-colors focus:outline-none"
                >
                  <UserIcon className="h-5 w-5" />
                  <span>{user.fullName}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-dark border border-dark-border rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-dark-border mb-1">
                      <p className="text-sm font-semibold text-white truncate">{user.fullName}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                    
                    <Link 
                      to="/profile" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-dark-border/50 transition-colors"
                    >
                      <UserIcon className="h-4 w-4 mr-2" /> Profile
                    </Link>
                    
                    {user.role === 'CUSTOMER' && (
                      <Link 
                        to="/orders" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-dark-border/50 transition-colors"
                      >
                        <ListOrdered className="h-4 w-4 mr-2" /> My Orders
                      </Link>
                    )}

                    <div className="border-t border-dark-border mt-1 pt-1">
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-2" /> Logout
                      </button>
                    </div>
                  </div>
                )}
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
