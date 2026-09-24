import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, LogOut, ChevronRight,
  Ticket, Calendar, Edit3, Key, Bell, RotateCcw, ShoppingBag,
  AlertCircle, X, Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../lib/axios.js';
import AppLayout from '../../components/layout/AppLayout.jsx';

function EditProfileModal({ user, onClose, onSaved }) {
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setLoading(true);
    setError('');
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

  const fields = [
    { key: 'firstName', label: 'First Name', icon: <User size={16} color="#6B6B6B" /> },
    { key: 'lastName', label: 'Last Name', icon: <User size={16} color="#6B6B6B" /> },
    { key: 'phone', label: 'Phone Number', icon: <Phone size={16} color="#6B6B6B" /> },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }} onClick={onClose}>
      <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '28px', width: '100%', maxWidth: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ color: '#1F1F1F', fontSize: '18px', fontWeight: 700, margin: 0 }}>Edit Profile</h3>
          <button onClick={onClose} style={{ background: '#F5F5F5', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={16} color="#6B6B6B" />
          </button>
        </div>

        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '10px 12px', marginBottom: '16px', color: '#DC2626', fontSize: '13px' }}>
            {error}
          </div>
        )}

        {fields.map(({ key, label, icon }) => (
          <div key={key} style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', color: '#1F1F1F', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>{label}</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>{icon}</div>
              <input
                value={form[key]}
                onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                style={{ width: '100%', padding: '12px 12px 12px 40px', background: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: '6px', color: '#1F1F1F', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#026CDF'}
                onBlur={e => e.target.style.borderColor = '#E5E5E5'}
              />
            </div>
          </div>
        ))}

        <button
          onClick={handleSave}
          disabled={loading}
          style={{ width: '100%', padding: '12px', background: '#026CDF', border: 'none', borderRadius: '6px', color: '#FFFFFF', fontWeight: 700, fontSize: '14px', cursor: 'pointer', marginTop: '4px' }}
        >
          {loading ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

const STATUS_CONFIG = {
  APPROVED: { label: 'Approved', bg: '#F0FDF4', color: '#16A34A' },
  PENDING: { label: 'Pending Approval', bg: '#FFF7ED', color: '#D97706' },
  SUSPENDED: { label: 'Suspended', bg: '#FEF2F2', color: '#DC2626' },
};

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
  const isPending = user?.status === 'PENDING';

  const statusCfg = STATUS_CONFIG[user?.status] || STATUS_CONFIG.PENDING;
  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase();

  const menuItems = [
    { icon: <Edit3 size={18} />, label: 'Personal Info', sublabel: 'Update name, phone', action: () => setShowEdit(true) },
    { icon: <Ticket size={18} />, label: 'My Tickets', sublabel: `${ticketCount} ticket${ticketCount !== 1 ? 's' : ''}`, action: () => navigate('/tickets') },
    { icon: <Calendar size={18} />, label: 'My Events', sublabel: `${eventCount} event${eventCount !== 1 ? 's' : ''}`, action: () => navigate('/my-events') },
    { icon: <RotateCcw size={18} />, label: 'Transfer History', sublabel: 'Sent & received', action: () => navigate('/transfers') },
    { icon: <ShoppingBag size={18} />, label: 'Resale Marketplace', sublabel: 'Fan-to-fan tickets', action: () => navigate('/resale') },
    { icon: <Bell size={18} />, label: 'Notifications', sublabel: 'Activity & updates', action: () => navigate('/notifications') },
    ...(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN'
      ? [{ icon: <Key size={18} />, label: 'Admin Console', sublabel: 'Manage platform', action: () => navigate('/admin') }]
      : []),
  ];

  return (
    <AppLayout>
      <div style={{ background: '#F5F5F5', minHeight: '100vh', paddingBottom: '80px' }}>

        {/* Profile Hero Card */}
        <div style={{ background: '#FFFFFF', borderBottom: '1px solid #E5E5E5', marginBottom: '16px' }}>
          {/* Blue strip */}
          <div style={{ background: '#026CDF', height: '72px' }} />
          {/* Avatar + info */}
          <div style={{ padding: '0 20px 24px', marginTop: '-36px' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#EFF6FF', border: '3px solid #FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '12px' }}>
              {user?.avatar?.url
                ? <img src={user.avatar.url} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                : <span style={{ color: '#026CDF', fontWeight: 800, fontSize: '22px' }}>{initials || 'U'}</span>
              }
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ color: '#1F1F1F', fontSize: '20px', fontWeight: 800, margin: '0 0 2px' }}>
                  {user?.firstName} {user?.lastName}
                </h2>
                <p style={{ color: '#6B6B6B', fontSize: '13px', margin: '0 0 8px' }}>{user?.email}</p>
                <span style={{ background: statusCfg.bg, color: statusCfg.color, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                  {statusCfg.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: '0 16px' }}>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px' }}>
            {[
              { label: 'Tickets', value: ticketCount },
              { label: 'Events', value: eventCount },
              { label: 'Balance', value: `$${(user?.balance || 0).toLocaleString()}` },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: '8px', padding: '14px 12px', textAlign: 'center' }}>
                <p style={{ color: '#1F1F1F', fontWeight: 800, fontSize: '18px', margin: '0 0 2px' }}>{value}</p>
                <p style={{ color: '#6B6B6B', fontSize: '11px', margin: 0, fontWeight: 500 }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Pending status alert */}
          {isPending && (
            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '8px', padding: '14px 16px', marginBottom: '16px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <Info size={16} color="#1D4ED8" style={{ flexShrink: 0, marginTop: '1px' }} />
              <p style={{ color: '#1D4ED8', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>
                <strong>Account pending approval.</strong> You can browse and buy tickets. Creating events and transfers require admin approval.
              </p>
            </div>
          )}

          {/* Menu items */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px' }}>
            {menuItems.map((item, idx) => (
              <button
                key={item.label}
                onClick={item.action}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px',
                  background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                  borderBottom: idx < menuItems.length - 1 ? '1px solid #F3F4F6' : 'none',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <div style={{ width: '36px', height: '36px', background: '#EFF6FF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#026CDF' }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#1F1F1F', fontWeight: 600, fontSize: '14px', margin: '0 0 1px' }}>{item.label}</p>
                  {item.sublabel && <p style={{ color: '#6B6B6B', fontSize: '12px', margin: 0 }}>{item.sublabel}</p>}
                </div>
                <ChevronRight size={16} color="#6B6B6B" />
              </button>
            ))}
          </div>

          {/* Sign out */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: '8px', overflow: 'hidden' }}>
            <button
              onClick={handleLogout}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.1s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <div style={{ width: '36px', height: '36px', background: '#FEF2F2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <LogOut size={18} color="#DC2626" />
              </div>
              <span style={{ color: '#DC2626', fontWeight: 600, fontSize: '14px', flex: 1 }}>Sign Out</span>
            </button>
          </div>

        </div>
      </div>

      {showEdit && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEdit(false)}
          onSaved={(updatedUser) => { if (updateUser) updateUser(updatedUser); }}
        />
      )}
    </AppLayout>
  );
}
