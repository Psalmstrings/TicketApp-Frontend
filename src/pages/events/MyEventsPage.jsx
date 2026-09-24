import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout.jsx';
import TicketmasterSpinner from '../../components/ui/TicketmasterSpinner.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../lib/axios.js';
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Users,
  Ticket,
  ChevronLeft,
  ArrowRight,
  TrendingUp,
  DollarSign,
  AlertCircle,
} from 'lucide-react';

export default function MyEventsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const isApproved = user?.status === 'APPROVED' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  useEffect(() => {
    api
      .get('/events/organizer/my-events')
      .then(({ data }) => {
        const list = Array.isArray(data?.data) ? data.data : Array.isArray(data?.events) ? data.events : Array.isArray(data) ? data : [];
        setEvents(list);
      })
      .catch((err) => {
        console.error(err);
        setEvents([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const totalEvents = events.length;
  const publishedCount = events.filter((e) => e.status === 'PUBLISHED').length;

  return (
    <AppLayout>
      {/* Header Bar */}
      <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E5E5', padding: '28px 0 20px' }}>
        <div className="tm-container">
          <Link
            to="/for-you"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#026CDF',
              fontSize: '13px',
              fontWeight: 700,
              textDecoration: 'none',
              marginBottom: '12px',
            }}
          >
            <ChevronLeft size={16} /> Back to For You
          </Link>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1F1F1F', margin: 0 }}>
                Organizer Dashboard
              </h1>
              <p style={{ fontSize: '13px', color: '#6B6B6B', margin: '4px 0 0' }}>
                Manage created events, ticket tiers, attendee manifests, and publication status.
              </p>
            </div>

            <Link
              to="/create"
              className="btn-primary"
              style={{ padding: '10px 20px', fontSize: '14px', borderRadius: '8px' }}
            >
              <Plus size={16} /> Create New Event
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="tm-container" style={{ padding: '32px 20px', maxWidth: '960px' }}>
        {/* Analytics Highlights */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '18px 20px', borderRadius: '12px', border: '1px solid #E5E5E5', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase' }}>Total Created</span>
            <p style={{ margin: '4px 0 0', fontSize: '24px', fontWeight: 800, color: '#1F1F1F' }}>{totalEvents}</p>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '18px 20px', borderRadius: '12px', border: '1px solid #E5E5E5', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase' }}>Published Live</span>
            <p style={{ margin: '4px 0 0', fontSize: '24px', fontWeight: 800, color: '#059669' }}>{publishedCount}</p>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '18px 20px', borderRadius: '12px', border: '1px solid #E5E5E5', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase' }}>Account Status</span>
            <div style={{ marginTop: '6px' }}>
              <StatusBadge status={user?.status || 'PENDING'} />
            </div>
          </div>
        </div>

        {/* Events List Section */}
        {loading ? (
          <div style={{ padding: '60px 0', textAlign: 'center' }}>
            <TicketmasterSpinner size="md" message="Loading your events..." />
          </div>
        ) : events.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E5E5E5',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <Calendar size={40} color="#D1D5DB" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1F1F1F', margin: '0 0 6px 0' }}>
              No organized events yet
            </h3>
            <p style={{ fontSize: '14px', color: '#6B6B6B', margin: '0 0 20px 0', lineHeight: 1.5 }}>
              Launch your first concert tour, sports exhibition, or show in 4 steps with Ticketmaster's wizard.
            </p>
            <Link to="/create" className="btn-primary" style={{ padding: '12px 24px', borderRadius: '8px' }}>
              Create Your First Event
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {events.map((ev) => {
              const dateStr = ev.startDate
                ? new Date(ev.startDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
                : 'Date TBA';

              const imageUrl =
                ev.coverImage?.url ||
                ev.bannerImage ||
                'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&auto=format&fit=crop&q=80';

              return (
                <div
                  key={ev._id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '14px',
                    border: '1px solid #E5E5E5',
                    padding: '18px 20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '18px',
                  }}
                >
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1, minWidth: '280px' }}>
                    <img
                      src={imageUrl}
                      alt=""
                      style={{ width: '70px', height: '70px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <StatusBadge status={ev.status} />
                        <span style={{ fontSize: '11px', color: '#6B6B6B', fontWeight: 600, textTransform: 'uppercase' }}>
                          {ev.category}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1F1F1F', margin: '0 0 3px 0' }}>
                        {ev.title}
                      </h3>

                      <p style={{ fontSize: '12px', color: '#6B6B6B', margin: 0 }}>
                        📍 {ev.venue} • 📅 {dateStr}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Link
                      to={`/events/${ev._id}`}
                      className="btn-outline"
                      style={{ padding: '8px 16px', fontSize: '13px' }}
                    >
                      View Live Page
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
