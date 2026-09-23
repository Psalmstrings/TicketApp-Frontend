import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Ticket, MapPin, Clock, Check, X, DollarSign } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../lib/axios.js';
import AppLayout from '../../components/layout/AppLayout.jsx';

export default function ResalePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState(null);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { fetchListings(); }, []);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/resale');
      const list = Array.isArray(data?.data) ? data.data : Array.isArray(data?.listings) ? data.listings : Array.isArray(data) ? data : [];
      setListings(list);
    } catch (err) { console.error(err); setListings([]); }
    finally { setLoading(false); }
  };

  const handleBuy = async (listingId) => {
    if (!user) { navigate('/login'); return; }
    setBuyingId(listingId);
    setError('');
    try {
      await api.post(`/resale/${listingId}/buy`);
      setMsg('Ticket purchased! Check your wallet.');
      fetchListings();
    } catch (err) {
      setError(err.response?.data?.message || 'Purchase failed');
    } finally {
      setBuyingId(null);
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';

  return (
    <AppLayout>
      <div style={{ paddingBottom: '80px', minHeight: '100vh' }}>
        <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #2d1b69)', padding: '48px 16px 24px' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginBottom: '12px' }}>
            <ArrowLeft size={18} color="#fff" />
          </button>
          <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 800, margin: 0 }}>Resale Market</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', margin: '6px 0 0' }}>Tickets listed by other users</p>
        </div>

        <div style={{ padding: '16px' }}>
          {msg && <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', padding: '12px', marginBottom: '14px', color: '#10b981', fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'center' }}><Check size={16} />{msg}</div>}
          {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', padding: '12px', marginBottom: '14px', color: '#f87171', fontSize: '13px' }}>{error}</div>}

          {loading ? (
            [1,2,3].map(i => <div key={i} style={{ height: '120px', background: '#1a1a2e', borderRadius: '16px', marginBottom: '12px' }} />)
          ) : !Array.isArray(listings) || listings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <ShoppingBag size={40} color="#374151" style={{ marginBottom: '12px' }} />
              <p style={{ color: '#64748b', fontSize: '16px', fontWeight: 600, margin: '0 0 6px' }}>No listings available</p>
              <p style={{ color: '#374151', fontSize: '13px', margin: 0 }}>Check back later for resale tickets</p>
            </div>
          ) : (
            (Array.isArray(listings) ? listings : []).map(listing => {
              const ticket = listing.ticketId || {};
              const event = listing.eventId || {};
              const tt = ticket.ticketTypeId || {};
              const isMine = user && listing.sellerId?._id === user.id;
              return (
                <div key={listing._id} style={{ background: '#1a1a2e', borderRadius: '16px', padding: '16px', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '15px', margin: '0 0 4px' }}>{event.title || 'Event Ticket'}</p>
                      <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 6px' }}>
                        {tt.name || 'General'} {ticket.section && ticket.section !== 'General' ? `· ${ticket.section}` : ''}
                      </p>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <MapPin size={11} color="#6366f1" />
                          <span style={{ color: '#64748b', fontSize: '11px' }}>{event.venue || '—'}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Clock size={11} color="#475569" />
                          <span style={{ color: '#475569', fontSize: '11px' }}>{formatDate(event.startDate)}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ color: '#f59e0b', fontWeight: 800, fontSize: '18px', margin: '0 0 2px' }}>
                        ₦{listing.price?.toLocaleString()}
                      </p>
                      {listing.originalPrice > 0 && (
                        <p style={{ color: '#475569', fontSize: '11px', margin: 0, textDecoration: 'line-through' }}>
                          ₦{listing.originalPrice?.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                  {!isMine ? (
                    <button
                      onClick={() => handleBuy(listing._id)}
                      disabled={!!buyingId}
                      style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: 600, fontSize: '14px', cursor: buyingId ? 'wait' : 'pointer', opacity: buyingId === listing._id ? 0.7 : 1 }}>
                      {buyingId === listing._id ? 'Buying...' : 'Buy Ticket'}
                    </button>
                  ) : (
                    <div style={{ padding: '10px', background: 'rgba(107,114,128,0.1)', borderRadius: '10px', textAlign: 'center', color: '#6b7280', fontSize: '13px' }}>
                      Your listing
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </AppLayout>
  );
}
