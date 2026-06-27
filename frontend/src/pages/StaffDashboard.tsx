import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, CheckCircle, Package, Truck, XCircle, Clock, UtensilsCrossed } from 'lucide-react';
import MenuManagement from '../components/MenuManagement';
import Pagination from '../components/Pagination';

const ORDER_STATES = ['PLACED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'];
const TERMINAL_STATES = ['DELIVERED', 'CANCELLED'];

const StaffDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ACTIVE'); // ACTIVE, HISTORY, MENU
  const [page, setPage] = useState(0);
  const { user } = useAuth();
  
  const [restaurantId, setRestaurantId] = useState(null);

  const fetchOrders = async (restId) => {
    try {
      setLoading(true);
      const res = await api.get(`/restaurant-staff/orders/restaurant/${restId}?size=50`);
      setOrders(res.data.data.content);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval;
    const initializeStaff = async () => {
      try {
        if (!user || !user.userId) return;
        
        // Find staff's restaurant
        const res = await api.get('/restaurants?size=100');
        const myRestaurant = res.data.data.content.find(r => r.ownerId === user.userId);
        
        if (myRestaurant) {
          setRestaurantId(myRestaurant.id);
          await fetchOrders(myRestaurant.id);
          interval = setInterval(() => fetchOrders(myRestaurant.id), 15000);
        } else {
          setLoading(false);
          console.warn("No restaurant found for this staff member");
        }
      } catch (err) {
        console.error("Failed to initialize staff dashboard", err);
        setLoading(false);
      }
    };
    
    initializeStaff();
    return () => { if (interval) clearInterval(interval); };
  }, [user]);

  useEffect(() => {
    setPage(0);
  }, [activeTab]);

  const handleAdvanceStatus = async (orderId, currentStatus) => {
    const currentIndex = ORDER_STATES.indexOf(currentStatus);
    if (currentIndex === -1 || currentIndex === ORDER_STATES.length - 1) return;
    
    const nextStatus = ORDER_STATES[currentIndex + 1];
    
    try {
      const res = await api.patch(`/restaurant-staff/orders/${orderId}/status`, { status: nextStatus });
      // Update local state to feel instant
      setOrders(orders.map(o => o.id === orderId ? res.data.data : o));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'PLACED': return <Clock className="text-amber-400" />;
      case 'CONFIRMED': return <CheckCircle className="text-blue-400" />;
      case 'PREPARING': return <ChefHat className="text-purple-400" />;
      case 'OUT_FOR_DELIVERY': return <Truck className="text-orange-400" />;
      case 'DELIVERED': return <Package className="text-emerald-400" />;
      case 'CANCELLED': return <XCircle className="text-red-400" />;
      default: return <CheckCircle />;
    }
  };

  const activeOrders = orders.filter((o: any) => !TERMINAL_STATES.includes(o.status));
  const historyOrders = orders.filter((o: any) => TERMINAL_STATES.includes(o.status));
  
  const displayOrders = activeTab === 'ACTIVE' ? activeOrders : historyOrders;
  const pagedOrders = displayOrders.slice(page * 10, (page + 1) * 10);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Staff Kitchen Display</h1>
          <p className="text-slate-400">Manage live incoming orders.</p>
        </div>
        
        <div className="flex bg-dark-card border border-dark-border rounded-lg p-1">
          <button 
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'ACTIVE' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-white'}`}
            onClick={() => setActiveTab('ACTIVE')}
          >
            Live Orders ({activeOrders.length})
          </button>
          <button 
            className={`px-4 py-2 flex items-center gap-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'HISTORY' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-white'}`}
            onClick={() => setActiveTab('HISTORY')}
          >
            <Clock className="h-4 w-4" /> History
          </button>
          <button 
            className={`px-4 py-2 flex items-center gap-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'MENU' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-white'}`}
            onClick={() => setActiveTab('MENU')}
          >
            <UtensilsCrossed className="h-4 w-4" /> Menu
          </button>
        </div>
      </div>

      {loading && activeTab !== 'MENU' && orders.length === 0 ? (
        <div className="flex justify-center py-20"><div className="animate-spin h-10 w-10 border-2 border-primary-500 rounded-full border-t-transparent"></div></div>
      ) : activeTab === 'MENU' ? (
        <MenuManagement restaurantId={restaurantId} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {pagedOrders.map((order: any) => (
              <motion.div 
                key={order.id} layout
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className={`glass-panel p-5 border-t-4 ${
                  order.status === 'PLACED' ? 'border-t-amber-500' : 
                  order.status === 'PREPARING' ? 'border-t-purple-500' :
                  order.status === 'OUT_FOR_DELIVERY' ? 'border-t-orange-500' :
                  'border-t-dark-border'
                }`}
              >
                <div className="flex justify-between items-start mb-4 border-b border-dark-border pb-3">
                  <div>
                    <span className="text-xs text-primary-400 font-bold tracking-wider">ORDER #{order.id}</span>
                    <h3 className="text-lg font-semibold text-white mt-1">{order.customerName}</h3>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-dark/50 rounded-full border border-dark-border">
                    {getStatusIcon(order.status)}
                    <span className="text-sm font-medium">{order.status.replace(/_/g, ' ')}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-slate-300"><span className="text-white font-bold bg-dark-border px-1.5 rounded mr-2">{item.quantity}x</span> {item.itemName}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-dark-border mt-auto">
                  <div className="text-xs text-slate-400 mb-4 line-clamp-2">
                    <span className="font-semibold text-slate-300">Deliver to:</span> {order.deliveryAddress}
                  </div>
                  
                  {activeTab === 'ACTIVE' && (
                    <button 
                      onClick={() => handleAdvanceStatus(order.id, order.status)}
                      className="w-full py-2.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-semibold transition-all shadow-[0_0_10px_rgba(225,29,72,0.3)] flex items-center justify-center gap-2"
                    >
                      Advance to {ORDER_STATES[ORDER_STATES.indexOf(order.status) + 1].replace(/_/g, ' ')}
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {displayOrders.length === 0 && (
            <div className="col-span-full py-20 text-center text-slate-400 glass-panel">
              No orders found in this view.
            </div>
          )}
        </div>
      )}
      {activeTab !== 'MENU' && (
        <Pagination 
          currentPage={page}
          totalPages={Math.ceil(displayOrders.length / 10)}
          totalElements={displayOrders.length}
          size={10}
          onPageChange={(p) => setPage(p)}
        />
      )}
    </motion.div>
  );
};

export default StaffDashboard;
