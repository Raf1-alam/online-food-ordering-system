import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Store, MapPin, Phone, Star, Search } from 'lucide-react';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const query = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : '';
        const res = await api.get(`/restaurants?size=20${query}`);
        setRestaurants(res.data.data.content);
      } catch (err) {
        console.error("Failed to fetch restaurants", err);
      } finally {
        setLoading(false);
      }
    };
    
    const timeoutId = setTimeout(() => {
      fetchRestaurants();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div></div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Popular Restaurants</h1>
          <p className="text-slate-400">Discover the best food around you.</p>
        </div>
        <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-500" />
          </div>
          <input
            type="text"
            placeholder="Search for restaurants..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant, idx) => (
          <motion.div 
            key={restaurant.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Link to={`/restaurants/${restaurant.id}/menu`} className="block h-full">
              <div className="glass-panel overflow-hidden h-full group hover:border-primary-500/50 transition-colors">
                <div className="h-48 bg-dark-border relative overflow-hidden">
                  {restaurant.imageUrl ? (
                    <img 
                      src={restaurant.imageUrl} 
                      alt={restaurant.name} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-tr from-dark-card to-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                      <Store className="h-16 w-16 text-slate-600" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-dark/80 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 text-sm text-amber-400 font-medium">
                    <Star className="h-4 w-4 fill-current" /> 4.8
                  </div>
                </div>
                
                <div className="p-5">
                  <h2 className="text-xl font-bold text-white mb-1 group-hover:text-primary-400 transition-colors">{restaurant.name}</h2>
                  <p className="text-sm text-slate-400 line-clamp-2 mb-4">{restaurant.description}</p>
                  
                  <div className="space-y-2 text-sm text-slate-300">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 shrink-0 text-primary-500 mt-0.5" />
                      <span className="line-clamp-1">{restaurant.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 shrink-0 text-primary-500" />
                      <span>{restaurant.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}

        {restaurants.length === 0 && !loading && (
          <div className="col-span-full text-center py-12 text-slate-400 glass-panel">
            {searchTerm ? `No restaurants found matching "${searchTerm}".` : "No active restaurants found."}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RestaurantList;
