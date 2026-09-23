import React, { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import api from '../../lib/axios.js';

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
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
  const STATUS = { PAID: '#10b981', PENDING: '#f59e0b', CANCELLED: '#ef4444', REFUNDED: '#6b7280' };
  return (
    <div style={{ padding: '16px' }}>
      <p style={{ color: '#475569', fontSize: '12px', margin: '0 0 12px' }}>{(Array.isArray(orders) ? orders : []).length} orders</p>
      {loading ? [1,2,3].map(i => <div key={i} style={{ height: '70px', background: '#1a1a2e', borderRadius: '14px', marginBottom: '10px' }} />)
       : (Array.isArray(orders) ? orders : []).map(o => (
        <div key={o._id} style={{ background: '#1a1a2e', borderRadius: '14px', padding: '14px', marginBottom: '8px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '13px', margin: '0 0 3px', fontFamily: 'monospace' }}>{o.orderNumber}</p>
            <p style={{ color: '#64748b', fontSize: '12px', margin: '0 0 2px' }}>{o.userId?.email || '—'}</p>
            <p style={{ color: '#475569', fontSize: '11px', margin: 0 }}>{formatDate(o.createdAt)}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: '#10b981', fontWeight: 700, fontSize: '14px', margin: '0 0 4px' }}>
              {o.totalAmount === 0 ? 'FREE' : `₦${o.totalAmount?.toLocaleString()}`}
            </p>
            <span style={{ background: `${STATUS[o.status] || '#6b7280'}20`, color: STATUS[o.status] || '#6b7280', padding: '2px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 600 }}>{o.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
