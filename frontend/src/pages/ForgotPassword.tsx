import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import api from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setMessage('');

    try {
      await api.post('/auth/forgot-password', { email });
      setStatus('success');
      setMessage('If an account with that email exists, we have sent a password reset link.');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Failed to process request. Please try again.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
      className="min-h-[70vh] flex items-center justify-center px-4"
    >
      <div className="glass-panel w-full max-w-md p-8 relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-primary-700"></div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Forgot Password</h2>
          <p className="text-slate-400">Enter your email address and we'll send you a link to reset your password.</p>
        </div>

        {status === 'success' ? (
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
            <p className="text-emerald-300 bg-emerald-900/30 p-4 rounded-lg border border-emerald-500/50">
              {message}
            </p>
            <Link to="/login" className="btn-primary block w-full py-3">
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {status === 'error' && (
              <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-200 text-sm">
                <AlertCircle className="h-5 w-5 shrink-0" /> {message}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="email"
                  required
                  className="w-full bg-dark border border-dark-border rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full btn-primary py-3 flex justify-center items-center"
              disabled={status === 'loading' || !email}
            >
              {status === 'loading' ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                'Send Reset Link'
              )}
            </button>

            <div className="text-center mt-6">
              <Link to="/login" className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors flex items-center justify-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  );
};

export default ForgotPassword;
