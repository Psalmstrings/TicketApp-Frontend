import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout.jsx';
import api from '../../lib/axios.js';
import { Search, Calendar, MapPin, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['All', 'Music', 'Sports', 'Arts', 'Tech', 'Food', 'Comedy', 'Other'];

export default function ExplorePage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: 20, status: 'PUBLISHED' });
    if (search) params.append('search', search);
    if (category !== 'All') params.append('category', category);
    api.get(`/events?${params}`)
      .then(r => {
        const list = Array.isArray(r.data?.data)
          ? r.data.data
          : Array.isArray(r.data?.events)
          ? r.data.events
          : Array.isArray(r.data)
          ? r.data
          : [];
        setEvents(list);
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [search, category]);

  return (
    <AppLayout>
      {/* Header */}
      <div style={{ padding: '52px 20px 16px', background: '#1a1a2e', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 14 }}>Explore Events</h1>
        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            className="input"
            placeholder="Search events…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 40, background: '#252545' }}
          />
        </div>
        {/* Category chips */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                flexShrink: 0, borderRadius: 20, padding: '7px 14px', fontSize: 13, fontWeight: 500,
                cursor: 'pointer', border: '1px solid',
                background: category === cat ? '#6366f1' : 'transparent',
                borderColor: category === cat ? '#6366f1' : 'rgba(255,255,255,0.1)',
                color: category === cat ? '#fff' : '#94a3b8',
                transition: 'all 0.15s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div style={{ padding: '16px 20px' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 180, borderRadius: 16 }} />
            ))}
          </div>
        ) : !Array.isArray(events) || events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 16px', color: '#64748b' }}>
            <Search size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
            <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>No events found</p>
            <p style={{ fontSize: 13 }}>Try a different search or category</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {(Array.isArray(events) ? events : []).map(ev => (
              <ExploreCard key={ev._id ?? ev.id} event={ev} onClick={() => navigate(`/events/${ev._id ?? ev.id}`)} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function ExploreCard({ event, onClick }) {
  const dateStr = event.startDate
    ? new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : 'TBA';

  return (
    <div
      onClick={onClick}
      style={{
        background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 16, overflow: 'hidden', cursor: 'pointer',
        transition: 'transform 0.15s, border-color 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
    >
      {/* Image */}
      <div style={{ height: 100, background: 'linear-gradient(135deg, #312e81, #4c1d95)', position: 'relative', overflow: 'hidden' }}>
        {event.bannerImage && (
          <img src={event.bannerImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
        <div style={{
          position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.5)',
          borderRadius: 8, padding: '3px 8px', fontSize: 11, fontWeight: 600, color: '#fff',
        }}>
          {dateStr}
        </div>
      </div>
      {/* Body */}
      <div style={{ padding: '10px' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {event.title}
        </p>
        {event.venue && (
          <p style={{ fontSize: 11, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            📍 {event.venue}
          </p>
        )}
        {event.ticketTypes?.[0] && (
          <p style={{ fontSize: 12, fontWeight: 600, color: '#818cf8', marginTop: 6 }}>
            From ${event.ticketTypes[0].price}
          </p>
        )}
      </div>
    </div>
  );
}
