import React, { useState, useEffect } from 'react';
import { Check, X, Calendar } from 'lucide-react';
import api from '../../lib/axios.js';

const STATUS_BADGE = {
  PUBLISHED:        { bg: '#F0FDF4', color: '#16A34A', label: 'Published' },
  DRAFT:            { bg: '#F3F4F6', color: '#6B7280', label: 'Draft' },
  PENDING_APPROVAL: { bg: '#FFF7ED', color: '#D97706', label: 'Pending' },
  REJECTED:         { bg: '#FEF2F2', color: '#DC2626', label: 'Rejected' },
  SUSPENDED:        { bg: '#FEF2F2', color: '#DC2626', label: 'Suspended' },
  ENDED:            { bg: '#F3F4F6', color: '#6B7280', label: 'Ended' },
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');
  const [actionType, setActionType] = useState('success');

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/events');
      const list = Array.isArray(data?.data) ? data.data : Array.isArray(data?.events) ? data.events : Array.isArray(data) ? data : [];
      setEvents(list);
    } catch (err) { console.error(err); setEvents([]); }
    finally { setLoading(false); }
  };

  const handleAction = async (id, action) => {
    try {
      if (action === 'approve') await api.patch(`/admin/events/${id}/approve`);
      else await api.patch(`/admin/events/${id}/reject`);
      setActionType('success');
      setActionMsg(`Event ${action}d successfully.`);
      setTimeout(() => setActionMsg(''), 3000);
      fetchEvents();
    } catch (err) {
      setActionType('error');
      setActionMsg(err.response?.data?.message || 'Action failed');
      setTimeout(() => setActionMsg(''), 3000);
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  const safeEvents = Array.isArray(events) ? events : [];

  return (
    <div style={{ padding: '24px' }}>
      {/* Page header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <Calendar size={22} color="#1F1F1F" />
          <h2 style={{ color: '#1F1F1F', fontSize: '22px', fontWeight: 800, margin: 0 }}>Events</h2>
        </div>
        <p style={{ color: '#6B6B6B', fontSize: '14px', margin: 0 }}>{safeEvents.length} event{safeEvents.length !== 1 ? 's' : ''} total</p>
      </div>

      {/* Action message */}
      {actionMsg && (
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E5E5', borderLeft: `4px solid ${actionType === 'success' ? '#16A34A' : '#DC2626'}`, borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: actionType === 'success' ? '#15803D' : '#DC2626', fontSize: '13px', fontWeight: 600 }}>
          {actionMsg}
          <button onClick={() => setActionMsg('')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={14} /></button>
        </div>
      )}

      {/* Table */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: '8px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#6B6B6B', fontSize: '14px' }}>Loading events…</div>
        ) : safeEvents.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <Calendar size={32} color="#D1D5DB" style={{ marginBottom: '10px' }} />
            <p style={{ color: '#6B6B6B', fontSize: '14px', margin: 0 }}>No events found</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E5E5' }}>
                  {['Event', 'Category', 'Date', 'Organizer', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#6B6B6B', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {safeEvents.map(event => {
                  const badge = STATUS_BADGE[event.status] || { bg: '#F3F4F6', color: '#6B7280', label: event.status };
                  return (
                    <tr key={event._id} style={{ borderBottom: '1px solid #F3F4F6', transition: 'background 0.1s' }} onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'} onMouseLeave={e => e.currentTarget.style.background = ''}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {event.coverImage?.url && (
                            <img src={event.coverImage.url} alt="" style={{ width: '40px', height: '28px', borderRadius: '4px', objectFit: 'cover', flexShrink: 0 }} />
                          )}
                          <span style={{ color: '#1F1F1F', fontWeight: 600, fontSize: '14px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{event.title}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#6B6B6B', fontSize: '13px', whiteSpace: 'nowrap' }}>{event.category || '—'}</td>
                      <td style={{ padding: '14px 16px', color: '#6B6B6B', fontSize: '13px', whiteSpace: 'nowrap' }}>{formatDate(event.startDate)}</td>
                      <td style={{ padding: '14px 16px', color: '#6B6B6B', fontSize: '13px' }}>
                        <span style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                          {event.organizerId?.firstName} {event.organizerId?.lastName}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ display: 'inline-block', background: badge.bg, color: badge.color, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}>{badge.label}</span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        {event.status === 'PENDING_APPROVAL' && (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button onClick={() => handleAction(event._id, 'approve')} style={{ padding: '5px 12px', background: '#026CDF', border: 'none', borderRadius: '5px', color: '#FFFFFF', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Check size={12} /> Approve
                            </button>
                            <button onClick={() => handleAction(event._id, 'reject')} style={{ padding: '5px 12px', background: '#FFFFFF', border: '1px solid #DC2626', borderRadius: '5px', color: '#DC2626', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <X size={12} /> Reject
                            </button>
                          </div>
                        )}
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
