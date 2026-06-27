import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { motion } from 'framer-motion';
import { CreditCard, MapPin, Smartphone, CheckCircle } from 'lucide-react';

const Checkout = () => {
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();
  
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);
  const [error, setError] = useState('');

  if (!cart || cart.items.length === 0) {
    if (successOrder) return <SuccessView order={successOrder} />;
    return (
      <div className="text-center py-20 text-slate-400 glass-panel max-w-lg mx-auto mt-10">
        <p className="text-xl mb-4">Your cart is empty.</p>
        <button onClick={() => navigate('/restaurants')} className="btn-primary">Browse Restaurants</button>
      </div>
    );
  }

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      setError('Delivery address is required');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // The backend computes the total from the cart entity. We just provide method and address.
      const res = await api.post('/orders', {
        paymentMethod,
        deliveryAddress: address
      });
      setSuccessOrder(res.data.data);
      // Refresh cart to show it's empty globally
      await fetchCart();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process order');
      setIsProcessing(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-white">Checkout</h1>
      
      {error && <div className="p-4 bg-red-900/30 border border-red-500/50 text-red-200 rounded-xl">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Forms */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 space-y-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2 border-b border-dark-border pb-3">
              <MapPin className="h-5 w-5 text-primary-500" /> Delivery Address
            </h2>
            <textarea 
              className="input-field min-h-[100px] resize-none"
              placeholder="e.g., 123 Main St, Apt 4B, City, Country"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="glass-panel p-6 space-y-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2 border-b border-dark-border pb-3">
              <CreditCard className="h-5 w-5 text-primary-500" /> Payment Method
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('CREDIT_CARD')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                  paymentMethod === 'CREDIT_CARD' ? 'border-primary-500 bg-primary-900/20 text-white' : 'border-dark-border text-slate-400 hover:border-slate-500'
                }`}
              >
                <CreditCard className="h-6 w-6" />
                <span className="font-medium">Credit Card</span>
              </button>
              
              <button
                type="button"
                onClick={() => setPaymentMethod('BKASH')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                  paymentMethod === 'BKASH' ? 'border-pink-500 bg-pink-900/20 text-white' : 'border-dark-border text-slate-400 hover:border-slate-500'
                }`}
              >
                <Smartphone className="h-6 w-6" />
                <span className="font-medium">bKash</span>
              </button>
            </div>
            {/* Strategy Pattern visual proof */}
            <p className="text-xs text-slate-500 mt-2 text-center">
              Payment processing uses the Strategy Design Pattern dynamically selecting the appropriate processor.
            </p>
          </div>
        </div>

        {/* Right Col: Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass-panel p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-white border-b border-dark-border pb-3 mb-4">Order Summary</h2>
            <p className="text-sm text-primary-400 mb-4">{cart.restaurantName}</p>
            
            <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
              {cart.items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-slate-300"><span className="text-slate-500 mr-2">{item.quantity}x</span> {item.menuItemName}</span>
                  <span className="text-white">${item.lineTotal.toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-dark-border pt-4 mb-6">
              <div className="flex justify-between items-center text-lg">
                <span className="font-medium text-slate-300">Total</span>
                <span className="font-bold text-emerald-400">${cart.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={isProcessing}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>Pay ${cart.totalAmount.toFixed(2)}</>
              )}
            </button>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

const SuccessView = ({ order }) => (
  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-lg mx-auto text-center glass-panel p-10 mt-10">
    <CheckCircle className="h-20 w-20 text-emerald-500 mx-auto mb-6" />
    <h2 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h2>
    <p className="text-slate-300 mb-6">Your order #{order.id} has been placed successfully and is currently <span className="font-semibold text-primary-400">{order.status}</span>.</p>
    <div className="bg-dark-border/30 rounded-lg p-4 mb-8 text-left">
      <div className="flex justify-between mb-2"><span className="text-slate-400">Paid via:</span> <span className="text-white">{order.payment.method}</span></div>
      <div className="flex justify-between mb-2"><span className="text-slate-400">Transaction Ref:</span> <span className="text-white font-mono text-sm">{order.payment.transactionRef}</span></div>
      <div className="flex justify-between border-t border-dark-border pt-2 mt-2"><span className="font-medium text-slate-300">Total:</span> <span className="text-emerald-400 font-bold">${order.totalAmount.toFixed(2)}</span></div>
    </div>
    <Link to="/orders" className="btn-primary inline-block">View My Orders</Link>
  </motion.div>
);

export default Checkout;
