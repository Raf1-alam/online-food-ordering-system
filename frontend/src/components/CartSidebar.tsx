import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const CartSidebar = ({ isOpen, onClose }) => {
  const { cart, removeItem, updateQuantity, clearCart } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  const handleUpdateQuantity = async (item, delta) => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      const newQuantity = item.quantity + delta;
      if (newQuantity <= 0) {
        await removeItem(item.id);
      } else {
        await updateQuantity(item.id, newQuantity);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-dark/80 backdrop-blur-sm z-[60]"
          />
          
          {/* Sidebar */}
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-dark-card border-l border-dark-border z-[70] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-dark-border">
              <div className="flex items-center gap-2 text-white">
                <ShoppingBag className="h-5 w-5 text-primary-500" />
                <h2 className="text-xl font-bold">Your Cart</h2>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {!cart || cart.items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <ShoppingBag className="h-16 w-16 opacity-20" />
                  <p>Your cart is empty</p>
                  <button onClick={onClose} className="btn-outline text-sm">Browse Restaurants</button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">From <span className="text-primary-400 font-medium">{cart.restaurantName}</span></span>
                    <button onClick={clearCart} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                      <Trash2 className="h-3 w-3" /> Clear All
                    </button>
                  </div>

                  <AnimatePresence>
                    {cart.items.map((item) => (
                      <motion.div 
                        key={item.id} layout
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-dark border border-dark-border rounded-xl p-3 flex flex-col gap-3 relative overflow-hidden"
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-slate-100 pr-6 leading-tight">{item.menuItemName}</h3>
                          <span className="font-bold text-emerald-400">${item.lineTotal.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">${item.menuItemPrice.toFixed(2)} each</span>
                          
                          <div className="flex items-center gap-3 bg-dark-card border border-dark-border rounded-lg p-1">
                            <button 
                              disabled={isUpdating}
                              onClick={() => handleUpdateQuantity(item, -1)}
                              className="w-6 h-6 flex items-center justify-center rounded-md bg-dark hover:bg-slate-700 text-slate-300 transition-colors disabled:opacity-50"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-4 text-center text-sm font-medium">{item.quantity}</span>
                            <button 
                              disabled={isUpdating}
                              onClick={() => handleUpdateQuantity(item, 1)}
                              className="w-6 h-6 flex items-center justify-center rounded-md bg-dark hover:bg-slate-700 text-slate-300 transition-colors disabled:opacity-50"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </>
              )}
            </div>

            {/* Footer / Checkout */}
            {cart && cart.items.length > 0 && (
              <div className="p-4 border-t border-dark-border bg-dark/50">
                
                {/* Promo Code Input */}
                <div className="flex gap-2 mb-4">
                  <input 
                    type="text" 
                    placeholder="Promo Code" 
                    className="input-field py-2 text-sm flex-1 bg-dark-card"
                  />
                  <button className="btn-outline px-4 py-2 text-sm border-primary-500/50 hover:bg-primary-500/10">
                    Apply
                  </button>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-300">Total ({cart.totalItems} items)</span>
                  <span className="text-2xl font-bold text-white">${cart.totalAmount.toFixed(2)}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="btn-primary w-full py-3 flex items-center justify-center gap-2 group"
                >
                  Proceed to Checkout
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
