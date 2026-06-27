import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, MapPin, HeartCrack } from 'lucide-react';
import api from '../services/api';
import { Restaurant } from '../types';

const Favorites = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      // Fetch favorited IDs
      const resIds = await api.get('/favorites');
      const favoriteIds: number[] = resIds.data.data || [];

      if (favoriteIds.length === 0) {
        setRestaurants([]);
        return;
      }

      // Fetch details of all favorited restaurants
      const detailsList = await Promise.all(
        favoriteIds.map(async (id) => {
          try {
            const resDetails = await api.get(`/restaurants/${id}`);
            return resDetails.data.data;
          } catch (err) {
            console.error(`Failed to fetch details for restaurant #${id}:`, err);
            return null;
          }
        })
      );

      setRestaurants(detailsList.filter((r) => r !== null));
    } catch (error) {
      console.error('Failed to fetch favorite restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    try {
      await api.post(`/favorites/${id}`);
      setRestaurants((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 py-4"
    >
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">My Favorite Restaurants</h1>
        <p className="text-slate-400">Quick access to the places you love most.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-panel h-72 animate-pulse bg-dark-card/50"></div>
          ))}
        </div>
      ) : (
        <AnimatePresence>
          {restaurants.length > 0 ? (
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
              {restaurants.map((restaurant) => (
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
                      
                      {/* Rating */}
                      <div className="absolute top-4 left-4 bg-dark/80 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-dark-border shadow-lg">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-sm font-bold text-white">{restaurant.rating || '4.5'}</span>
                      </div>
                      
                      {/* Remove Button */}
                      <button 
                        onClick={(e) => handleRemoveFavorite(e, restaurant.id)}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-dark/80 backdrop-blur-md flex items-center justify-center border border-dark-border hover:scale-110 transition-transform shadow-lg z-20 group/btn"
                        title="Remove from favorites"
                      >
                        <HeartCrack className="w-5 h-5 text-red-400 group-hover/btn:text-red-500 fill-red-400/20" />
                      </button>
                    </div>
                    
                    <div className="p-5">
                      <h2 className="text-2xl font-bold text-white mb-1 group-hover:text-primary-400 transition-colors">{restaurant.name}</h2>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2">{restaurant.description || 'Delicious premium food.'}</p>
                      
                      <div className="flex items-center gap-2 text-slate-300 text-sm">
                        <MapPin className="w-4 h-4 text-primary-500" />
                        <span className="truncate">{restaurant.address || 'Local Delivery Area'}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 text-slate-400 glass-panel max-w-lg mx-auto"
            >
              <div className="w-16 h-16 bg-dark/50 border border-dark-border rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                <HeartCrack className="w-8 h-8" />
              </div>
              <p className="text-xl mb-4">No favorites saved yet.</p>
              <Link to="/restaurants" className="btn-primary inline-block">Explore Restaurants</Link>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default Favorites;
