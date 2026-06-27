import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { Order } from '../types';
import { Package, ChefHat, Truck, CheckCircle } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders/my-orders');
        setOrders(response.data.data.content || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusStep = (status: string) => {
    switch(status) {
      case 'PLACED': return 1;
      case 'CONFIRMED': return 1;
      case 'PREPARING': return 2;
      case 'OUT_FOR_DELIVERY': return 3;
      case 'DELIVERED': return 4;
      default: return 0;
    }
  };

  const steps = [
    { num: 1, name: 'Placed', icon: <Package /> },
    { num: 2, name: 'Preparing', icon: <ChefHat /> },
    { num: 3, name: 'On the Way', icon: <Truck /> },
    { num: 4, name: 'Delivered', icon: <CheckCircle /> }
  ];

  if (loading) return <div className="text-center p-20 text-white">Loading...</div>;

  return (
    <div className="container mx-auto px-6 py-24">
      <h1 className="text-4xl font-serif font-bold text-white mb-10">My Orders</h1>
      
      <div className="space-y-8">
        {orders.map(order => {
          const currentStep = getStatusStep(order.status);
          
          return (
            <div key={order.id} className="glass-panel p-8 rounded-3xl">
              <div className="flex justify-between items-center mb-8 border-b border-dark-border pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">Order #{order.id}</h2>
                  <p className="text-slate-400 text-sm mt-1">Placed on {new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-accent-green">${order.totalAmount.toFixed(2)}</p>
                </div>
              </div>

              {/* Visual Tracker */}
              <div className="relative py-8">
                {/* Progress Line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-dark-border -translate-y-1/2 z-0"></div>
                <div 
                  className="absolute top-1/2 left-0 h-1 bg-primary-500 -translate-y-1/2 z-0 transition-all duration-1000 ease-in-out"
                  style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`, boxShadow: '0 0 10px rgba(255,30,56,0.8)' }}
                ></div>

                <div className="relative z-10 flex justify-between">
                  {steps.map((step) => {
                    const isCompleted = step.num <= currentStep;
                    const isActive = step.num === currentStep;
                    return (
                      <div key={step.num} className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                          isCompleted ? 'bg-primary-500 text-white shadow-[0_0_20px_rgba(255,30,56,0.5)]' : 'bg-dark border-2 border-dark-border text-slate-500'
                        } ${isActive ? 'scale-110' : ''}`}>
                          {step.icon}
                        </div>
                        <p className={`mt-3 text-sm font-medium ${isCompleted ? 'text-white' : 'text-slate-500'}`}>{step.name}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Orders;
