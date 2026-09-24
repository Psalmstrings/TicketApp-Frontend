import React, { useState, useEffect } from 'react';
import { FileText, Search } from 'lucide-react';
import api from '../../lib/axios.js';

const ACTION_COLORS = {
  USER_APPROVED:    { bg: '#F0FDF4', color: '#16A34A' },
  USER_SUSPENDED:   { bg: '#FEF2F2', color: '#DC2626' },
  USER_DELETED:     { bg: '#FEF2F2', color: '#DC2626' },
  EVENT_APPROVED:   { bg: '#F0FDF4', color: '#16A34A' },
  EVENT_REJECTED:   { bg: '#FEF2F2', color: '#DC2626' },
  TICKET_ISSUED:    { bg: '#EFF6FF', color: '#026CDF' },
  TICKET_USED:      { bg: '#F3F4F6', color: '#6B7280' },
  ORDER_CREATED:    { bg: '#EFF6FF', color: '#026CDF' },
  TRANSFER_SENT:    { bg: '#FFF7ED', color: '#D97706' },
  TRANSFER_ACCEPTED:{ bg: '#F0FDF4', color: '#16A34A' },
};

export default function AdminLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/admin/audit-logs')
      .then(({ data }) => {
        const list = Array.isArray(data?.data) ? data.data : Array.isArray(data?.logs) ? data.logs : Array.isArray(data) ? data : [];
        setLogs(list);
      })
      .catch((err) => { console.error(err); setLogs([]); })
      .finally(() => setLoading(false));
  }, []);

  const safeLogs = Array.isArray(logs) ? logs : [];
  const filtered = search
    ? safeLogs.filter(l => `${l.action} ${l.actorName} ${l.actorRole} ${l.targetType} ${l.ipAddress}`.toLowerCase().includes(search.toLowerCase()))
    : safeLogs;

  const formatDate = (d) => d ? new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—';

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <FileText size={22} color="#1F1F1F" />
          <h2 style={{ color: '#1F1F1F', fontSize: '22px', fontWeight: 800, margin: 0 }}>Audit Logs</h2>
        </div>
        <p style={{ color: '#6B6B6B', fontSize: '14px', margin: 0 }}>{filtered.length} log entr{filtered.length !== 1 ? 'ies' : 'y'}</p>
      </div>

      {/* Search */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #E5E5E5', borderRadius: '6px', padding: '8px 12px', background: '#FAFAFA' }}>
          <Search size={16} color="#6B6B6B" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by action, user, IP address…"
            style={{ background: 'transparent', border: 'none', outline: 'none', color: '#1F1F1F', fontSize: '14px', flex: 1 }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: '8px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#6B6B6B', fontSize: '14px' }}>Loading audit logs…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <FileText size={32} color="#D1D5DB" style={{ marginBottom: '10px' }} />
            <p style={{ color: '#6B6B6B', fontSize: '14px', margin: 0 }}>No logs yet</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E5E5' }}>
                  {['Timestamp', 'Action', 'Actor', 'Role', 'Target', 'IP Address'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#6B6B6B', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((log, i) => {
                  const actionCfg = ACTION_COLORS[log.action] || { bg: '#F3F4F6', color: '#6B7280' };
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid #F3F4F6', transition: 'background 0.1s' }} onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'} onMouseLeave={e => e.currentTarget.style.background = ''}>
                      <td style={{ padding: '14px 16px', color: '#6B6B6B', fontSize: '12px', whiteSpace: 'nowrap' }}>{formatDate(log.createdAt)}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ display: 'inline-block', background: actionCfg.bg, color: actionCfg.color, padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap', fontFamily: 'monospace' }}>
                          {log.action}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#1F1F1F', fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap' }}>{log.actorName || '—'}</td>
                      <td style={{ padding: '14px 16px', color: '#6B6B6B', fontSize: '13px' }}>{log.actorRole || '—'}</td>
                      <td style={{ padding: '14px 16px', color: '#6B6B6B', fontSize: '13px' }}>
                        <span style={{ display: 'block', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {log.targetType || '—'} {log.targetId ? `(${String(log.targetId).slice(-6)})` : ''}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#6B6B6B', fontSize: '12px', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                        {log.ipAddress || '—'}
                      </td>
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
