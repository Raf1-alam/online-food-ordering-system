import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Store, Send, CheckCircle, Clock, XCircle } from 'lucide-react';

const RestaurantApplication = () => {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    restaurantName: '',
    address: '',
    phone: '',
    businessLicenseUrl: '',
    restaurantImageUrl: ''
  });

  useEffect(() => {
    checkExistingApplication();
  }, []);

  const checkExistingApplication = async () => {
    try {
      setLoading(true);
      const res = await api.get('/applications/my');
      if (res.data && res.data.data) {
        setApplication(res.data.data);
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error("Failed to fetch application", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await api.post('/applications', formData);
      setApplication(res.data.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin h-10 w-10 border-2 border-primary-500 rounded-full border-t-transparent"></div></div>;
  }

  if (application) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto mt-10">
        <div className="glass-panel p-8 text-center space-y-6">
          {application.status === 'PENDING' && (
            <Clock className="h-20 w-20 text-amber-500 mx-auto" />
          )}
          {application.status === 'APPROVED' && (
            <CheckCircle className="h-20 w-20 text-emerald-500 mx-auto" />
          )}
          {application.status === 'REJECTED' && (
            <XCircle className="h-20 w-20 text-red-500 mx-auto" />
          )}
          
          <h1 className="text-3xl font-bold text-white">Application {application.status}</h1>
          <p className="text-slate-400 text-lg">
            {application.status === 'PENDING' && "Your application to become a restaurant partner is under review by our admin team. We will notify you once a decision is made."}
            {application.status === 'APPROVED' && "Congratulations! Your application has been approved. You have been granted Staff access."}
            {application.status === 'REJECTED' && "Unfortunately, your application was rejected."}
          </p>

          {application.adminNotes && (
            <div className="bg-dark/50 border border-dark-border p-4 rounded-lg text-left mt-6">
              <span className="text-xs font-bold text-slate-500 uppercase">Admin Notes</span>
              <p className="text-slate-300 mt-1">{application.adminNotes}</p>
            </div>
          )}

          {application.status === 'APPROVED' && (
            <button 
              onClick={() => {
                // To force a token refresh and role update, usually they might need to re-login.
                // For simplicity, direct to /staff where it will either work or kick them.
                navigate('/staff');
                window.location.reload(); // Force reload to get new token with STAFF role if backend handles it
              }}
              className="btn-primary w-full py-3 text-lg font-semibold"
            >
              Go to Dashboard
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto mt-10">
      <div className="glass-panel p-8">
        <div className="text-center mb-8">
          <Store className="h-12 w-12 text-primary-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white">Become a Partner</h1>
          <p className="text-slate-400 mt-2">Join our platform and start delivering your amazing food to thousands of customers.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Restaurant Name</label>
              <input
                type="text" name="restaurantName" required
                className="w-full bg-dark border border-dark-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors"
                placeholder="e.g. Tasty Burgers"
                value={formData.restaurantName} onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Restaurant Address</label>
              <input
                type="text" name="address" required
                className="w-full bg-dark border border-dark-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors"
                placeholder="Full physical address"
                value={formData.address} onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Contact Phone</label>
              <input
                type="text" name="phone" required
                className="w-full bg-dark border border-dark-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors"
                placeholder="+1 234 567 8900"
                value={formData.phone} onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Business License Document URL</label>
              <input
                type="text" name="businessLicenseUrl"
                className="w-full bg-dark border border-dark-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors"
                placeholder="https://drive.google.com/... (optional for demo)"
                value={formData.businessLicenseUrl} onChange={handleChange}
              />
              <p className="text-xs text-slate-500 mt-1">Please provide a link to your business registration or license.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Restaurant Cover Image URL</label>
              <input
                type="text" name="restaurantImageUrl"
                className="w-full bg-dark border border-dark-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors"
                placeholder="https://images.unsplash.com/... (optional)"
                value={formData.restaurantImageUrl} onChange={handleChange}
              />
              <p className="text-xs text-slate-500 mt-1">Provide a high-quality cover photo for your restaurant profile.</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full btn-primary py-3 flex justify-center items-center gap-2 text-lg font-semibold"
          >
            {submitting ? 'Submitting...' : (
              <>Submit Application <Send className="h-5 w-5" /></>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default RestaurantApplication;
