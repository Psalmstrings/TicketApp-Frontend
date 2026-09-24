import React, { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import api from '../../lib/axios.js';

const STATUS_BADGE = {
  PAID:      { bg: '#F0FDF4', color: '#16A34A' },
  PENDING:   { bg: '#FFF7ED', color: '#D97706' },
  CANCELLED: { bg: '#FEF2F2', color: '#DC2626' },
  REFUNDED:  { bg: '#F3F4F6', color: '#6B7280' },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/orders')
      .then(({ data }) => {
        const list = Array.isArray(data?.data) ? data.data : Array.isArray(data?.orders) ? data.orders : Array.isArray(data) ? data : [];
        setOrders(list);
      })
      .catch((err) => { console.error(err); setOrders([]); })
      .finally(() => setLoading(false));
  }, []);

  const safeOrders = Array.isArray(orders) ? orders : [];
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  // Summary stats
  const totalRevenue = safeOrders.filter(o => o.status === 'PAID').reduce((s, o) => s + (o.totalAmount || 0), 0);
  const paidCount = safeOrders.filter(o => o.status === 'PAID').length;

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <ShoppingBag size={22} color="#1F1F1F" />
          <h2 style={{ color: '#1F1F1F', fontSize: '22px', fontWeight: 800, margin: 0 }}>Orders</h2>
        </div>
        <p style={{ color: '#6B6B6B', fontSize: '14px', margin: 0 }}>{safeOrders.length} order{safeOrders.length !== 1 ? 's' : ''} total</p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Total Orders', value: safeOrders.length, color: '#1F1F1F' },
          { label: 'Paid Orders', value: paidCount, color: '#16A34A' },
          { label: 'Total Revenue', value: totalRevenue === 0 ? '$0' : `$${totalRevenue.toLocaleString()}`, color: '#026CDF' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: '8px', padding: '16px 18px' }}>
            <p style={{ color, fontSize: '22px', fontWeight: 800, margin: '0 0 2px' }}>{value}</p>
            <p style={{ color: '#6B6B6B', fontSize: '12px', margin: 0, fontWeight: 500 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: '8px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#6B6B6B', fontSize: '14px' }}>Loading orders…</div>
        ) : safeOrders.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <ShoppingBag size={32} color="#D1D5DB" style={{ marginBottom: '10px' }} />
            <p style={{ color: '#6B6B6B', fontSize: '14px', margin: 0 }}>No orders yet</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E5E5' }}>
                  {['Order #', 'Buyer', 'Event', 'Qty', 'Total', 'Status', 'Date'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#6B6B6B', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {safeOrders.map(o => {
                  const badge = STATUS_BADGE[o.status] || { bg: '#F3F4F6', color: '#6B7280' };
                  return (
                    <tr key={o._id} style={{ borderBottom: '1px solid #F3F4F6', transition: 'background 0.1s' }} onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'} onMouseLeave={e => e.currentTarget.style.background = ''}>
                      <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: '12px', color: '#6B6B6B', whiteSpace: 'nowrap' }}>{o.orderNumber}</td>
                      <td style={{ padding: '14px 16px', color: '#6B6B6B', fontSize: '13px' }}>{o.userId?.email || '—'}</td>
                      <td style={{ padding: '14px 16px', color: '#1F1F1F', fontWeight: 600, fontSize: '14px', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {o.eventId?.title || '—'}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#6B6B6B', fontSize: '13px', textAlign: 'center' }}>{o.quantity || 1}</td>
                      <td style={{ padding: '14px 16px', color: '#1F1F1F', fontWeight: 700, fontSize: '14px', whiteSpace: 'nowrap' }}>
                        {o.totalAmount === 0 ? 'FREE' : `$${Number(o.totalAmount || 0).toLocaleString()}`}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ display: 'inline-block', background: badge.bg, color: badge.color, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}>{o.status}</span>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#6B6B6B', fontSize: '13px', whiteSpace: 'nowrap' }}>{formatDate(o.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
