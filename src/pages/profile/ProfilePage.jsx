import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, User, Mail, Phone, Camera, LogOut, ChevronRight,
  Ticket, Calendar, Edit3, Key, Bell, RotateCcw, ShoppingBag,
  AlertCircle, Check, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../lib/axios.js';
import AppLayout from '../../components/layout/AppLayout.jsx';

function EditProfileModal({ user, onClose, onSaved }) {
  const [form, setForm] = useState({ firstName: user?.firstName || '', lastName: user?.lastName || '', phone: user?.phone || '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data } = await api.put('/auth/me', form);
      onSaved(data.user);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'flex-end', zIndex: 1000 }} onClick={onClose}>
      <div style={{ background: '#1e1e3a', borderRadius: '24px 24px 0 0', padding: '24px 20px 48px', width: '100%', border: '1px solid rgba(255,255,255,0.1)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ color: '#e2e8f0', fontSize: '18px', fontWeight: 700, margin: 0 }}>Edit Profile</h3>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={16} color="#94a3b8" /></button>
        </div>
        {error && <div style={{ background: 'rgba(239,68,68,0.1)', borderRadius: '10px', padding: '10px', marginBottom: '14px', color: '#f87171', fontSize: '13px' }}>{error}</div>}
        {['firstName', 'lastName', 'phone'].map(key => (
          <div key={key} style={{ marginBottom: '14px' }}>
            <label style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</label>
            <input value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
              style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
        ))}
        <button onClick={handleSave} disabled={loading}
          style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '14px', color: '#fff', fontWeight: 600, fontSize: '15px', cursor: 'pointer' }}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [showEdit, setShowEdit] = useState(false);
  const [ticketCount, setTicketCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);

  useEffect(() => {
    api.get('/tickets/my-tickets').then(({ data }) => setTicketCount(data.count || 0)).catch(() => {});
    api.get('/events/organizer/my-events').then(({ data }) => setEventCount((data.data || []).length)).catch(() => {});
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  const isApproved = user?.status === 'APPROVED' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  const menuItems = [
    { icon: <Edit3 size={18} />, label: 'Personal Info', action: () => setShowEdit(true) },
    { icon: <Ticket size={18} />, label: 'My Tickets', action: () => navigate('/tickets') },
    { icon: <Calendar size={18} />, label: 'My Events', action: () => navigate('/my-events') },
    { icon: <RotateCcw size={18} />, label: 'Transfer History', action: () => navigate('/transfers') },
    { icon: <ShoppingBag size={18} />, label: 'Resale Market', action: () => navigate('/resale') },
    { icon: <Bell size={18} />, label: 'Notifications', action: () => navigate('/notifications') },
    ...(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ? [{ icon: <Key size={18} />, label: 'Admin Panel', action: () => navigate('/admin') }] : []),
  ];

  return (
    <AppLayout>
      <div style={{ paddingBottom: '100px', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #6366f1 100%)', padding: '48px 16px 24px', textAlign: 'center' }}>
          <div style={{ position: 'relative', width: '88px', height: '88px', margin: '0 auto 12px' }}>
            <div style={{ width: '88px', height: '88px', borderRadius: '50%', border: '3px solid rgba(255,255,255,0.4)', overflow: 'hidden', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {user?.avatar?.url ? (
                <img src={user.avatar.url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <User size={40} color="rgba(255,255,255,0.8)" />
              )}
            </div>
          </div>
          <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 800, margin: '0 0 4px' }}>
            {user?.firstName} {user?.lastName}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', margin: '0 0 12px' }}>{user?.email}</p>
          <span style={{
            display: 'inline-block',
            padding: '4px 14px',
            background: isApproved ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)',
            border: `1px solid ${isApproved ? 'rgba(16,185,129,0.5)' : 'rgba(245,158,11,0.5)'}`,
            borderRadius: '20px',
            color: isApproved ? '#6ee7b7' : '#fcd34d',
            fontSize: '12px',
            fontWeight: 600,
          }}>
            {isApproved ? '✓ Approved' : user?.role === 'ADMIN' ? '✓ Admin' : '⏳ Pending Approval'}
          </span>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '16px' }}>
          {[
            { label: 'Tickets', value: ticketCount, icon: <Ticket size={20} color="#6366f1" /> },
            { label: 'Events Created', value: eventCount, icon: <Calendar size={20} color="#8b5cf6" /> },
          ].map(stat => (
            <div key={stat.label} style={{ background: '#1a1a2e', borderRadius: '16px', padding: '16px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>{stat.icon}</div>
              <p style={{ color: '#e2e8f0', fontSize: '24px', fontWeight: 800, margin: '0 0 2px' }}>{stat.value}</p>
              <p style={{ color: '#64748b', fontSize: '12px', margin: 0 }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Pending banner */}
        {!isApproved && (
          <div style={{ margin: '0 16px 16px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '14px', padding: '14px', display: 'flex', gap: '10px' }}>
            <AlertCircle size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: '1px' }} />
            <div>
              <p style={{ color: '#f59e0b', fontWeight: 600, fontSize: '13px', margin: '0 0 3px' }}>Account Awaiting Approval</p>
              <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0, lineHeight: '1.5' }}>
                An admin will review and approve your account. Once approved, you can create events and transfer tickets.
              </p>
            </div>
          </div>
        )}

        {/* Menu */}
        <div style={{ margin: '0 16px', background: '#1a1a2e', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
          {menuItems.map((item, i) => (
            <button key={i} onClick={item.action}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', background: 'none', border: 'none', borderBottom: i < menuItems.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', cursor: 'pointer', textAlign: 'left' }}>
              <div style={{ color: '#6366f1' }}>{item.icon}</div>
              <span style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 500, flex: 1 }}>{item.label}</span>
              <ChevronRight size={16} color="#374151" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <div style={{ padding: '16px' }}>
          <button onClick={handleLogout}
            style={{ width: '100%', padding: '14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '14px', color: '#ef4444', fontWeight: 600, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </div>

      {showEdit && <EditProfileModal user={user} onClose={() => setShowEdit(false)} onSaved={updateUser} />}
    </AppLayout>
  );
}
