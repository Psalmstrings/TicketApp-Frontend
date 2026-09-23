import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Ticket, ChevronRight, Clock, MapPin, Calendar, ArrowLeft } from 'lucide-react';
import api from '../../lib/axios.js';
import AppLayout from '../../components/layout/AppLayout.jsx';

const FILTERS = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past', label: 'Past' },
  { key: 'transferred', label: 'Transferred' },
];

const STATUS_COLORS = {
  SOLD: { bg: 'rgba(16,185,129,0.12)', color: '#10b981', label: 'Active' },
  AVAILABLE: { bg: 'rgba(99,102,241,0.12)', color: '#6366f1', label: 'Available' },
  USED: { bg: 'rgba(107,114,128,0.12)', color: '#6b7280', label: 'Used' },
  TRANSFERRED: { bg: 'rgba(139,92,246,0.12)', color: '#8b5cf6', label: 'Transferred' },
  LISTED: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', label: 'Listed' },
  CANCELLED: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444', label: 'Cancelled' },
  TRANSFER_PENDING: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', label: 'Transfer Pending' },
};

function TicketCard({ ticket }) {
  const event = ticket.eventId || {};
  const tt = ticket.ticketTypeId || {};
  const status = STATUS_COLORS[ticket.status] || { bg: 'rgba(107,114,128,0.12)', color: '#6b7280', label: ticket.status };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

  return (
    <Link to={`/tickets/${ticket._id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: '#1a1a2e',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.06)',
        marginBottom: '12px',
        display: 'flex',
        height: '90px',
      }}>
        {/* Left accent stripe */}
        <div style={{
          width: '5px',
          background: 'linear-gradient(to bottom, #6366f1, #8b5cf6)',
          flexShrink: 0,
        }} />
        {/* Cover image */}
        <div style={{
          width: '80px',
          flexShrink: 0,
          background: event.coverImage?.url
            ? `url(${event.coverImage.url}) center/cover`
            : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
        }} />
        {/* Info */}
        <div style={{ padding: '10px 12px', flex: 1, overflow: 'hidden' }}>
          <p style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '13px', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {event.title || 'Event'}
          </p>
          <p style={{ color: '#64748b', fontSize: '11px', margin: '0 0 6px' }}>
            {tt.name || 'General'} • #{ticket.ticketNumber?.slice(-6)}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={10} color="#475569" />
            <p style={{ color: '#475569', fontSize: '10px', margin: 0 }}>
              {formatDate(event.startDate)}
            </p>
          </div>
        </div>
        {/* Status + arrow */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', padding: '10px 12px', gap: '6px' }}>
          <span style={{
            background: status.bg,
            color: status.color,
            borderRadius: '8px',
            padding: '3px 8px',
            fontSize: '10px',
            fontWeight: 600,
          }}>
            {status.label}
          </span>
          <ChevronRight size={14} color="#4b5563" />
        </div>
      </div>
    </Link>
  );
}

export default function MyTicketsPage() {
  const [filter, setFilter] = useState('upcoming');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, [filter]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/tickets/my-tickets?filter=${filter}`);
      const list = Array.isArray(data?.data) ? data.data : Array.isArray(data?.tickets) ? data.tickets : Array.isArray(data) ? data : [];
      setTickets(list);
    } catch (err) {
      console.error(err);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div style={{ paddingBottom: '80px', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1e1b4b, #2d1b69)',
          padding: '48px 16px 0',
        }}>
          <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 800, margin: '0 0 20px' }}>
            My Tickets
          </h1>
          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                style={{
                  flex: 1,
                  padding: '12px 8px',
                  background: 'none',
                  border: 'none',
                  borderBottom: filter === f.key ? '2px solid #6366f1' : '2px solid transparent',
                  color: filter === f.key ? '#6366f1' : 'rgba(255,255,255,0.5)',
                  fontWeight: filter === f.key ? 600 : 400,
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '16px' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ height: '90px', background: '#1a1a2e', borderRadius: '16px', animation: 'pulse 1.5s infinite' }} />
              ))}
            </div>
          ) : !Array.isArray(tickets) || tickets.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Ticket size={40} color="#374151" style={{ marginBottom: '12px' }} />
              <p style={{ color: '#64748b', fontSize: '16px', fontWeight: 600, margin: '0 0 6px' }}>
                No {filter} tickets
              </p>
              <p style={{ color: '#374151', fontSize: '13px', margin: '0 0 20px' }}>
                {filter === 'upcoming' ? 'Browse events to get your first ticket!' : 'Nothing here yet.'}
              </p>
              {filter === 'upcoming' && (
                <Link to="/explore" style={{
                  display: 'inline-block',
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '14px',
                  textDecoration: 'none',
                }}>
                  Browse Events
                </Link>
              )}
            </div>
          ) : (
            (Array.isArray(tickets) ? tickets : []).map(ticket => <TicketCard key={ticket._id} ticket={ticket} />)
          )}
        </div>
      </div>
    </AppLayout>
  );
}
