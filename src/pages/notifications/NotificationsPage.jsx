import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Check, CheckCheck, Ticket, User, Calendar, AlertCircle, Info } from 'lucide-react';
import api from '../../lib/axios.js';
import AppLayout from '../../components/layout/AppLayout.jsx';

const TYPE_ICON = {
  TICKET_ISSUED: <Ticket size={18} color="#10b981" />,
  TRANSFER_RECEIVED: <Bell size={18} color="#6366f1" />,
  TRANSFER_ACCEPTED: <Check size={18} color="#10b981" />,
  TRANSFER_DECLINED: <AlertCircle size={18} color="#ef4444" />,
  ACCOUNT_CREATED: <User size={18} color="#6366f1" />,
  ACCOUNT_APPROVED: <Check size={18} color="#10b981" />,
  ACCOUNT_SUSPENDED: <AlertCircle size={18} color="#ef4444" />,
  RESALE_SOLD: <Ticket size={18} color="#f59e0b" />,
  RESALE_PURCHASED: <Ticket size={18} color="#10b981" />,
};

function groupByDate(notifications) {
  const groups = {};
  const today = new Date();
  today.setHours(0,0,0,0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  (Array.isArray(notifications) ? notifications : []).forEach(n => {
    const d = new Date(n.createdAt);
    d.setHours(0,0,0,0);
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
      <div style={{ paddingBottom: '80px', minHeight: '100vh' }}>
        <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #2d1b69)', padding: '48px 16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <ArrowLeft size={18} color="#fff" />
              </button>
              <h1 style={{ color: '#fff', fontSize: '20px', fontWeight: 800, margin: 0 }}>Notifications</h1>
            </div>
            {unreadCount > 0 && (
              <button onClick={markAllRead} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '10px', padding: '8px 12px', color: '#e2e8f0', fontSize: '12px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCheck size={14} />
                Mark all read
              </button>
            )}
          </div>
        </div>

        <div style={{ padding: '12px 16px' }}>
          {loading ? (
            [1,2,3,4].map(i => <div key={i} style={{ height: '72px', background: '#1a1a2e', borderRadius: '14px', marginBottom: '8px' }} />)
          ) : !Array.isArray(notifications) || notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Bell size={40} color="#374151" style={{ marginBottom: '12px' }} />
              <p style={{ color: '#64748b', fontSize: '16px', fontWeight: 600, margin: '0 0 6px' }}>No notifications</p>
              <p style={{ color: '#374151', fontSize: '13px', margin: 0 }}>You're all caught up!</p>
            </div>
          ) : (
            Object.entries(groups).map(([date, items]) => (
              <div key={date}>
                <p style={{ color: '#475569', fontSize: '12px', fontWeight: 600, margin: '12px 0 8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {date}
                </p>
                {items.map(n => (
                  <div key={n._id}
                    onClick={() => !n.read && markRead(n._id)}
                    style={{ background: n.read ? '#1a1a2e' : 'rgba(99,102,241,0.06)', borderRadius: '14px', padding: '14px', marginBottom: '8px', border: `1px solid ${n.read ? 'rgba(255,255,255,0.05)' : 'rgba(99,102,241,0.2)'}`, display: 'flex', gap: '12px', cursor: n.read ? 'default' : 'pointer', position: 'relative' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {TYPE_ICON[n.type] || <Info size={18} color="#6366f1" />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: '#e2e8f0', fontWeight: n.read ? 500 : 700, fontSize: '13px', margin: '0 0 3px' }}>{n.title}</p>
                      <p style={{ color: '#64748b', fontSize: '12px', margin: '0 0 4px', lineHeight: '1.4' }}>{n.message}</p>
                      <p style={{ color: '#374151', fontSize: '11px', margin: 0 }}>{timeAgo(n.createdAt)}</p>
                    </div>
                    {!n.read && (
                      <div style={{ position: 'absolute', top: '14px', right: '14px', width: '8px', height: '8px', background: '#6366f1', borderRadius: '50%' }} />
                    )}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
