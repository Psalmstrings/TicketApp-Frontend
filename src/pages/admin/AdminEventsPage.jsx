import React, { useState, useEffect } from 'react';
import { Check, X, Calendar, MapPin, Clock, User } from 'lucide-react';
import api from '../../lib/axios.js';

const STATUS_BADGE = {
  PUBLISHED: { bg: 'rgba(16,185,129,0.15)', color: '#10b981', label: 'Published' },
  DRAFT: { bg: 'rgba(107,114,128,0.15)', color: '#6b7280', label: 'Draft' },
  PENDING_APPROVAL: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', label: 'Pending' },
  REJECTED: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444', label: 'Rejected' },
  SUSPENDED: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444', label: 'Suspended' },
  ENDED: { bg: 'rgba(107,114,128,0.15)', color: '#6b7280', label: 'Ended' },
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

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
      setActionMsg(`Event ${action}d.`);
      fetchEvents();
    } catch (err) { setActionMsg(err.response?.data?.message || 'Action failed'); }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

  return (
    <div style={{ padding: '16px' }}>
      {actionMsg && (
        <div style={{ background: 'rgba(99,102,241,0.1)', borderRadius: '12px', padding: '12px', marginBottom: '14px', color: '#818cf8', fontSize: '13px', display: 'flex', justifyContent: 'space-between' }}>
          {actionMsg}
          <button onClick={() => setActionMsg('')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={14} color="#818cf8" /></button>
        </div>
      )}
      <p style={{ color: '#475569', fontSize: '12px', margin: '0 0 14px' }}>{(Array.isArray(events) ? events : []).length} events total</p>
      {loading ? [1,2,3].map(i => <div key={i} style={{ height: '100px', background: '#1a1a2e', borderRadius: '14px', marginBottom: '10px' }} />)
       : (Array.isArray(events) ? events : []).map(event => {
        const badge = STATUS_BADGE[event.status] || { bg: 'rgba(107,114,128,0.15)', color: '#6b7280', label: event.status };
        return (
          <div key={event._id} style={{ background: '#1a1a2e', borderRadius: '16px', padding: '14px', marginBottom: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: event.status === 'PENDING_APPROVAL' ? '12px' : '0' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '12px', flexShrink: 0, background: event.coverImage?.url ? `url(${event.coverImage.url}) center/cover` : 'linear-gradient(135deg, #4f46e5, #7c3aed)' }} />
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <p style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '14px', margin: 0, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: '8px' }}>{event.title}</p>
                  <span style={{ background: badge.bg, color: badge.color, padding: '2px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 600, flexShrink: 0 }}>{badge.label}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '3px' }}>
                  <User size={10} color="#6366f1" />
                  <p style={{ color: '#64748b', fontSize: '11px', margin: 0 }}>{event.organizerId?.firstName} {event.organizerId?.lastName}</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <MapPin size={10} color="#475569" />
                    <p style={{ color: '#475569', fontSize: '11px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100px' }}>{event.venue}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Clock size={10} color="#374151" />
                    <p style={{ color: '#374151', fontSize: '11px', margin: 0 }}>{formatDate(event.startDate)}</p>
                  </div>
                </div>
              </div>
            </div>
            {event.status === 'PENDING_APPROVAL' && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleAction(event._id, 'approve')} style={{ flex: 1, padding: '9px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '10px', color: '#10b981', fontWeight: 600, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <Check size={14} /> Approve
                </button>
                <button onClick={() => handleAction(event._id, 'reject')} style={{ flex: 1, padding: '9px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', color: '#ef4444', fontWeight: 600, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <X size={14} /> Reject
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
