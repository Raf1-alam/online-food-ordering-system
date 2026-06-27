import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { ListOrdered, Clock, CheckCircle, Package, Search, ChevronRight } from 'lucide-react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders(true);
    // Poll for status updates every 10 seconds without showing the full page loading spinner
    const interval = setInterval(() => fetchOrders(false), 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      const res = await api.get('/orders');
      if (res.data && res.data.data) {
        const fetchedOrders = res.data.data.content || res.data.data;
        // Sort newest first based on ID to avoid timezone/clock skew issues
        const sortedOrders = [...fetchedOrders].sort((a, b) => b.id - a.id);
        setOrders(sortedOrders);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PLACED': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'CONFIRMED': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'PREPARING': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'OUT_FOR_DELIVERY': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'DELIVERED': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'CANCELLED': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PLACED': return <Clock className="h-4 w-4" />;
      case 'CONFIRMED': return <CheckCircle className="h-4 w-4" />;
      case 'PREPARING': return <Package className="h-4 w-4" />;
      case 'OUT_FOR_DELIVERY': return <Package className="h-4 w-4" />;
      case 'DELIVERED': return <CheckCircle className="h-4 w-4" />;
      case 'CANCELLED': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="animate-spin h-12 w-12 border-4 border-primary-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex items-center space-x-3 mb-8">
        <ListOrdered className="h-8 w-8 text-primary-500" />
        <h1 className="text-3xl font-bold text-white">Order History</h1>
      </div>

      {orders.length === 0 ? (
        <div className="glass-panel p-12 text-center">
          <Package className="h-16 w-16 text-slate-500 mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-semibold text-white mb-2">No orders yet</h2>
          <p className="text-slate-400">You haven't placed any orders. Discover great food and place your first order!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={order.id}
              className="glass-panel p-6 hover:border-primary-500/30 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dark-border pb-4 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    {order.restaurantName}
                  </h3>
                  <p className="text-sm text-slate-400">
                    Order #{order.id} • {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status.replace(/_/g, ' ')}
                </div>
              </div>

              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center text-slate-300">
                      <span className="font-semibold text-white bg-dark border border-dark-border px-2 py-0.5 rounded-md mr-3">
                        {item.quantity}x
                      </span>
                      {item.itemName}
                    </div>
                    <div className="text-slate-400">
                      ${item.lineTotal.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-6 pt-4 border-t border-dark-border">
                <div className="text-slate-400 text-sm">
                  Paid via: <span className="text-white font-medium">{order.payment?.method || 'N/A'}</span>
                </div>
                <div className="text-lg">
                  <span className="text-slate-400 mr-2">Total:</span>
                  <span className="text-emerald-400 font-bold">${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
