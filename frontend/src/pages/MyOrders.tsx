import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { Order } from '../types';
import { Package, ChefHat, Truck, CheckCircle, XCircle } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      // Fetch orders page with a large size to get active and past history
      const response = await api.get('/orders?size=50');
      const fetchedOrders = response.data.data.content || response.data.data || [];
      // Sort newest first based on ID to avoid timezone/clock skew issues
      const sortedOrders = [...fetchedOrders].sort((a: Order, b: Order) => b.id - a.id);
      setOrders(sortedOrders);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(true);
    // Poll for status updates every 10 seconds silently
    const interval = setInterval(() => fetchOrders(false), 10000);
    return () => clearInterval(interval);
  }, []);

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'PLACED': return 1;
      case 'CONFIRMED': return 1;
      case 'PREPARING': return 2;
      case 'OUT_FOR_DELIVERY': return 3;
      case 'DELIVERED': return 4;
      default: return 0;
    }
  };

  const steps = [
    { num: 1, name: 'Placed', icon: <Package className="h-5 w-5" /> },
    { num: 2, name: 'Preparing', icon: <ChefHat className="h-5 w-5" /> },
    { num: 3, name: 'On the Way', icon: <Truck className="h-5 w-5" /> },
    { num: 4, name: 'Delivered', icon: <CheckCircle className="h-5 w-5" /> }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="animate-spin h-12 w-12 border-4 border-primary-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-24 max-w-4xl">
      <h1 className="text-4xl font-serif font-bold text-white mb-10">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl">
          <Package className="h-16 w-16 text-slate-500 mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-semibold text-white mb-2">No orders yet</h2>
          <p className="text-slate-400">You haven't placed any orders yet. Discover delicious food and place your first order!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order, idx) => {
            const isCancelled = order.status === 'CANCELLED';
            const currentStep = getStatusStep(order.status);
            
            return (
              <motion.div 
                key={order.id} 
                className="glass-panel p-8 rounded-3xl hover:border-primary-500/20 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                {/* Order Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-dark-border pb-6 gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">{order.restaurantName}</h2>
                    <p className="text-slate-400 text-sm mt-1">
                      Order #{order.id} • {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-400">${order.totalAmount.toFixed(2)}</p>
                    <p className="text-xs text-slate-500 mt-1">Paid via: {order.payment?.method?.replace(/_/g, ' ') || 'CASH ON DELIVERY'}</p>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-3 mb-8 bg-dark/40 border border-dark-border/40 p-5 rounded-2xl">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div className="flex items-center text-slate-300">
                        <span className="font-semibold text-white bg-dark-border/60 px-2 py-0.5 rounded-md mr-3 text-xs">
                          {item.quantity}x
                        </span>
                        <span>{item.itemName}</span>
                      </div>
                      <span className="text-slate-400">${(item.lineTotal || (item.itemPrice * item.quantity)).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Visual Tracker or Cancelled Banner */}
                {isCancelled ? (
                  <div className="flex items-center justify-center gap-3 p-4 bg-red-950/20 border border-red-500/20 rounded-2xl text-red-400 font-medium text-sm">
                    <XCircle className="h-5 w-5" />
                    <span>This order has been cancelled</span>
                  </div>
                ) : (
                  <div className="relative py-8 px-2">
                    {/* Progress Line */}
                    <div className="absolute top-1/2 left-6 right-6 h-1 bg-dark-border -translate-y-1/2 z-0"></div>
                    <div 
                      className="absolute top-1/2 left-6 h-1 bg-primary-500 -translate-y-1/2 z-0 transition-all duration-1000 ease-in-out"
                      style={{ 
                        width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - 48px)`, 
                        boxShadow: '0 0 10px rgba(255,30,56,0.8)' 
                      }}
                    ></div>

                    <div className="relative z-10 flex justify-between">
                      {steps.map((step) => {
                        const isCompleted = step.num <= currentStep;
                        const isActive = step.num === currentStep;
                        return (
                          <div key={step.num} className="flex flex-col items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                              isCompleted ? 'bg-primary-500 text-white shadow-[0_0_20px_rgba(255,30,56,0.5)]' : 'bg-dark border-2 border-dark-border text-slate-500'
                            } ${isActive ? 'scale-110 ring-4 ring-primary-500/20' : ''}`}>
                              {step.icon}
                            </div>
                            <p className={`mt-3 text-xs md:text-sm font-medium ${isCompleted ? 'text-white' : 'text-slate-500'}`}>{step.name}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
