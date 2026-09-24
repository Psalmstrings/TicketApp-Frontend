import React, { useState, useEffect } from 'react';
import { Users, Clock, CheckCircle, XCircle, BarChart3, Calendar, Ticket, ShoppingBag } from 'lucide-react';
import TicketmasterSpinner from '../../components/ui/TicketmasterSpinner.jsx';
import api from '../../lib/axios.js';

export default function AdminStatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/stats')
      .then(({ data }) => setStats(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const cards = stats
    ? [
        { label: 'Total Users', value: stats.totalUsers, icon: <Users size={22} />, color: '#026CDF', bg: '#EBF3FD' },
        { label: 'Pending Approval', value: stats.pendingUsers, icon: <Clock size={22} />, color: '#D97706', bg: '#FFFBEB' },
        { label: 'Approved Users', value: stats.approvedUsers, icon: <CheckCircle size={22} />, color: '#059669', bg: '#ECFDF5' },
        { label: 'Suspended Accounts', value: stats.suspendedUsers, icon: <XCircle size={22} />, color: '#DC2626', bg: '#FEF2F2' },
        { label: 'Total Events', value: stats.totalEvents, icon: <Calendar size={22} />, color: '#7C3AED', bg: '#F5F3FF' },
        { label: 'Published Events', value: stats.publishedEvents, icon: <BarChart3 size={22} />, color: '#026CDF', bg: '#EBF3FD' },
        { label: 'Total Tickets Issued', value: stats.totalTickets, icon: <Ticket size={22} />, color: '#EA580C', bg: '#FFF7ED' },
        { label: 'Total Orders Placed', value: stats.totalOrders, icon: <ShoppingBag size={22} />, color: '#059669', bg: '#ECFDF5' },
      ]
    : [];

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1F1F1F', margin: '0 0 4px 0' }}>
          Platform Analytics & Metrics
        </h2>
        <p style={{ fontSize: '13px', color: '#6B6B6B', margin: 0 }}>
          High-level operational overview across user status, active catalog, tickets, and fulfillment.
        </p>
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center' }}>
          <TicketmasterSpinner size="md" message="Loading analytics..." />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {cards.map((card) => (
            <div
              key={card.label}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                padding: '20px',
                border: '1px solid #E5E5E5',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: card.bg,
                  color: card.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px',
                }}
              >
                {card.icon}
              </div>
              <p style={{ fontSize: '28px', fontWeight: 900, color: '#1F1F1F', margin: '0 0 2px 0' }}>
                {card.value ?? 0}
              </p>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#6B6B6B', margin: 0 }}>{card.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
