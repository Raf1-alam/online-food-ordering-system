import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, MapPin, Search, Clock } from 'lucide-react';
import api from '../services/api';
import { Restaurant } from '../types';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await api.get('/restaurants');
        setRestaurants(response.data.data.content || []);
      } catch (error) {
        console.error('Failed to fetch restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchFavorites = async () => {
      try {
        const res = await api.get('/favorites');
        setFavorites(new Set(res.data.data || []));
      } catch (error) {
        console.error('Failed to fetch favorites:', error);
      }
    };

    fetchRestaurants();
    if (localStorage.getItem('ofos_token')) {
      fetchFavorites();
    }
  }, []);

  const toggleFavorite = async (id: number) => {
    if (!localStorage.getItem('ofos_token')) {
      alert('Please log in to save favorites.');
      return;
    }
    try {
      await api.post(`/favorites/${id}`);
      setFavorites(prev => {
        const newSet = new Set(prev);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        return newSet;
      });
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const formatTime = (time?: string) => {
    if (!time) return null;
    const [hourStr, minute] = time.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  };

  const filteredRestaurants = restaurants
    .filter(r => 
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      r.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
        <div className="w-full md:w-2/3">
          <motion.h1 
            initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-2"
          >
            Discover <span className="text-primary-500">Premium</span> Dining
          </motion.h1>
          <p className="text-slate-400 text-lg">Order from the finest restaurants in your area.</p>
        </div>
        
        <div className="w-full md:w-1/3 relative flex gap-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input 
              type="text" 
              placeholder="Search restaurants or cuisines..." 
              className="input-field pl-10 h-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="input-field w-36 h-12 py-0 px-4 appearance-none bg-dark-card cursor-pointer"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="rating">Top Rated</option>
            <option value="name">A - Z</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="glass-panel h-72 animate-pulse bg-dark-card/50"></div>
          ))}
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
        >
          {filteredRestaurants.map((restaurant) => (
            <motion.div 
              key={restaurant.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass-panel overflow-hidden group cursor-pointer border border-transparent hover:border-primary-500/50 transition-all duration-300 shadow-lg hover:shadow-primary-500/20"
            >
              <Link to={`/restaurants/${restaurant.id}/menu`} className="block">
                <div className="h-48 bg-dark-border relative overflow-hidden">
                  <img 
                    src={restaurant.imageUrl || `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80`} 
                    alt={restaurant.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-card to-transparent opacity-80"></div>
                  
                  {/* Rating Badge */}
                  <div className="absolute top-4 left-4 bg-dark/80 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-dark-border shadow-lg">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-bold text-white">{restaurant.rating || '4.5'}</span>
                  </div>
                  
                  {/* Favorite Button */}
                  <button 
                    onClick={(e) => { e.preventDefault(); toggleFavorite(restaurant.id); }}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-dark/80 backdrop-blur-md flex items-center justify-center border border-dark-border hover:scale-110 transition-transform shadow-lg z-20"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 ${favorites.has(restaurant.id) ? 'text-primary-500 fill-primary-500 shadow-[0_0_15px_rgba(255,30,56,0.8)]' : 'text-slate-400'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                  </button>
                </div>
                
                <div className="p-5">
                  <h2 className="text-2xl font-bold text-white mb-1 group-hover:text-primary-400 transition-colors">{restaurant.name}</h2>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">{restaurant.description || 'Delicious premium food.'}</p>
                  
                  <div className="flex items-center gap-2 text-slate-300 text-sm">
                    <MapPin className="w-4 h-4 text-primary-500" />
                    <span className="truncate">{restaurant.address || 'Local Delivery Area'}</span>
                  </div>

                  {(restaurant.openingTime || restaurant.closingTime) && (
                    <div className="flex items-center gap-2 text-slate-400 text-sm mt-2">
                      <Clock className="w-4 h-4 text-primary-500" />
                      <span>
                        {formatTime(restaurant.openingTime)} – {formatTime(restaurant.closingTime)}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
          
          {filteredRestaurants.length === 0 && (
            <div className="col-span-full text-center py-20 text-slate-400">
              <p className="text-xl">No restaurants found matching your search.</p>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default RestaurantList;
