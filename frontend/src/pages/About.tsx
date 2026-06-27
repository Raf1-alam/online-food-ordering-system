import React from 'react';
import { motion } from 'framer-motion';
import { Award, Clock, Users, ShieldCheck, Play } from 'lucide-react';

const About = () => {
  const stats = [
    { label: 'Partner Restaurants', value: '150+' },
    { label: 'Happy Customers', value: '25,000+' },
    { label: 'Orders Delivered', value: '120k+' },
    { label: 'Delivery Cities', value: '12+' },
  ];

  const features = [
    {
      icon: <Award className="h-6 w-6 text-primary-400" />,
      title: 'Top-tier Quality',
      description: 'We partner with the best licensed local restaurants to ensure food hygiene and exquisite taste.'
    },
    {
      icon: <Clock className="h-6 w-6 text-primary-400" />,
      title: 'Lightning Fast Delivery',
      description: 'Our advanced routing dispatch ensures your meal is hot, fresh, and delivered right on time.'
    },
    {
      icon: <Users className="h-6 w-6 text-primary-400" />,
      title: 'Customer First Approach',
      description: 'Our round-the-clock support team makes sure your ordering experience is smooth and hassle-free.'
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-primary-400" />,
      title: 'Secure Payments',
      description: 'Enjoy multiple payment options with high-level encryption and secure COD transactions.'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-6xl mx-auto space-y-16 py-8"
    >
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <span className="text-xs font-bold tracking-widest text-primary-500 uppercase bg-primary-500/10 px-3 py-1.5 rounded-full border border-primary-500/20">
          Our Story
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
          Redefining the <span className="text-primary-500">Food Ordering</span> Experience
        </h1>
        <p className="text-slate-400 text-lg md:text-xl leading-relaxed">
          Foody was built with a single mission: to connect passionate local chefs with hungry food lovers, providing a seamless, visual, and secure dining journey right to your doorstep.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-6 text-center border-b-2 border-b-primary-500/40"
          >
            <div className="text-3xl md:text-4xl font-extrabold text-white mb-2">{stat.value}</div>
            <div className="text-xs md:text-sm text-slate-400 font-medium uppercase tracking-wider">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Core Values Section */}
      <div className="space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <h2 className="text-3xl font-bold text-white">Why Choose Foody?</h2>
          <p className="text-slate-400">We prioritize excellence in every meal and delivery.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feat) => (
            <div key={feat.title} className="glass-panel p-6 flex gap-4 items-start border border-dark-border hover:border-primary-500/30 transition-all duration-300">
              <div className="p-3 bg-dark/60 rounded-xl border border-dark-border shadow-inner shrink-0">
                {feat.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">{feat.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Placeholder / Brand Message */}
      <div className="glass-panel p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-dark-border">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="space-y-4 max-w-xl">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">Crafted for Foodies, by Foodies</h2>
          <p className="text-slate-400 leading-relaxed">
            Whether it's a cozy dinner at home, a quick corporate lunch, or celebrating special moments with premium dining options, we ensure every dish is treated with the highest culinary standards.
          </p>
        </div>
        <div className="relative shrink-0">
          <div className="h-28 w-28 bg-primary-600/20 hover:bg-primary-600/30 text-primary-500 hover:text-primary-400 transition-colors border border-primary-500/30 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 transform duration-300">
            <Play className="h-10 w-10 fill-current" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default About;
