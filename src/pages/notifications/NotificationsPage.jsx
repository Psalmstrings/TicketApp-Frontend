import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, Ticket, Check, AlertCircle, User, Info } from 'lucide-react';
import api from '../../lib/axios.js';
import AppLayout from '../../components/layout/AppLayout.jsx';

const TYPE_CONFIG = {
  TICKET_ISSUED:      { color: '#16A34A', bg: '#F0FDF4' },
  TRANSFER_RECEIVED:  { color: '#026CDF', bg: '#EFF6FF' },
  TRANSFER_ACCEPTED:  { color: '#16A34A', bg: '#F0FDF4' },
  TRANSFER_DECLINED:  { color: '#DC2626', bg: '#FEF2F2' },
  ACCOUNT_CREATED:    { color: '#026CDF', bg: '#EFF6FF' },
  ACCOUNT_APPROVED:   { color: '#16A34A', bg: '#F0FDF4' },
  ACCOUNT_SUSPENDED:  { color: '#DC2626', bg: '#FEF2F2' },
  RESALE_SOLD:        { color: '#D97706', bg: '#FFF7ED' },
  RESALE_PURCHASED:   { color: '#16A34A', bg: '#F0FDF4' },
};

const TYPE_ICON = {
  TICKET_ISSUED:      <Ticket size={16} />,
  TRANSFER_RECEIVED:  <Bell size={16} />,
  TRANSFER_ACCEPTED:  <Check size={16} />,
  TRANSFER_DECLINED:  <AlertCircle size={16} />,
  ACCOUNT_CREATED:    <User size={16} />,
  ACCOUNT_APPROVED:   <Check size={16} />,
  ACCOUNT_SUSPENDED:  <AlertCircle size={16} />,
  RESALE_SOLD:        <Ticket size={16} />,
  RESALE_PURCHASED:   <Ticket size={16} />,
};

function groupByDate(notifications) {
  const groups = {};
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
  (Array.isArray(notifications) ? notifications : []).forEach(n => {
    const d = new Date(n.createdAt); d.setHours(0, 0, 0, 0);
    let key;
    if (d.getTime() === today.getTime()) key = 'Today';
    else if (d.getTime() === yesterday.getTime()) key = 'Yesterday';
    else key = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    if (!groups[key]) groups[key] = [];
    groups[key].push(n);
  });
  return groups;
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/notifications/my-notifications');
      const list = Array.isArray(data?.data) ? data.data : Array.isArray(data?.notifications) ? data.notifications : Array.isArray(data) ? data : [];
      setNotifications(list);
    } catch (err) { console.error(err); setNotifications([]); }
    finally { setLoading(false); }
  };

  const markRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => (Array.isArray(prev) ? prev : []).map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {}
  };

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => (Array.isArray(prev) ? prev : []).map(n => ({ ...n, read: true })));
    } catch (err) {}
  };

  const unreadCount = (Array.isArray(notifications) ? notifications : []).filter(n => !n?.read).length;
  const groups = groupByDate(notifications);

  const timeAgo = (d) => {
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <AppLayout>
      <div style={{ background: '#F5F5F5', minHeight: '100vh', paddingBottom: '80px' }}>

        {/* Header */}
        <div style={{ background: '#FFFFFF', borderBottom: '1px solid #E5E5E5', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => navigate(-1)} style={{ background: '#F5F5F5', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ChevronLeft size={20} color="#1F1F1F" />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ color: '#1F1F1F', fontSize: '18px', fontWeight: 800, margin: 0 }}>Notifications</h1>
              {unreadCount > 0 && (
                <span style={{ background: '#026CDF', color: '#FFFFFF', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', lineHeight: '18px' }}>
                  {unreadCount}
                </span>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: '#026CDF', fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: '4px 8px' }}>
              Mark all read
            </button>
          )}
        </div>

        <div style={{ padding: '16px', maxWidth: '640px', margin: '0 auto' }}>

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ width: '32px', height: '32px', border: '3px solid #E5E5E5', borderTopColor: '#026CDF', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
              <p style={{ color: '#6B6B6B', fontSize: '14px', margin: 0 }}>Loading notifications…</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </div>
          )}

          {/* Empty state */}
          {!loading && notifications.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <div style={{ width: '64px', height: '64px', background: '#F3F4F6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Bell size={28} color="#9CA3AF" />
              </div>
              <h3 style={{ color: '#1F1F1F', fontSize: '16px', fontWeight: 700, margin: '0 0 6px' }}>No notifications yet</h3>
              <p style={{ color: '#6B6B6B', fontSize: '13px', margin: 0 }}>Activity and updates will appear here.</p>
            </div>
          )}

          {/* Grouped notifications */}
          {!loading && Object.entries(groups).map(([dateLabel, items]) => (
            <div key={dateLabel} style={{ marginBottom: '20px' }}>
              <p style={{ color: '#6B6B6B', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px 2px' }}>
                {dateLabel}
              </p>
              <div style={{ background: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: '10px', overflow: 'hidden' }}>
                {items.map((n, idx) => {
                  const cfg = TYPE_CONFIG[n.type] || { color: '#6B6B6B', bg: '#F3F4F6' };
                  const icon = TYPE_ICON[n.type] || <Info size={16} />;
                  return (
                    <button
                      key={n._id}
                      onClick={() => !n.read && markRead(n._id)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 16px',
                        background: n.read ? '#FFFFFF' : '#FAFBFF',
                        border: 'none', cursor: 'pointer', textAlign: 'left',
                        borderBottom: idx < items.length - 1 ? '1px solid #F3F4F6' : 'none',
                        borderLeft: !n.read ? '3px solid #026CDF' : '3px solid transparent',
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                      onMouseLeave={e => e.currentTarget.style.background = n.read ? '#FFFFFF' : '#FAFBFF'}
                    >
                      {/* Icon circle */}
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: cfg.color }}>
                        {icon}
                      </div>
                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ color: '#1F1F1F', fontSize: '13px', fontWeight: n.read ? 400 : 600, margin: '0 0 2px', lineHeight: '1.4' }}>
                          {n.message || n.title || 'Notification'}
                        </p>
                        {n.body && n.body !== n.message && (
                          <p style={{ color: '#6B6B6B', fontSize: '12px', margin: '0 0 4px', lineHeight: '1.4' }}>{n.body}</p>
                        )}
                        <p style={{ color: '#9CA3AF', fontSize: '11px', margin: 0 }}>{timeAgo(n.createdAt)}</p>
                      </div>
                      {/* Unread dot */}
                      {!n.read && (
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#026CDF', flexShrink: 0, marginTop: '4px' }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
