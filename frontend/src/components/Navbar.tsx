import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext';
import { Utensils, ShoppingCart, User as UserIcon, LogOut, LayoutDashboard, ChevronDown, ListOrdered, Search } from 'lucide-react';

const Navbar = ({ onCartClick }: { onCartClick: () => void }) => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/restaurants' },
    { name: 'About Us', path: '#' },
    { name: 'Contact', path: '#' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-dark/80 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 text-white hover:text-white transition-colors group">
          <span className="text-3xl font-serif font-bold tracking-tight text-white flex items-center">
            F<span className="text-primary-500">oo</span>dy
          </span>
        </Link>

        {/* Center Links (Desktop) */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={`text-sm font-medium transition-colors ${
                location.pathname === link.path 
                  ? 'text-primary-500' 
                  : 'text-slate-300 hover:text-primary-500'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-6">
          <button className="text-slate-300 hover:text-primary-500 transition-colors hidden sm:block">
            <Search className="h-5 w-5" />
          </button>

          {user ? (
            <>
              {user.role === 'CUSTOMER' && (
                <button onClick={onCartClick} className="relative text-slate-300 hover:text-primary-500 transition-colors">
                  <ShoppingCart className="h-5 w-5" />
                  {cart && cart.totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-dark">
                      {cart.totalItems}
                    </span>
                  )}
                </button>
              )}
              
              {(user.role === 'ADMIN' || user.role === 'RESTAURANT_STAFF') && (
                <Link to={user.role === 'ADMIN' ? "/admin" : "/staff"} className="text-slate-300 hover:text-primary-500 transition-colors">
                  <LayoutDashboard className="h-5 w-5" />
                </Link>
              )}

              {/* User Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 text-sm text-slate-300 hover:text-white transition-colors focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-dark-border flex items-center justify-center overflow-hidden border border-slate-600">
                    <UserIcon className="h-4 w-4" />
                  </div>
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-dark-card border border-dark-border rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-dark-border mb-1">
                      <p className="text-sm font-semibold text-white truncate">{user.fullName}</p>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
                    </div>
                    
                    <Link 
                      to="/profile" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center px-4 py-2.5 text-sm text-slate-300 hover:text-primary-400 hover:bg-dark-border/50 transition-colors"
                    >
                      <UserIcon className="h-4 w-4 mr-3" /> Profile
                    </Link>
                    
                    {user.role === 'CUSTOMER' && (
                      <Link 
                        to="/orders" 
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-slate-300 hover:text-primary-400 hover:bg-dark-border/50 transition-colors"
                      >
                        <ListOrdered className="h-4 w-4 mr-3" /> My Orders
                      </Link>
                    )}

                    <div className="border-t border-dark-border mt-1 pt-1">
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-3" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              {/* If not logged in, we show Sign Up prominently as per reference */}
              <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden sm:block">
                Log In
              </Link>
              <Link to="/register" className="btn-success text-sm py-2 px-6">
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
