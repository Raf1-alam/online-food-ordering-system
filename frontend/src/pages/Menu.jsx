import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { Plus, Check, Search, AlertCircle } from 'lucide-react';

const Menu = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [addingItem, setAddingItem] = useState(null);
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

  const handleAddToCart = async (menuItem) => {
    if (!user) {
      alert("Please login to add items to your cart.");
      return;
    }
    
    // Check if adding from different restaurant
    if (cart && cart.restaurantName && cart.restaurantName !== menuItem.restaurantName && cart.items.length > 0) {
      if (!window.confirm("Your cart contains items from a different restaurant. Clear cart and add this item?")) {
        return;
      }
      // Wait actually the backend throws an error. Let the backend handle it and we catch it.
    }

    setAddingItem(menuItem.id);
    try {
      await addItem(menuItem.id, 1);
    } catch (err) {
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
  }, {});

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      
      {/* Restaurant Header */}
      <div className="glass-panel p-8 relative overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/40 to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-2">{restaurant?.name}</h1>
          <p className="text-lg text-slate-300 max-w-2xl">{restaurant?.description}</p>
          <div className="mt-4 inline-block bg-dark-border/50 px-3 py-1.5 rounded-lg text-sm text-slate-300 backdrop-blur-sm">
            {restaurant?.address}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-200">
          <AlertCircle className="h-5 w-5" /> {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
        <input 
          type="text" 
          placeholder="Search menu items or categories..." 
          className="input-field pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Menu Categories */}
      <div className="space-y-10">
        {Object.entries(groupedMenu).map(([category, items], catIdx) => (
          <div key={category}>
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-dark-border pb-2 inline-block">{category}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((item, idx) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (catIdx * 0.1) + (idx * 0.05) }}
                  className="glass-panel p-4 flex justify-between hover:border-primary-500/30 transition-colors group"
                >
                  <div className="pr-4 flex-1">
                    <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors">{item.name}</h3>
                    <p className="text-sm text-slate-400 mt-1 line-clamp-2">{item.description}</p>
                    <div className="font-bold text-emerald-400 mt-2">${item.price.toFixed(2)}</div>
                  </div>
                  
                  <div className="flex flex-col justify-end">
                    <button 
                      onClick={() => handleAddToCart(item)}
                      className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${
                        addingItem === item.id 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-dark-border text-slate-300 hover:bg-primary-600 hover:text-white'
                      }`}
                      aria-label="Add to cart"
                    >
                      {addingItem === item.id ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
        
        {Object.keys(groupedMenu).length === 0 && (
          <div className="text-center py-12 text-slate-400 glass-panel">
            No menu items found matching your search.
          </div>
        )}
      </div>

    </motion.div>
  );
};

export default Menu;
