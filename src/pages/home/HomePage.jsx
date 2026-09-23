import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import api from '../../lib/axios.js';
import {
  Bell, Wallet, Plus, ChevronRight, Ticket, Zap,
  Calendar, TrendingUp, Star, ArrowRight, Settings,
} from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/events?limit=6&sort=createdAt')
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
  }, []);

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  const isApproved = user?.status === 'APPROVED' || isAdmin;
  const displayName = user?.firstName || user?.name?.split(' ')[0] || 'there';

  return (
    <AppLayout>
      {/* ===== Gradient Header ===== */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #4c1d95 100%)',
        padding: '52px 20px 28px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background orbs */}
        <div style={{
          position: 'absolute', top: -50, right: -50, width: 200, height: 200,
          borderRadius: '50%', background: 'rgba(99,102,241,0.15)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -60, left: -20, width: 160, height: 160,
          borderRadius: '50%', background: 'rgba(139,92,246,0.1)', pointerEvents: 'none',
        }} />

        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <p style={{ color: '#a5b4fc', fontSize: 13, marginBottom: 2 }}>
              {getGreeting()}, 👋
            </p>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>
              {displayName}
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => navigate('/notifications')}
              style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#fff', flexShrink: 0,
              }}
            >
              <Bell size={18} />
            </button>
            {isAdmin && (
              <button
                onClick={() => navigate('/admin/users')}
                style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'rgba(99,102,241,0.3)', border: '1px solid rgba(99,102,241,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#fff', flexShrink: 0,
                }}
              >
                <Settings size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Balance Card */}
        <div style={{
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 20,
          padding: '20px',
          backdropFilter: 'blur(8px)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: '#a5b4fc', fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                Wallet Balance
              </p>
              <p style={{ fontSize: 32, fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                ${(user?.balance ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
            }}>
              <Wallet size={22} color="#fff" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14 }}>
            <StatusBadge status={user?.status ?? 'PENDING'} />
            {user?.role && (
              <span style={{
                background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)',
                borderRadius: 20, padding: '3px 8px', fontSize: 11, fontWeight: 600, color: '#a5b4fc',
                textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>
                {user.role}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ===== Body ===== */}
      <div style={{ padding: '24px 20px' }}>

        {/* Quick Actions */}
        <QuickActions isApproved={isApproved} navigate={navigate} />

        {/* Additional Apps */}
        <section style={{ marginBottom: 28 }}>
          <SectionHeader title="Additional Apps" onSeeAll={() => navigate('/explore')} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <AppCard
              icon={<Ticket size={22} color="#818cf8" />}
              title="My Tickets"
              desc="View & manage tickets"
              onClick={() => navigate('/tickets')}
              color="rgba(99,102,241,0.12)"
            />
            <AppCard
              icon={<ArrowRight size={22} color="#10b981" />}
              title="Transfers"
              desc="Send tickets to friends"
              onClick={() => navigate('/transfers')}
              color="rgba(16,185,129,0.12)"
            />
            <AppCard
              icon={<TrendingUp size={22} color="#f59e0b" />}
              title="Resale"
              desc="Sell or buy tickets"
              onClick={() => navigate('/resale')}
              color="rgba(245,158,11,0.12)"
            />
            <AppCard
              icon={<Star size={22} color="#8b5cf6" />}
              title="Explore"
              desc="Discover events"
              onClick={() => navigate('/explore')}
              color="rgba(139,92,246,0.12)"
            />
          </div>
        </section>

        {/* Create Ticket */}
        <section style={{ marginBottom: 28 }}>
          <SectionHeader title="Create Ticket" />
          <div
            onClick={() => navigate('/create')}
            style={{
              background: 'linear-gradient(135deg, #312e81 0%, #4c1d95 100%)',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: 20, padding: '20px',
              cursor: 'pointer', position: 'relative', overflow: 'hidden',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onTouchStart={e => e.currentTarget.style.transform = 'scale(0.98)'}
            onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{
              position: 'absolute', top: -20, right: -20, width: 120, height: 120,
              borderRadius: '50%', background: 'rgba(99,102,241,0.2)', pointerEvents: 'none',
            }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 12,
                }}>
                  <Plus size={22} color="#fff" />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
                  Create Ticket Manually
                </h3>
                <p style={{ color: '#a5b4fc', fontSize: 13 }}>
                  Set up your event in 4 steps
                </p>
              </div>
              <ChevronRight size={22} color="rgba(255,255,255,0.4)" />
            </div>
            {!isApproved && (
              <div style={{
                marginTop: 14, background: 'rgba(245,158,11,0.15)',
                border: '1px solid rgba(245,158,11,0.3)', borderRadius: 10,
                padding: '8px 12px', fontSize: 12, color: '#fde68a',
              }}>
                ⚠️ Your account requires approval to create events.
              </div>
            )}
          </div>
        </section>

        {/* Upcoming Events */}
        <section>
          <SectionHeader title="Upcoming Events" onSeeAll={() => navigate('/explore')} />
          {loading ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#64748b', fontSize: 14 }}>
              Loading events…
            </div>
          ) : !Array.isArray(events) || events.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '32px 16px', color: '#64748b',
              background: '#1a1a2e', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <Calendar size={32} style={{ marginBottom: 12, opacity: 0.5 }} />
              <p style={{ fontSize: 14 }}>No events yet. Be the first to create one!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(Array.isArray(events) ? events : []).slice(0, 4).map(ev => (
                <EventCard key={ev._id ?? ev.id} event={ev} navigate={navigate} />
              ))}
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}

/* ── Helpers ── */

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function SectionHeader({ title, onSeeAll }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9' }}>{title}</h2>
      {onSeeAll && (
        <button
          onClick={onSeeAll}
          style={{
            background: 'none', border: 'none', color: '#818cf8', fontSize: 13,
            fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
          }}
        >
          See all <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
}

function AppCard({ icon, title, desc, onClick, color }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 16, padding: '16px', cursor: 'pointer',
        transition: 'border-color 0.15s, transform 0.15s',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 11,
        background: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9' }}>{title}</p>
        <p style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{desc}</p>
      </div>
    </div>
  );
}

function QuickActions({ isApproved, navigate }) {
  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 28, overflowX: 'auto', paddingBottom: 4 }}>
      {[
        { label: 'My Events', icon: <Calendar size={16} />, to: '/my-events', color: '#6366f1' },
        { label: 'Scanner', icon: <Zap size={16} />, to: '/scan', color: '#8b5cf6' },
        { label: 'Resale', icon: <TrendingUp size={16} />, to: '/resale', color: '#f59e0b' },
      ].map(({ label, icon, to, color }) => (
        <button
          key={to}
          onClick={() => navigate(to)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: `${color}18`, border: `1px solid ${color}33`,
            borderRadius: 20, padding: '8px 14px', whiteSpace: 'nowrap',
            cursor: 'pointer', color, fontSize: 13, fontWeight: 500,
            flexShrink: 0,
          }}
        >
          {icon} {label}
        </button>
      ))}
    </div>
  );
}

function EventCard({ event, navigate }) {
  const dateStr = event.startDate
    ? new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'TBA';

  return (
    <div
      onClick={() => navigate(`/events/${event._id ?? event.id}`)}
      style={{
        background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 16, padding: '14px', cursor: 'pointer',
        display: 'flex', gap: 14, alignItems: 'center',
        transition: 'border-color 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
    >
      {/* Thumbnail */}
      <div style={{
        width: 60, height: 60, borderRadius: 12, flexShrink: 0,
        background: 'linear-gradient(135deg, #312e81, #4c1d95)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {event.bannerImage ? (
          <img src={event.bannerImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <Calendar size={24} color="rgba(165,180,252,0.6)" />
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9', marginBottom: 4 }} className="truncate">
          {event.title}
        </p>
        <p style={{ fontSize: 12, color: '#64748b' }}>{dateStr}</p>
        {event.venue && (
          <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }} className="truncate">
            📍 {event.venue}
          </p>
        )}
      </div>

      <ChevronRight size={18} color="#4b5563" style={{ flexShrink: 0 }} />
    </div>
  );
}
