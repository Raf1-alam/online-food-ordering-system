import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { User as UserIcon, Mail, Phone, Lock, Save, AlertCircle, CheckCircle, MapPin, Trash2, Plus, Star } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface UserAddress {
  id: number;
  label: string;
  fullAddress: string;
  isDefault: boolean;
}

const Profile = () => {
  const { user, login } = useAuth(); // We might need to update user context if name changes, but page reload works too.
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses'>('profile');
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: 'Home', fullAddress: '' });
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchAddresses();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users/profile');
      if (res.data && res.data.data) {
        const profile = res.data.data;
        setFormData(prev => ({
          ...prev,
          fullName: profile.fullName || '',
          email: profile.email || '',
          phone: profile.phone || ''
        }));
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load profile data.' });
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const res = await api.get('/addresses');
      setAddresses(res.data.data || []);
    } catch (error) {
      console.error('Failed to load addresses', error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (addresses.length >= 5) {
      setMessage({ type: 'error', text: 'Maximum of 5 addresses allowed.' });
      return;
    }
    try {
      setSubmitting(true);
      await api.post('/addresses', newAddress);
      await fetchAddresses();
      setIsAddingAddress(false);
      setNewAddress({ label: 'Home', fullAddress: '' });
      setMessage({ type: 'success', text: 'Address added successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to add address.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAddress = async (id: number) => {
    try {
      await api.delete(`/addresses/${id}`);
      await fetchAddresses();
    } catch (error) {
      console.error('Failed to delete address', error);
    }
  };

  const handleSetDefaultAddress = async (id: number) => {
    try {
      await api.patch(`/addresses/${id}/default`);
      await fetchAddresses();
    } catch (error) {
      console.error('Failed to set default address', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      
      const updatePayload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone
      };

      if (formData.newPassword) {
        updatePayload.currentPassword = formData.currentPassword;
        updatePayload.newPassword = formData.newPassword;
      }

      await api.put('/users/profile', updatePayload);
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update profile.' 
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
        <div className="flex items-center space-x-4 mb-8 border-b border-dark-border pb-6">
          <div className="h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
            {formData.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">My Account</h1>
            <p className="text-slate-400">Manage your profile and settings</p>
          </div>
        </div>

        <div className="flex gap-4 border-b border-dark-border mb-6">
          <button 
            className={`pb-3 px-4 font-semibold text-sm transition-colors relative ${activeTab === 'profile' ? 'text-primary-500' : 'text-slate-400 hover:text-white'}`}
            onClick={() => { setActiveTab('profile'); setMessage({ type: '', text: '' }); }}
          >
            Profile Info
            {activeTab === 'profile' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 shadow-[0_0_10px_rgba(255,30,56,0.8)]"></div>}
          </button>
          <button 
            className={`pb-3 px-4 font-semibold text-sm transition-colors relative ${activeTab === 'addresses' ? 'text-primary-500' : 'text-slate-400 hover:text-white'}`}
            onClick={() => { setActiveTab('addresses'); setMessage({ type: '', text: '' }); }}
          >
            Address Book
            {activeTab === 'addresses' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 shadow-[0_0_10px_rgba(255,30,56,0.8)]"></div>}
          </button>
        </div>

        {message.text && (
          <div className={`p-4 rounded-lg flex items-center gap-2 mb-6 ${
            message.type === 'error' ? 'bg-red-900/30 border border-red-500/50 text-red-200' : 'bg-emerald-900/30 border border-emerald-500/50 text-emerald-200'
          }`}>
            {message.type === 'error' ? <AlertCircle className="h-5 w-5 shrink-0" /> : <CheckCircle className="h-5 w-5 shrink-0" />}
            {message.text}
          </div>
        )}

        {activeTab === 'profile' ? (
          <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Personal Info Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">Personal Information</h2>
            
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

          <hr className="border-dark-border my-8" />

          {/* Password Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">Change Password <span className="text-sm font-normal text-slate-500">(Optional)</span></h2>
            
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

          <div className="pt-6 border-t border-dark-border">
            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-primary py-3 flex justify-center items-center gap-2 text-lg font-semibold"
            >
              {submitting ? 'Saving Changes...' : (
                <>Save Changes <Save className="h-5 w-5" /></>
              )}
            </button>
          </div>
        </form>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Saved Addresses</h2>
              {!isAddingAddress && addresses.length < 5 && (
                <button 
                  onClick={() => setIsAddingAddress(true)}
                  className="btn-outline py-1.5 px-4 text-sm flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add New
                </button>
              )}
            </div>

            {isAddingAddress && (
              <form onSubmit={handleAddAddress} className="bg-dark/40 border border-dark-border p-5 rounded-xl space-y-4 mb-6">
                <h3 className="font-semibold text-white mb-2">New Address</h3>
                <div className="flex gap-4">
                  <div className="w-1/3">
                    <label className="block text-sm text-slate-400 mb-1">Label</label>
                    <select 
                      className="w-full bg-dark border border-dark-border rounded-lg px-4 py-2 text-white"
                      value={newAddress.label}
                      onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                    >
                      <option value="Home">Home</option>
                      <option value="Office">Office</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="w-2/3">
                    <label className="block text-sm text-slate-400 mb-1">Full Address</label>
                    <input 
                      type="text" required
                      className="w-full bg-dark border border-dark-border rounded-lg px-4 py-2 text-white"
                      placeholder="e.g. 123 Main St, Apt 4B"
                      value={newAddress.fullAddress}
                      onChange={(e) => setNewAddress({ ...newAddress, fullAddress: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setIsAddingAddress(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                  <button type="submit" disabled={submitting} className="btn-primary py-2 px-6">Save Address</button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {addresses.length === 0 && !isAddingAddress && (
                <div className="text-center py-10 text-slate-500 bg-dark/20 rounded-xl border border-dark-border/50 border-dashed">
                  <MapPin className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p>No saved addresses yet.</p>
                </div>
              )}
              {addresses.map(addr => (
                <div key={addr.id} className={`flex items-start justify-between p-4 rounded-xl border ${addr.isDefault ? 'border-primary-500 bg-primary-900/10' : 'border-dark-border bg-dark/40'} transition-all`}>
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {addr.label === 'Home' ? <MapPin className={`w-5 h-5 ${addr.isDefault ? 'text-primary-500' : 'text-slate-400'}`} /> : 
                       addr.label === 'Office' ? <MapPin className={`w-5 h-5 ${addr.isDefault ? 'text-primary-500' : 'text-slate-400'}`} /> : 
                       <MapPin className={`w-5 h-5 ${addr.isDefault ? 'text-primary-500' : 'text-slate-400'}`} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-white">{addr.label}</span>
                        {addr.isDefault && <span className="text-[10px] uppercase font-bold bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded-full">Default</span>}
                      </div>
                      <p className="text-slate-300 text-sm">{addr.fullAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!addr.isDefault && (
                      <button 
                        onClick={() => handleSetDefaultAddress(addr.id)}
                        className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors"
                        title="Set as Default"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      title="Delete Address"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <p className="text-xs text-slate-500 text-center mt-4 border-t border-dark-border/40 pt-4">
              You can save up to 5 delivery addresses for quick checkout.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Profile;
