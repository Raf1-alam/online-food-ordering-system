import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { User as UserIcon, Mail, Phone, Lock, Save, AlertCircle, CheckCircle, MapPin } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { MapPicker } from '../components/MapPicker';

const Profile = () => {
  const { user, updateLocation } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    latitude: null as number | null,
    longitude: null as number | null,
  });

  // Separate state for the location widget
  const [locationPos, setLocationPos] = useState<[number, number] | null>(null);
  const [locationSaving, setLocationSaving] = useState(false);
  const [locationSaved, setLocationSaved] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users/profile');
      if (res.data?.data) {
        const p = res.data.data;
        setFormData(prev => ({
          ...prev,
          fullName: p.fullName || '',
          email: p.email || '',
          phone: p.phone || '',
          latitude: p.latitude || null,
          longitude: p.longitude || null,
        }));
        if (p.latitude && p.longitude) {
          setLocationPos([p.latitude, p.longitude]);
        }
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load profile data.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveLocation = async (pos: [number, number]) => {
    try {
      setLocationSaving(true);
      setLocationSaved(false);
      await api.put('/users/profile', {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        latitude: pos[0],
        longitude: pos[1],
      });
      setFormData(prev => ({ ...prev, latitude: pos[0], longitude: pos[1] }));
      if (updateLocation) updateLocation(pos[0], pos[1]);
      setLocationSaved(true);
      setTimeout(() => setLocationSaved(false), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to save location.' });
    } finally {
      setLocationSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    try {
      setSubmitting(true);

      const updatePayload: any = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        latitude: formData.latitude,
        longitude: formData.longitude,
      };

      if (formData.newPassword) {
        updatePayload.currentPassword = formData.currentPassword;
        updatePayload.newPassword = formData.newPassword;
      }

      await api.put('/users/profile', updatePayload);

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      if (updateLocation && formData.latitude && formData.longitude) {
        updateLocation(formData.latitude, formData.longitude);
      }

      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update profile.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="animate-spin h-12 w-12 border-4 border-primary-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto py-10 px-4">
      <div className="glass-panel p-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8 border-b border-dark-border pb-6">
          <div className="h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
            {formData.fullName.charAt(0).toUpperCase() || '?'}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">My Account</h1>
            <p className="text-slate-400">Manage your profile and settings</p>
          </div>
        </div>

        {message.text && (
          <div className={`p-4 rounded-lg flex items-center gap-2 mb-6 ${
            message.type === 'error'
              ? 'bg-red-900/30 border border-red-500/50 text-red-200'
              : 'bg-emerald-900/30 border border-emerald-500/50 text-emerald-200'
          }`}>
            {message.type === 'error' ? <AlertCircle className="h-5 w-5 shrink-0" /> : <CheckCircle className="h-5 w-5 shrink-0" />}
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Personal Info */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Personal Information</h2>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="text" name="fullName" required
                  className="w-full bg-dark border border-dark-border rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors"
                  value={formData.fullName} onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="email" name="email" required
                  className="w-full bg-dark border border-dark-border rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors"
                  value={formData.email} onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="text" name="phone"
                  className="w-full bg-dark border border-dark-border rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors"
                  value={formData.phone} onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Delivery Location */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary-500" />
                Delivery Location
              </h2>
              {formData.latitude && formData.longitude && (
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Location saved
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400">
              Pin your delivery location. Restaurants within <strong className="text-white">10 km</strong> will be shown and delivery time will be auto-calculated.
            </p>
            <div className="border border-dark-border rounded-xl p-3 bg-dark/40">
              <MapPicker
                initialPosition={locationPos || undefined}
                onPositionChange={(pos) => {
                  setLocationPos(pos);
                  setFormData(prev => ({ ...prev, latitude: pos[0], longitude: pos[1] }));
                  setLocationSaved(false);
                }}
                onSave={handleSaveLocation}
                showSaveButton={true}
                saving={locationSaving}
                saved={locationSaved}
              />
            </div>
          </div>

          <hr className="border-dark-border" />

          {/* Change Password */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">
              Change Password <span className="text-sm font-normal text-slate-500">(Optional)</span>
            </h2>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Current Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="password" name="currentPassword"
                  className="w-full bg-dark border border-dark-border rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors"
                  value={formData.currentPassword} onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <input
                    type="password" name="newPassword"
                    className="w-full bg-dark border border-dark-border rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors"
                    value={formData.newPassword} onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <input
                    type="password" name="confirmPassword"
                    className="w-full bg-dark border border-dark-border rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-primary-500 transition-colors"
                    value={formData.confirmPassword} onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-primary py-3 flex justify-center items-center gap-2 text-lg font-semibold"
            >
              {submitting ? 'Saving...' : <><Save className="h-5 w-5" /> Save Profile</>}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default Profile;
