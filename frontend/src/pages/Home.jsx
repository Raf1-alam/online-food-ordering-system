import React from 'react';
import { motion } from 'framer-motion';
import { Utensils, Star, Clock, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-16 py-8"
    >
      {/* Hero Section */}
      <section className="relative glass-panel overflow-hidden py-20 px-8 text-center rounded-3xl border-primary-900/30">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 to-dark-card/50 pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight"
          >
            Premium Dining, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
              Delivered Fast.
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-lg text-slate-300"
          >
            Experience the finest local restaurants delivered directly to your door with real-time tracking and secure payments.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="pt-4"
          >
            <Link to="/restaurants" className="btn-primary text-lg px-8 py-3 rounded-full shadow-[0_0_20px_rgba(225,29,72,0.6)]">
              Explore Restaurants
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: <Star className="h-8 w-8 text-amber-400" />, title: "Top Rated", desc: "Hand-picked premium restaurants." },
          { icon: <Clock className="h-8 w-8 text-primary-400" />, title: "Fast Delivery", desc: "Hot food delivered in under 45 mins." },
          { icon: <Truck className="h-8 w-8 text-emerald-400" />, title: "Live Tracking", desc: "Track your order every step of the way." }
        ].map((feat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + (i * 0.1) }}
            className="glass-panel p-6 text-center hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="mx-auto w-16 h-16 bg-dark/50 rounded-full flex items-center justify-center mb-4 border border-dark-border">
              {feat.icon}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{feat.title}</h3>
            <p className="text-slate-400">{feat.desc}</p>
          </motion.div>
        ))}
      </section>
    </motion.div>
  );
};

export default Home;
