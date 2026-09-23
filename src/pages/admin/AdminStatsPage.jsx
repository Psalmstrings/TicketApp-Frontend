import React, { useState, useEffect } from 'react';
import { Users, Clock, CheckCircle, XCircle, BarChart3, Calendar, Ticket, ShoppingBag } from 'lucide-react';
import api from '../../lib/axios.js';

export default function AdminStatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then(({ data }) => setStats(data.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { label: 'Total Users', value: stats.totalUsers, icon: <Users size={22} />, color: '#6366f1', bg: 'rgba(99,102,241,0.15)' },
    { label: 'Pending Approval', value: stats.pendingUsers, icon: <Clock size={22} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
    { label: 'Approved Users', value: stats.approvedUsers, icon: <CheckCircle size={22} />, color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
    { label: 'Suspended', value: stats.suspendedUsers, icon: <XCircle size={22} />, color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
    { label: 'Total Events', value: stats.totalEvents, icon: <Calendar size={22} />, color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)' },
    { label: 'Published Events', value: stats.publishedEvents, icon: <BarChart3 size={22} />, color: '#6366f1', bg: 'rgba(99,102,241,0.15)' },
    { label: 'Total Tickets', value: stats.totalTickets, icon: <Ticket size={22} />, color: '#ec4899', bg: 'rgba(236,72,153,0.15)' },
    { label: 'Total Orders', value: stats.totalOrders, icon: <ShoppingBag size={22} />, color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
  ] : [];

  return (
    <div style={{ padding: '20px 16px' }}>
      <h2 style={{ color: '#e2e8f0', fontSize: '16px', fontWeight: 700, margin: '0 0 16px' }}>Platform Overview</h2>
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[1,2,3,4,5,6,7,8].map(i => <div key={i} style={{ height: '90px', background: '#1a1a2e', borderRadius: '16px' }} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {cards.map(card => (
            <div key={card.label} style={{ background: '#1a1a2e', borderRadius: '16px', padding: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', color: card.color }}>
                {card.icon}
              </div>
              <p style={{ color: '#e2e8f0', fontSize: '24px', fontWeight: 800, margin: '0 0 2px' }}>{card.value ?? '—'}</p>
              <p style={{ color: '#64748b', fontSize: '12px', margin: 0 }}>{card.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
