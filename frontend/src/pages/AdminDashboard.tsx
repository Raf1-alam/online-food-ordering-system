import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Receipt, ShieldAlert, CheckCircle2, XCircle, RefreshCw, FileText } from 'lucide-react';
import Pagination from '../components/Pagination';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('USERS');
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    fetchData(page);
  }, [activeTab, page]);

  const fetchData = async (pageNumber: number) => {
    try {
      setLoading(true);
      if (activeTab === 'USERS') {
        const res = await api.get(`/admin/users?page=${pageNumber}&size=10`);
        setUsers(res.data.data.content || []);
        setTotalPages(res.data.data.totalPages || 0);
        setTotalElements(res.data.data.totalElements || 0);
      } else if (activeTab === 'TRANSACTIONS') {
        const res = await api.get(`/admin/transactions?page=${pageNumber}&size=10`);
        setTransactions(res.data.data.content || []);
        setTotalPages(res.data.data.totalPages || 0);
        setTotalElements(res.data.data.totalElements || 0);
      } else if (activeTab === 'APPLICATIONS') {
        const res = await api.get(`/applications?page=${pageNumber}&size=10`);
        setApplications(res.data.data.content || []);
        setTotalPages(res.data.data.totalPages || 0);
        setTotalElements(res.data.data.totalElements || 0);
      }
    } catch (err) {
      console.error(`Failed to fetch ${activeTab.toLowerCase()}`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await api.patch(`/admin/users/${userId}/toggle-status`);
      setUsers(users.map(u => u.id === userId ? { ...u, active: !u.active } : u));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle user status');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await api.patch(`/admin/users/${userId}/role`, { role: newRole });
      setUsers(users.map(u => u.id === userId ? res.data.data : u));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user role');
    }
  };

  const handleApproveApplication = async (appId) => {
    try {
      await api.post(`/applications/${appId}/approve`, "Approved by Admin");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve application');
    }
  };

  const handleRejectApplication = async (appId) => {
    try {
      await api.post(`/applications/${appId}/reject`, "Rejected by Admin");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject application');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto space-y-8">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <ShieldAlert className="h-8 w-8 text-primary-500" /> System Admin
          </h1>
          <p className="text-slate-400">Manage users, roles, and view global transactions.</p>
        </div>
        
        <div className="flex bg-dark-card border border-dark-border rounded-lg p-1">
          <button 
            className={`px-4 py-2 flex items-center gap-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'USERS' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-white'}`}
            onClick={() => { setActiveTab('USERS'); setPage(0); }}
          >
            <Users className="h-4 w-4" /> User Management
          </button>
          <button 
            className={`px-4 py-2 flex items-center gap-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'TRANSACTIONS' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-white'}`}
            onClick={() => { setActiveTab('TRANSACTIONS'); setPage(0); }}
          >
            <Receipt className="h-4 w-4" /> Transactions
          </button>
          <button 
            className={`px-4 py-2 flex items-center gap-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'APPLICATIONS' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-white'}`}
            onClick={() => { setActiveTab('APPLICATIONS'); setPage(0); }}
          >
            <FileText className="h-4 w-4" /> Applications
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin h-10 w-10 border-2 border-primary-500 rounded-full border-t-transparent"></div></div>
      ) : (
        <>
          <div className="glass-panel overflow-hidden">
            
            {/* USERS TAB */}
            {activeTab === 'USERS' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-dark-border/50 text-slate-300 text-sm border-b border-dark-border">
                      <th className="p-4 font-semibold">User</th>
                      <th className="p-4 font-semibold">Contact</th>
                      <th className="p-4 font-semibold">Role</th>
                      <th className="p-4 font-semibold text-center">Status</th>
                      <th className="p-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {users.map((user: any) => (
                      <tr key={user.id} className="border-b border-dark-border hover:bg-dark-border/20 transition-colors">
                        <td className="p-4">
                          <div className="font-medium text-white">{user.fullName}</div>
                          <div className="text-xs text-slate-500">ID: {user.id}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-slate-300">{user.email}</div>
                          <div className="text-slate-500">{user.phone || 'N/A'}</div>
                        </td>
                        <td className="p-4">
                          <select 
                            className="bg-dark border border-dark-border rounded text-slate-300 text-xs p-1.5 focus:outline-none focus:border-primary-500"
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          >
                            <option value="CUSTOMER">Customer</option>
                            <option value="RESTAURANT_STAFF">Staff</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${user.active ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/20' : 'bg-red-900/30 text-red-400 border border-red-500/20'}`}>
                            {user.active ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            {user.active ? 'Active' : 'Suspended'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => handleToggleStatus(user.id)}
                            className="text-xs font-medium text-slate-400 hover:text-white transition-colors"
                          >
                            {user.active ? 'Suspend' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr><td colSpan={5} className="p-8 text-center text-slate-500">No users found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* TRANSACTIONS TAB */}
            {activeTab === 'TRANSACTIONS' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-dark-border/50 text-slate-300 text-sm border-b border-dark-border">
                      <th className="p-4 font-semibold">Ref / Order</th>
                      <th className="p-4 font-semibold">Customer</th>
                      <th className="p-4 font-semibold">Restaurant</th>
                      <th className="p-4 font-semibold">Method</th>
                      <th className="p-4 font-semibold text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {transactions.map((trx: any) => (
                      <tr key={trx.paymentId} className="border-b border-dark-border hover:bg-dark-border/20 transition-colors">
                        <td className="p-4">
                          <div className="font-mono text-xs text-primary-400">{trx.transactionRef}</div>
                          <div className="text-xs text-slate-500">Order #{trx.orderId}</div>
                        </td>
                        <td className="p-4 text-slate-300">{trx.customerName}</td>
                        <td className="p-4 text-slate-300">{trx.restaurantName}</td>
                        <td className="p-4">
                          <span className="bg-dark-card border border-dark-border px-2 py-1 rounded text-xs font-medium text-slate-300">
                            {trx.paymentMethod}
                          </span>
                        </td>
                        <td className="p-4 text-right font-bold text-emerald-400">
                          ${trx.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                    {transactions.length === 0 && (
                      <tr><td colSpan={5} className="p-8 text-center text-slate-500">No transactions found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* APPLICATIONS TAB */}
            {activeTab === 'APPLICATIONS' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-dark-border/50 text-slate-300 text-sm border-b border-dark-border">
                      <th className="p-4 font-semibold">User / Date</th>
                      <th className="p-4 font-semibold">Restaurant Info</th>
                      <th className="p-4 font-semibold">License</th>
                      <th className="p-4 font-semibold text-center">Status</th>
                      <th className="p-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {applications.map((app: any) => (
                      <tr key={app.id} className="border-b border-dark-border hover:bg-dark-border/20 transition-colors">
                        <td className="p-4">
                          <div className="font-medium text-white">{app.userName}</div>
                          <div className="text-xs text-slate-500">{new Date(app.createdAt).toLocaleDateString()}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-primary-400 font-medium">{app.restaurantName}</div>
                          <div className="text-slate-400 text-xs">{app.address}</div>
                          <div className="text-slate-400 text-xs">{app.phone}</div>
                        </td>
                        <td className="p-4">
                          {app.businessLicenseUrl ? (
                            <a href={app.businessLicenseUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline">View License</a>
                          ) : (
                            <span className="text-xs text-slate-500">N/A</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            app.status === 'APPROVED' ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/20' : 
                            app.status === 'REJECTED' ? 'bg-red-900/30 text-red-400 border border-red-500/20' : 
                            'bg-amber-900/30 text-amber-400 border border-amber-500/20'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {app.status === 'PENDING' && (
                            <>
                              <button 
                                onClick={() => handleApproveApplication(app.id)}
                                className="text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded transition-colors"
                              >
                                Approve
                              </button>
                              <button 
                                onClick={() => handleRejectApplication(app.id)}
                                className="text-xs font-medium bg-dark-border hover:bg-red-600/80 text-white px-3 py-1 rounded transition-colors"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                    {applications.length === 0 && (
                      <tr><td colSpan={5} className="p-8 text-center text-slate-500">No applications found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

          </div>
          
          <Pagination 
            currentPage={page}
            totalPages={totalPages}
            totalElements={totalElements}
            size={10}
            onPageChange={(p) => setPage(p)}
          />
        </>
      )}
    </motion.div>
  );
};

export default AdminDashboard;
