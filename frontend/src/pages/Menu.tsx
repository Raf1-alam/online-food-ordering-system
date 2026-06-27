import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Search, AlertCircle } from 'lucide-react';
import { Restaurant, MenuItem } from '../types';

const Menu = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [addingItem, setAddingItem] = useState<number | null>(null);
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const { addItem, cart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restRes, menuRes] = await Promise.all([
          api.get(`/restaurants/${id}`),
          api.get(`/restaurants/${id}/menu?size=50`)
        ]);
        setRestaurant(restRes.data.data);
        setMenuItems(menuRes.data.data.content);
      } catch (err) {
        console.error("Failed to fetch menu", err);
        setError('Failed to load menu. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddToCart = async (menuItem: MenuItem) => {
    if (!user) {
      alert("Please login to add items to your cart.");
      return;
    }
    
    // Check if adding from different restaurant
    // @ts-ignore - Temporary bypass for existing cart logic
    if (cart && cart.restaurantName && cart.restaurantName !== restaurant?.name && cart.items.length > 0) {
      if (!window.confirm("Your cart contains items from a different restaurant. Clear cart and add this item?")) {
        return;
      }
    }

    setAddingItem(menuItem.id);
    try {
      await addItem(menuItem.id, 1);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add item to cart');
    } finally {
      setTimeout(() => setAddingItem(null), 1000); // Show checkmark briefly
    }
  };

  const filteredMenu = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group by category
  const groupedMenu = filteredMenu.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      
      {/* Restaurant Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 relative overflow-hidden rounded-3xl min-h-[350px] flex flex-col justify-end group shadow-2xl"
      >
        <div className="absolute inset-0 bg-dark-card">
          <img 
            src={restaurant?.imageUrl || `https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80`} 
            alt={restaurant?.name} 
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000 ease-out"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/70 to-transparent pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/30 to-transparent pointer-events-none mix-blend-overlay"></div>
        
        <div className="relative z-10">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="text-5xl font-bold text-white mb-3"
          >
            {restaurant?.name}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="text-xl text-slate-300 max-w-2xl mb-4"
          >
            {restaurant?.description}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="inline-block bg-dark/60 border border-dark-border px-4 py-2 rounded-xl text-slate-200 backdrop-blur-md shadow-lg"
          >
            {restaurant?.address || '123 Premium Food Ave'}
          </motion.div>
        </div>
      </motion.div>

      {error && (
        <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-200">
          <AlertCircle className="h-5 w-5" /> {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-md mx-auto md:mx-0">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
        <input 
          type="text" 
          placeholder="Search menu items or categories..." 
          className="input-field pl-12 h-12 text-lg shadow-lg border-primary-900/20 focus:border-primary-500/50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Menu Categories */}
      <div className="space-y-12">
        <AnimatePresence>
          {Object.entries(groupedMenu).map(([category, items], catIdx) => (
            <motion.div 
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIdx * 0.1 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                {category}
                <div className="h-px bg-dark-border flex-1 ml-4 mt-2"></div>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {items.map((item, idx) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (catIdx * 0.1) + (idx * 0.05) }}
                    whileHover={{ y: -5 }}
                    className="glass-panel p-5 flex justify-between group hover:shadow-[0_0_20px_rgba(225,29,72,0.15)] hover:border-primary-500/40 transition-all duration-300"
                  >
                    <div className="flex-1 flex gap-5 pr-4">
                      {item.imageUrl && (
                        <div className="shrink-0 w-28 h-28 rounded-xl overflow-hidden shadow-md bg-dark-card border border-dark-border">
                          <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          />
                        </div>
                      )}
                      <div className="flex flex-col justify-between py-1">
                        <div>
                          <h3 className="text-xl font-semibold text-white group-hover:text-primary-400 transition-colors">{item.name}</h3>
                          <p className="text-sm text-slate-400 mt-1 line-clamp-2">{item.description}</p>
                        </div>
                        <div className="font-bold text-emerald-400 text-lg mt-2">${item.price.toFixed(2)}</div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col justify-end">
                      <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleAddToCart(item)}
                        className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all shadow-md ${
                          addingItem === item.id 
                            ? 'bg-accent-green text-white shadow-[0_0_20px_rgba(52,211,42,0.4)]' 
                            : 'bg-dark border border-dark-border text-slate-300 hover:bg-accent-green hover:text-white hover:border-accent-green hover:shadow-[0_0_20px_rgba(52,211,42,0.3)]'
                        }`}
                        aria-label="Add to cart"
                      >
                        {addingItem === item.id ? <Check className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {Object.keys(groupedMenu).length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-20 text-slate-400 glass-panel"
          >
            <p className="text-xl">No menu items found matching your search.</p>
          </motion.div>
        )}
      </div>

      {/* Reviews Section (Mock UI for feature expansion) */}
      <div className="pt-12 mt-12 border-t border-dark-border">
        <h2 className="text-3xl font-bold text-white mb-8">Customer Reviews</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="glass-panel p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-primary-900 text-primary-500 rounded-full flex items-center justify-center font-bold text-xl">
                JD
              </div>
              <div>
                <h4 className="font-bold text-white">John Doe</h4>
                <div className="flex text-amber-400 text-sm">
                  ★ ★ ★ ★ ★
                </div>
              </div>
            </div>
            <p className="text-slate-300">The food here is absolutely incredible! Fast delivery and everything was still hot. The red velvet burger is a must-try!</p>
          </div>
          
          <div className="glass-panel p-6 border-dashed border-2 border-dark-border flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary-500/50 transition-colors">
            <p className="text-slate-400 mb-4">Have you ordered from {restaurant?.name || 'here'} before?</p>
            <button className="btn-outline px-6 py-2 text-sm">Leave a Review</button>
          </div>
        </div>
      </div>

    </motion.div>
  );
};

export default Menu;
