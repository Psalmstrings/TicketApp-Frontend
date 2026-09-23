import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../lib/axios.js';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { ArrowLeft, Calendar, MapPin, Users, Ticket, ShoppingCart } from 'lucide-react';

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    api.get(`/events/${id}`)
      .then(r => {
        const ev = r.data?.data ?? r.data?.event ?? r.data;
        setEvent(ev);
        if (ev?.ticketTypes?.length) setSelectedType(ev.ticketTypes[0]);
      })
      .catch(() => toast.error('Event not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBuy = async () => {
    if (!user) { navigate('/login'); return; }
    if (!selectedType) return;
    setBuying(true);
    try {
      await api.post('/orders', { eventId: id, ticketTypeId: selectedType._id ?? selectedType.id, quantity: 1 });
      toast.success('Ticket purchased! Check My Tickets.');
      navigate('/tickets');
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Purchase failed.');
    } finally {
      setBuying(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (!event) return (
    <div style={{ padding: '80px 24px', textAlign: 'center' }}>
      <p style={{ color: '#64748b' }}>Event not found.</p>
    </div>
  );

  const dateStr = event.startDate
    ? new Date(event.startDate).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })
    : 'TBA';

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a' }}>
      {/* Banner */}
      <div style={{
        height: 240, background: 'linear-gradient(135deg, #1e1b4b, #4c1d95)',
        position: 'relative', overflow: 'hidden',
      }}>
        {event.bannerImage && (
          <img src={event.bannerImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(15,15,26,0.9))' }} />
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            position: 'absolute', top: 48, left: 20,
            background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '8px 14px',
            display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: '#fff', fontSize: 14,
          }}
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ position: 'absolute', bottom: 16, left: 20, right: 20 }}>
          <StatusBadge status={event.status} />
        </div>
      </div>

      <div style={{ padding: '20px 20px 100px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>{event.title}</h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          <p style={{ color: '#94a3b8', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Calendar size={16} color="#6366f1" /> {dateStr}
          </p>
          {event.venue && (
            <p style={{ color: '#94a3b8', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <MapPin size={16} color="#6366f1" /> {event.venue}
            </p>
          )}
          {event.capacity && (
            <p style={{ color: '#94a3b8', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Users size={16} color="#6366f1" /> Capacity: {event.capacity}
            </p>
          )}
        </div>

        {event.description && (
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>About</h2>
            <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.7 }}>{event.description}</p>
          </div>
        )}

        {/* Ticket Types */}
        {event.ticketTypes?.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Ticket Types</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {event.ticketTypes.map(tt => {
                const ttId = tt._id ?? tt.id;
                const selId = selectedType?._id ?? selectedType?.id;
                const isSelected = ttId === selId;
                return (
                  <div
                    key={ttId}
                    onClick={() => setSelectedType(tt)}
                    style={{
                      background: isSelected ? 'rgba(99,102,241,0.12)' : '#1a1a2e',
                      border: `1px solid ${isSelected ? '#6366f1' : 'rgba(255,255,255,0.06)'}`,
                      borderRadius: 14, padding: '14px 16px', cursor: 'pointer',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9' }}>{tt.name}</p>
                      {tt.description && <p style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{tt.description}</p>}
                      <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                        {tt.quantity - (tt.sold ?? 0)} remaining
                      </p>
                    </div>
                    <p style={{ fontSize: 18, fontWeight: 800, color: '#818cf8' }}>
                      ${tt.price}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Buy Bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430,
        background: 'rgba(15,15,26,0.96)', backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '16px 20px 24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 12, color: '#64748b' }}>Selected</p>
            <p style={{ fontSize: 16, fontWeight: 700 }}>
              {selectedType ? `${selectedType.name} — $${selectedType.price}` : 'No ticket selected'}
            </p>
          </div>
          <button
            className="btn-primary"
            style={{ width: 'auto', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 8 }}
            disabled={!selectedType || buying}
            onClick={handleBuy}
          >
            {buying ? (
              <span style={{
                width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'block',
              }} />
            ) : (
              <><ShoppingCart size={16} /> Buy</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
