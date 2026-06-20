import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { UserPlus, AlertCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      if (err.response?.data?.data) { // Validation errors map
        const errors = err.response.data.data;
        const firstError = Object.values(errors)[0];
        setError(firstError);
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel w-full max-w-md p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-primary-700"></div>
        
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
            <UserPlus className="h-6 w-6 text-primary-500" />
          </div>
          <h2 className="text-2xl font-bold text-white">Create Account</h2>
          <p className="text-slate-400 text-sm mt-1">Join us to order premium food instantly</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-900/30 border border-red-500/50 rounded-lg flex items-start gap-2 text-red-200 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-text">Full Name</label>
            <input 
              type="text" 
              name="fullName"
              required
              className="input-field"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="label-text">Email Address</label>
            <input 
              type="email" 
              name="email"
              required
              className="input-field"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="label-text">Phone Number</label>
            <input 
              type="tel" 
              name="phone"
              className="input-field"
              placeholder="+1 234 567 8900"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="label-text">Password</label>
            <input 
              type="password" 
              name="password"
              required
              className="input-field"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
            <p className="text-xs text-slate-500 mt-1.5">Must contain 8+ chars, 1 uppercase, 1 lowercase, 1 number</p>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="btn-primary w-full mt-6 py-2.5 flex justify-center items-center"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
            Log in instead
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
