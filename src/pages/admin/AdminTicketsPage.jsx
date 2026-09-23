import React, { useState, useEffect } from 'react';
import { Ticket } from 'lucide-react';
import api from '../../lib/axios.js';

const STATUS_COLORS = { SOLD:'#10b981', USED:'#6b7280', TRANSFERRED:'#8b5cf6', LISTED:'#f59e0b', CANCELLED:'#ef4444', AVAILABLE:'#6366f1', TRANSFER_PENDING:'#f59e0b' };

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/admin/tickets')
      .then(({ data }) => {
        const list = Array.isArray(data?.data) ? data.data : Array.isArray(data?.tickets) ? data.tickets : Array.isArray(data) ? data : [];
        setTickets(list);
      })
      .catch((err) => { console.error(err); setTickets([]); })
      .finally(() => setLoading(false));
  }, []);

  const safeTickets = Array.isArray(tickets) ? tickets : [];
  const filtered = search ? safeTickets.filter(t => `${t.ticketNumber} ${t.eventId?.title} ${t.ownerId?.email}`.toLowerCase().includes(search.toLowerCase())) : safeTickets;
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', background: '#1a1a2e', borderRadius: '12px', padding: '10px 14px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '14px' }}>
        <Ticket size={16} color="#64748b" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tickets..." style={{ background: 'transparent', border: 'none', outline: 'none', color: '#e2e8f0', fontSize: '14px', flex: 1 }} />
      </div>
      <p style={{ color: '#475569', fontSize: '12px', margin: '0 0 12px' }}>{filtered.length} tickets</p>
      {loading ? [1,2,3].map(i => <div key={i} style={{ height: '80px', background: '#1a1a2e', borderRadius: '14px', marginBottom: '10px' }} />) :
       filtered.map(t => (
        <div key={t._id} style={{ background: '#1a1a2e', borderRadius: '14px', padding: '14px', marginBottom: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
            <p style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '13px', margin: 0, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.eventId?.title || 'Unknown Event'}</p>
            <span style={{ background: `${STATUS_COLORS[t.status] || '#6b7280'}20`, color: STATUS_COLORS[t.status] || '#6b7280', padding: '2px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 600, flexShrink: 0, marginLeft: '8px' }}>{t.status}</span>
          </div>
          <p style={{ color: '#64748b', fontSize: '11px', margin: '0 0 3px', fontFamily: 'monospace' }}>#{t.ticketNumber}</p>
          <p style={{ color: '#475569', fontSize: '11px', margin: 0 }}>{t.ownerId?.email || '—'} · {formatDate(t.createdAt)}</p>
        </div>
      ))}
    </div>
  );
}
