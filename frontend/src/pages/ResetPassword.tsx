import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../services/api';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid or missing password reset token.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !password || !confirmPassword) return;

    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setStatus('error');
      setMessage('Password must be at least 6 characters.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      await api.post('/auth/reset-password', { token, newPassword: password });
      setStatus('success');
      setMessage('Your password has been reset successfully.');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Failed to reset password. The token may be expired or invalid.');
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
          <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
          <p className="text-slate-400">Enter your new password below.</p>
        </div>

        {!token && status === 'error' ? (
          <div className="text-center space-y-6">
             <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-lg flex flex-col items-center gap-3 text-red-200">
                <AlertCircle className="h-8 w-8 text-red-500" />
                <p>{message}</p>
             </div>
             <Link to="/forgot-password" className="btn-primary block w-full py-3">
               Request New Link
             </Link>
          </div>
        ) : status === 'success' ? (
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
            <p className="text-emerald-300 bg-emerald-900/30 p-4 rounded-lg border border-emerald-500/50">
              {message}
            </p>
            <Link to="/login" className="btn-primary block w-full py-3">
              Proceed to Login
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
              <label className="block text-sm font-medium text-slate-300 mb-1">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="password"
                  required
                  className="w-full bg-dark border border-dark-border rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={status === 'loading'}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="password"
                  required
                  className="w-full bg-dark border border-dark-border rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={status === 'loading'}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full btn-primary py-3 flex justify-center items-center"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        )}
      </div>
    </motion.div>
  );
};

export default ResetPassword;
