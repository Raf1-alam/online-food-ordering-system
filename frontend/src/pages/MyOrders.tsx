import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { Order } from '../types';
import { Package, ChefHat, Truck, CheckCircle, XCircle, Star, X } from 'lucide-react';
import Pagination from '../components/Pagination';

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewedOrderIds, setReviewedOrderIds] = useState<Set<number>>(() => {
    try {
      const storedUser = localStorage.getItem('ofos_user');
      const userId = storedUser ? JSON.parse(storedUser).id : 'guest';
      const saved = localStorage.getItem(`ofos_reviewed_orders_${userId}`);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const handleOpenReviewModal = (order: Order) => {
    setSelectedOrder(order);
    setRating(5);
    setComment('');
    setReviewError('');
    setReviewSuccess('');
  };

  const handleCloseReviewModal = () => {
    setSelectedOrder(null);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setSubmitting(true);
    setReviewError('');
    setReviewSuccess('');
    try {
      await api.post('/reviews', {
        restaurantId: selectedOrder.restaurantId,
        rating,
        comment
      });
      setReviewSuccess('Thank you! Your review has been submitted.');
      
      setReviewedOrderIds(prev => {
        const next = new Set(prev);
        next.add(selectedOrder.id);
        try {
          const storedUser = localStorage.getItem('ofos_user');
          const userId = storedUser ? JSON.parse(storedUser).id : 'guest';
          localStorage.setItem(`ofos_reviewed_orders_${userId}`, JSON.stringify(Array.from(next)));
        } catch (e) {
          console.error("Failed to save reviewed orders", e);
        }
        return next;
      });

      setTimeout(() => {
        handleCloseReviewModal();
      }, 1800);
    } catch (err: any) {
      setReviewError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  const fetchOrders = async (pageNumber: number, isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      // Fetch orders page with size=10 and sorted descending by id (newest first)
      const response = await api.get(`/orders?page=${pageNumber}&size=10&sort=id,desc`);
      const pageData = response.data.data;
      setOrders(pageData.content || pageData || []);
      setTotalPages(pageData.totalPages || 0);
      setTotalElements(pageData.totalElements || 0);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page, true);
    // Poll for status updates every 10 seconds silently
    const interval = setInterval(() => fetchOrders(page, false), 10000);
    return () => clearInterval(interval);
  }, [page]);

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'PLACED': return 1;
      case 'CONFIRMED': return 1;
      case 'PREPARING': return 2;
      case 'OUT_FOR_DELIVERY': return 3;
      case 'DELIVERED': return 4;
      default: return 0;
    }
  };

  const steps = [
    { num: 1, name: 'Placed', icon: <Package className="h-5 w-5" /> },
    { num: 2, name: 'Preparing', icon: <ChefHat className="h-5 w-5" /> },
    { num: 3, name: 'On the Way', icon: <Truck className="h-5 w-5" /> },
    { num: 4, name: 'Delivered', icon: <CheckCircle className="h-5 w-5" /> }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="animate-spin h-12 w-12 border-4 border-primary-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-4 max-w-4xl">
      <h1 className="text-4xl font-serif font-bold text-white mb-10">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl">
          <Package className="h-16 w-16 text-slate-500 mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-semibold text-white mb-2">No orders yet</h2>
          <p className="text-slate-400">You haven't placed any orders yet. Discover delicious food and place your first order!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order, idx) => {
            const isCancelled = order.status === 'CANCELLED';
            const currentStep = getStatusStep(order.status);
            
            return (
              <motion.div 
                key={order.id} 
                className="glass-panel p-8 rounded-3xl hover:border-primary-500/20 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                {/* Order Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-dark-border pb-6 gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">{order.restaurantName}</h2>
                    <p className="text-slate-400 text-sm mt-1">
                      Order #{order.id} • {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-400">${order.totalAmount.toFixed(2)}</p>
                    <p className="text-xs text-slate-500 mt-1">Paid via: {order.payment?.method?.replace(/_/g, ' ') || 'CASH ON DELIVERY'}</p>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-3 mb-8 bg-dark/40 border border-dark-border/40 p-5 rounded-2xl">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div className="flex items-center text-slate-300">
                        <span className="font-semibold text-white bg-dark-border/60 px-2 py-0.5 rounded-md mr-3 text-xs">
                          {item.quantity}x
                        </span>
                        <span>{item.itemName}</span>
                      </div>
                      <span className="text-slate-400">${(item.lineTotal || (item.itemPrice * item.quantity)).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Visual Tracker or Cancelled Banner */}
                {isCancelled ? (
                  <div className="flex items-center justify-center gap-3 p-4 bg-red-950/20 border border-red-500/20 rounded-2xl text-red-400 font-medium text-sm">
                    <XCircle className="h-5 w-5" />
                    <span>This order has been cancelled</span>
                  </div>
                ) : (
                  <div className="relative py-8 px-2">
                    {/* Progress Line */}
                    <div className="absolute top-1/2 left-6 right-6 h-1 bg-dark-border -translate-y-1/2 z-0"></div>
                    <div 
                      className="absolute top-1/2 left-6 h-1 bg-primary-500 -translate-y-1/2 z-0 transition-all duration-1000 ease-in-out"
                      style={{ 
                        width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - 48px)`, 
                        boxShadow: '0 0 10px rgba(255,30,56,0.8)' 
                      }}
                    ></div>

                    <div className="relative z-10 flex justify-between">
                      {steps.map((step) => {
                        const isCompleted = step.num <= currentStep;
                        const isActive = step.num === currentStep;
                        return (
                          <div key={step.num} className="flex flex-col items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                              isCompleted ? 'bg-primary-500 text-white shadow-[0_0_20px_rgba(255,30,56,0.5)]' : 'bg-dark border-2 border-dark-border text-slate-500'
                            } ${isActive ? 'scale-110 ring-4 ring-primary-500/20' : ''}`}>
                              {step.icon}
                            </div>
                            <p className={`mt-3 text-xs md:text-sm font-medium ${isCompleted ? 'text-white' : 'text-slate-500'}`}>{step.name}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Rate & Review Button for Delivered Orders */}
                {order.status === 'DELIVERED' && (
                  <div className="mt-6 pt-6 border-t border-dark-border/40 flex justify-end">
                    {reviewedOrderIds.has(order.id) ? (
                      <button 
                        disabled
                        className="bg-dark-border border border-slate-700/30 text-slate-500 font-semibold py-2 px-6 rounded-full text-sm cursor-not-allowed"
                      >
                        Reviewed
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleOpenReviewModal(order)}
                        className="btn-primary py-2 px-6 text-sm"
                      >
                        Rate & Review
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
          
          <Pagination 
            currentPage={page}
            totalPages={totalPages}
            totalElements={totalElements}
            size={10}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}

      {/* Review & Rating Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-dark/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel max-w-md w-full p-8 relative overflow-hidden border border-dark-border/60 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-primary-700"></div>
            
            {/* Close Button */}
            <button 
              onClick={handleCloseReviewModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-2xl font-bold text-white mb-2">Rate & Review</h2>
            <p className="text-slate-400 text-sm mb-6">How was your order from <strong className="text-white">{selectedOrder.restaurantName}</strong>?</p>

            {reviewError && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200 text-sm">
                {reviewError}
              </div>
            )}

            {reviewSuccess && (
              <div className="mb-4 p-3 bg-emerald-900/30 border border-emerald-500/50 rounded-lg text-emerald-200 text-sm">
                {reviewSuccess}
              </div>
            )}

            {!reviewSuccess && (
              <form onSubmit={handleReviewSubmit} className="space-y-6">
                {/* Star Rating Select */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Rating</label>
                  <div 
                    className="flex items-center gap-2"
                    onMouseLeave={() => setHoverRating(null)}
                  >
                    {[1, 2, 3, 4, 5].map((starNum) => {
                      const isActive = starNum <= (hoverRating !== null ? hoverRating : rating);
                      return (
                        <button
                          type="button"
                          key={starNum}
                          onClick={() => setRating(starNum)}
                          onMouseEnter={() => setHoverRating(starNum)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star 
                            className={`h-8 w-8 transition-colors duration-150 ${
                              isActive 
                                ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' 
                                : 'text-slate-600'
                            }`} 
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Comment Textarea */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Your Review</label>
                  <textarea
                    rows={4}
                    className="input-field py-3"
                    placeholder="Tell us what you liked or disliked about this order..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center justify-end gap-4 pt-2">
                  <button
                    type="button"
                    onClick={handleCloseReviewModal}
                    className="px-5 py-2.5 rounded-full text-slate-300 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary py-2.5 px-6 text-sm flex items-center justify-center min-w-[120px]"
                  >
                    {submitting ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      'Submit Review'
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Orders;
