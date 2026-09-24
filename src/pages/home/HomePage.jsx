import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout.jsx';
import EventCard from '../../components/events/EventCard.jsx';
import EventCardSkeleton from '../../components/events/EventCardSkeleton.jsx';
import TicketmasterSpinner from '../../components/ui/TicketmasterSpinner.jsx';
import api from '../../lib/axios.js';
import {
  ChevronRight,
  MapPin,
  Calendar,
  Sparkles,
  Flame,
  ArrowRight,
  Music,
  Trophy,
  Drama,
  Users,
} from 'lucide-react';

const CATEGORIES = [
  { id: 'All', label: 'All Events', icon: Flame },
  { id: 'Concerts', label: 'Concerts', icon: Music },
  { id: 'Sports', label: 'Sports', icon: Trophy },
  { id: 'Arts & Theater', label: 'Arts & Theater', icon: Drama },
  { id: 'Family', label: 'Family', icon: Users },
];

const POPULAR_CITIES = [
  { name: 'New York', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&auto=format&fit=crop&q=80', eventsCount: '24+ Events' },
  { name: 'Los Angeles', image: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=600&auto=format&fit=crop&q=80', eventsCount: '18+ Events' },
  { name: 'London', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&auto=format&fit=crop&q=80', eventsCount: '30+ Events' },
  { name: 'Lagos', image: 'https://images.unsplash.com/photo-1618828665011-0abb72338b23?w=600&auto=format&fit=crop&q=80', eventsCount: '15+ Events' },
  { name: 'Chicago', image: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=600&auto=format&fit=crop&q=80', eventsCount: '12+ Events' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/events?limit=24');
      const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      setEvents(list);
    } catch (err) {
      console.error('Failed to load events:', err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Segregate events for rich discovery experience
  const heroEvent = events.find((e) => e.featured) || events[0];
  const concerts = events.filter((e) => e.category?.match(/music|concert/i));
  const sports = events.filter((e) => e.category?.match(/sport/i));
  const arts = events.filter((e) => e.category?.match(/art|theater|broadway/i));
  const family = events.filter((e) => e.category?.match(/family|kids/i));

  const filteredEvents =
    selectedCategory === 'All'
      ? events
      : events.filter((e) => e.category?.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <AppLayout>
      {/* ===== HERO / FEATURED EVENT BILLBOARD ===== */}
      {heroEvent && (
        <div style={{ backgroundColor: '#111827', position: 'relative', overflow: 'hidden' }}>
          <div
            style={{
              position: 'relative',
              minHeight: '440px',
              display: 'flex',
              alignItems: 'center',
              background: `linear-gradient(90deg, rgba(17,24,39,0.92) 0%, rgba(17,24,39,0.7) 45%, rgba(17,24,39,0.2) 100%), url(${
                heroEvent.coverImage?.url || heroEvent.bannerImage || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&auto=format&fit=crop&q=80'
              }) center/cover no-repeat`,
            }}
          >
            <div className="tm-container" style={{ padding: '60px 20px', width: '100%', color: '#FFFFFF' }}>
              <div style={{ maxWidth: '640px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#026CDF', color: '#FFFFFF', padding: '4px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>
                  <Sparkles size={13} /> Featured Spotlight
                </div>

                <h1 style={{ fontSize: 'clamp(28px, 4.5vw, 46px)', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.15, marginBottom: '12px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                  {heroEvent.title}
                </h1>

                <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', marginBottom: '22px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '14px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={16} color="#60A5FA" />
                    {heroEvent.startDate ? new Date(heroEvent.startDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }) : 'Tour Dates Available'}
                  </span>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={16} color="#60A5FA" />
                    {heroEvent.venue} {heroEvent.address ? `, ${heroEvent.address}` : ''}
                  </span>
                </p>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    className="btn-primary"
                    style={{ padding: '14px 28px', fontSize: '15px', borderRadius: '8px' }}
                    onClick={() => navigate(`/events/${heroEvent._id || heroEvent.id}`)}
                  >
                    Find Tickets <ArrowRight size={16} />
                  </button>

                  <button
                    className="btn-secondary"
                    style={{ padding: '14px 22px', fontSize: '15px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(8px)' }}
                    onClick={() => navigate('/explore')}
                  >
                    Browse All Tours
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== CATEGORY PILLS BAR ===== */}
      <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E5E5', position: 'sticky', top: '70px', zIndex: 100 }}>
        <div className="tm-container" style={{ padding: '12px 20px', display: 'flex', gap: '10px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '24px',
                  fontSize: '13px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: isSelected ? '1.5px solid #026CDF' : '1px solid #E5E5E5',
                  backgroundColor: isSelected ? '#EBF3FD' : '#FFFFFF',
                  color: isSelected ? '#026CDF' : '#1F1F1F',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={14} color={isSelected ? '#026CDF' : '#6B6B6B'} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="tm-container" style={{ padding: '36px 20px' }}>
        {/* ===== POPULAR NEAR YOU / TOP EVENTS ===== */}
        <section style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1F1F1F', margin: 0 }}>
                Popular Near You
              </h2>
              <p style={{ fontSize: '13px', color: '#6B6B6B', margin: '4px 0 0 0' }}>
                Top trending live events, bestselling tickets, and upcoming stadium tours.
              </p>
            </div>
            <Link
              to="/explore"
              style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: 700, color: '#026CDF', textDecoration: 'none' }}
            >
              See All <ChevronRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {[1, 2, 3, 4].map((n) => (
                <EventCardSkeleton key={n} />
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E5E5' }}>
              <Flame size={40} color="#D1D5DB" style={{ marginBottom: '12px' }} />
              <p style={{ fontSize: '16px', fontWeight: 600, color: '#4B4B4B', margin: '0 0 6px 0' }}>
                No events found in this category
              </p>
              <p style={{ fontSize: '13px', color: '#8C8C8C', margin: '0 0 16px 0' }}>
                Check back soon or explore other entertainment categories.
              </p>
              <button className="btn-outline" onClick={() => setSelectedCategory('All')}>
                View All Events
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {filteredEvents.slice(0, 8).map((event) => (
                <EventCard key={event._id || event.id} event={event} />
              ))}
            </div>
          )}
        </section>

        {/* ===== CONCERTS CAROUSEL ROW ===== */}
        {concerts.length > 0 && selectedCategory === 'All' && (
          <section style={{ marginBottom: '48px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1F1F1F', margin: 0 }}>
                  Concerts & Tours
                </h2>
                <p style={{ fontSize: '13px', color: '#6B6B6B', margin: '4px 0 0 0' }}>
                  World tours, headline acts, and music festivals.
                </p>
              </div>
              <Link
                to="/explore?category=Concerts"
                style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: 700, color: '#026CDF', textDecoration: 'none' }}
              >
                See All Concerts <ChevronRight size={16} />
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {concerts.slice(0, 4).map((ev) => (
                <EventCard key={ev._id || ev.id} event={ev} />
              ))}
            </div>
          </section>
        )}

        {/* ===== SPORTS SHOWCASE ===== */}
        {sports.length > 0 && selectedCategory === 'All' && (
          <section style={{ marginBottom: '48px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1F1F1F', margin: 0 }}>
                  Sports Matches & Games
                </h2>
                <p style={{ fontSize: '13px', color: '#6B6B6B', margin: '4px 0 0 0' }}>
                  NBA, Premier League, championship bouts, and international soccer.
                </p>
              </div>
              <Link
                to="/explore?category=Sports"
                style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: 700, color: '#026CDF', textDecoration: 'none' }}
              >
                See All Sports <ChevronRight size={16} />
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {sports.slice(0, 4).map((ev) => (
                <EventCard key={ev._id || ev.id} event={ev} />
              ))}
            </div>
          </section>
        )}

        {/* ===== POPULAR CITIES DESTINATION CARDS ===== */}
        <section style={{ marginBottom: '48px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1F1F1F', margin: 0 }}>
              Popular Entertainment Cities
            </h2>
            <p style={{ fontSize: '13px', color: '#6B6B6B', margin: '4px 0 0 0' }}>
              Find live concerts and shows happening in major metropolitan destinations.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '16px',
            }}
          >
            {POPULAR_CITIES.map((city) => (
              <div
                key={city.name}
                onClick={() => navigate(`/explore?city=${encodeURIComponent(city.name)}`)}
                style={{
                  position: 'relative',
                  height: '160px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}
              >
                <img
                  src={city.image}
                  alt={city.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)' }} />
                <div style={{ position: 'absolute', bottom: '14px', left: '16px', color: '#FFFFFF' }}>
                  <h4 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#FFFFFF' }}>{city.name}</h4>
                  <span style={{ fontSize: '12px', color: '#E0E0E0' }}>{city.eventsCount}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== ARTS & THEATER / FAMILY ===== */}
        {(arts.length > 0 || family.length > 0) && selectedCategory === 'All' && (
          <section style={{ marginBottom: '48px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1F1F1F', margin: 0 }}>
                  Arts, Theater & Family
                </h2>
                <p style={{ fontSize: '13px', color: '#6B6B6B', margin: '4px 0 0 0' }}>
                  Broadway musicals, comedy shows, and family productions.
                </p>
              </div>
              <Link
                to="/explore?category=Arts%20%26%20Theater"
                style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: 700, color: '#026CDF', textDecoration: 'none' }}
              >
                Explore More <ChevronRight size={16} />
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {[...arts, ...family].slice(0, 4).map((ev) => (
                <EventCard key={ev._id || ev.id} event={ev} />
              ))}
            </div>
          </section>
        )}
      </div>
    </AppLayout>
  );
}
