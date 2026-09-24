import React, { useState, useEffect } from 'react';
import { Search, Ticket } from 'lucide-react';
import api from '../../lib/axios.js';

const STATUS_BADGE = {
  SOLD:             { bg: '#F0FDF4', color: '#16A34A' },
  USED:             { bg: '#F3F4F6', color: '#6B7280' },
  TRANSFERRED:      { bg: '#EFF6FF', color: '#026CDF' },
  LISTED:           { bg: '#FFF7ED', color: '#D97706' },
  CANCELLED:        { bg: '#FEF2F2', color: '#DC2626' },
  AVAILABLE:        { bg: '#EFF6FF', color: '#026CDF' },
  TRANSFER_PENDING: { bg: '#FFF7ED', color: '#D97706' },
};

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
  const filtered = search
    ? safeTickets.filter(t => `${t.ticketNumber} ${t.eventId?.title} ${t.ownerId?.email}`.toLowerCase().includes(search.toLowerCase()))
    : safeTickets;

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <Ticket size={22} color="#1F1F1F" />
          <h2 style={{ color: '#1F1F1F', fontSize: '22px', fontWeight: 800, margin: 0 }}>Tickets</h2>
        </div>
        <p style={{ color: '#6B6B6B', fontSize: '14px', margin: 0 }}>{filtered.length} ticket{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Search */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #E5E5E5', borderRadius: '6px', padding: '8px 12px', background: '#FAFAFA' }}>
          <Search size={16} color="#6B6B6B" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by ticket #, event, or holder email…"
            style={{ background: 'transparent', border: 'none', outline: 'none', color: '#1F1F1F', fontSize: '14px', flex: 1 }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: '8px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#6B6B6B', fontSize: '14px' }}>Loading tickets…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <Ticket size={32} color="#D1D5DB" style={{ marginBottom: '10px' }} />
            <p style={{ color: '#6B6B6B', fontSize: '14px', margin: 0 }}>No tickets found</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E5E5' }}>
                  {['Ticket #', 'Event', 'Holder', 'Type', 'Price', 'Status', 'Date'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#6B6B6B', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => {
                  const badge = STATUS_BADGE[t.status] || { bg: '#F3F4F6', color: '#6B7280' };
                  return (
                    <tr key={t._id} style={{ borderBottom: '1px solid #F3F4F6', transition: 'background 0.1s' }} onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'} onMouseLeave={e => e.currentTarget.style.background = ''}>
                      <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: '12px', color: '#6B6B6B', whiteSpace: 'nowrap' }}>#{t.ticketNumber}</td>
                      <td style={{ padding: '14px 16px', color: '#1F1F1F', fontWeight: 600, fontSize: '14px', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.eventId?.title || '—'}</td>
                      <td style={{ padding: '14px 16px', color: '#6B6B6B', fontSize: '13px' }}>{t.ownerId?.email || '—'}</td>
                      <td style={{ padding: '14px 16px', color: '#6B6B6B', fontSize: '13px', whiteSpace: 'nowrap' }}>{t.ticketTypeId?.name || t.type || '—'}</td>
                      <td style={{ padding: '14px 16px', color: '#1F1F1F', fontWeight: 600, fontSize: '13px', whiteSpace: 'nowrap' }}>
                        {t.price === 0 ? 'FREE' : t.price ? `$${Number(t.price).toLocaleString()}` : '—'}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ display: 'inline-block', background: badge.bg, color: badge.color, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}>{t.status}</span>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#6B6B6B', fontSize: '13px', whiteSpace: 'nowrap' }}>{formatDate(t.createdAt)}</td>
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
