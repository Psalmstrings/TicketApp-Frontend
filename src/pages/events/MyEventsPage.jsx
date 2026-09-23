import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, Plus, ChevronRight, Users, Ticket } from 'lucide-react';
import api from '../../lib/axios.js';
import AppLayout from '../../components/layout/AppLayout.jsx';

const STATUS_BADGE = {
  PUBLISHED: { bg: 'rgba(16,185,129,0.15)', color: '#10b981', label: 'Published' },
  DRAFT: { bg: 'rgba(107,114,128,0.15)', color: '#6b7280', label: 'Draft' },
  PENDING_APPROVAL: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', label: 'Pending' },
  REJECTED: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444', label: 'Rejected' },
  SUSPENDED: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444', label: 'Suspended' },
  ENDED: { bg: 'rgba(107,114,128,0.15)', color: '#6b7280', label: 'Ended' },
};

export default function MyEventsPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/events/organizer/my-events')
      .then(({ data }) => {
        const list = Array.isArray(data?.data) ? data.data : Array.isArray(data?.events) ? data.events : Array.isArray(data) ? data : [];
        setEvents(list);
      })
      .catch((err) => { console.error(err); setEvents([]); })
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

  return (
    <AppLayout>
      <div style={{ paddingBottom: '100px', minHeight: '100vh' }}>
        <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #2d1b69)', padding: '48px 16px 24px' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginBottom: '12px' }}>
            <ArrowLeft size={18} color="#fff" />
          </button>
          <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 800, margin: 0 }}>My Events</h1>
        </div>

        <div style={{ padding: '16px' }}>
          {loading ? (
            [1,2,3].map(i => (
              <div key={i} style={{ height: '100px', background: '#1a1a2e', borderRadius: '16px', marginBottom: '12px' }} />
            ))
          ) : !Array.isArray(events) || events.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Calendar size={40} color="#374151" style={{ marginBottom: '12px' }} />
              <p style={{ color: '#64748b', fontSize: '16px', fontWeight: 600, margin: '0 0 6px' }}>No events yet</p>
              <p style={{ color: '#374151', fontSize: '13px', margin: '0 0 20px' }}>Create your first event to get started!</p>
              <Link to="/create" style={{ display: 'inline-block', padding: '12px 24px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '12px', color: '#fff', fontWeight: 600, fontSize: '14px', textDecoration: 'none' }}>
                Create Event
              </Link>
            </div>
          ) : (
            (Array.isArray(events) ? events : []).map(event => {
              const badge = STATUS_BADGE[event.status] || { bg: 'rgba(107,114,128,0.15)', color: '#6b7280', label: event.status };
              return (
                <Link key={event._id} to={`/events/${event._id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#1a1a2e', borderRadius: '16px', padding: '16px', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '14px' }}>
                    <div style={{ width: '70px', height: '70px', borderRadius: '12px', flexShrink: 0, background: event.coverImage?.url ? `url(${event.coverImage.url}) center/cover` : 'linear-gradient(135deg, #4f46e5, #7c3aed)' }} />
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <p style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '14px', margin: 0, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: '8px' }}>
                          {event.title}
                        </p>
                        <span style={{ background: badge.bg, color: badge.color, borderRadius: '8px', padding: '3px 8px', fontSize: '10px', fontWeight: 600, flexShrink: 0 }}>
                          {badge.label}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                        <MapPin size={11} color="#6366f1" />
                        <p style={{ color: '#64748b', fontSize: '12px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.venue}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={11} color="#475569" />
                        <p style={{ color: '#475569', fontSize: '11px', margin: 0 }}>{formatDate(event.startDate)}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>

        <Link to="/create" style={{
          position: 'fixed',
          bottom: '90px',
          right: '20px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
          textDecoration: 'none',
        }}>
          <Plus size={24} color="#fff" />
        </Link>
      </div>
    </AppLayout>
  );
}
