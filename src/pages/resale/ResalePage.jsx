import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout.jsx';
import TicketmasterSpinner from '../../components/ui/TicketmasterSpinner.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import api from '../../lib/axios.js';
import {
  DollarSign,
  ShieldCheck,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  ShoppingBag,
  ChevronLeft,
  Tag,
} from 'lucide-react';

export default function ResalePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState(null);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/resale');
      const list = Array.isArray(data?.data) ? data.data : Array.isArray(data?.listings) ? data.listings : Array.isArray(data) ? data : [];
      setListings(list);
    } catch (err) {
      console.error(err);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (listingId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setBuyingId(listingId);
    try {
      await api.post(`/resale/${listingId}/buy`);
      toast.success('Ticket purchased via Verified Resale! Check My Tickets.');
      fetchListings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Purchase failed.');
    } finally {
      setBuyingId(null);
    }
  };

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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ backgroundColor: '#FFF7ED', color: '#EA580C', border: '1px solid #FED7AA', fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                  Verified Exchange
                </span>
                <span style={{ fontSize: '12px', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={14} /> 100% Guaranteed Entry
                </span>
              </div>

              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1F1F1F', margin: 0 }}>
                Ticketmaster Resale Marketplace
              </h1>
              <p style={{ fontSize: '13px', color: '#6B6B6B', margin: '4px 0 0' }}>
                Verified tickets listed directly by fans and event attendees.
              </p>
            </div>

            <Link to="/tickets" className="btn-secondary" style={{ padding: '10px 18px', fontSize: '13px' }}>
              <DollarSign size={15} /> Sell Your Tickets
            </Link>
          </div>
        </div>
      </div>

      {/* Main Listings */}
      <div className="tm-container" style={{ padding: '32px 20px', maxWidth: '840px' }}>
        {loading ? (
          <div style={{ padding: '60px 0', textAlign: 'center' }}>
            <TicketmasterSpinner size="md" message="Loading resale exchange..." />
          </div>
        ) : listings.length === 0 ? (
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
            <ShoppingBag size={40} color="#D1D5DB" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1F1F1F', margin: '0 0 6px 0' }}>
              No resale tickets currently listed
            </h3>
            <p style={{ fontSize: '14px', color: '#6B6B6B', margin: '0 0 20px 0', lineHeight: 1.5 }}>
              Check back frequently as fans post last-minute verified tickets, or list an extra ticket you own.
            </p>
            <Link to="/tickets" className="btn-primary" style={{ padding: '12px 24px', borderRadius: '8px' }}>
              Sell My Extra Tickets
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {listings.map((item) => {
              const ticket = item.ticketId || {};
              const event = item.eventId || ticket.eventId || {};
              const isMine = user && (item.sellerId?._id === user.id || item.sellerId === user.id);

              const dateStr = event.startDate
                ? new Date(event.startDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
                : 'Date TBA';

              return (
                <div
                  key={item._id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E5E5E5',
                    padding: '20px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '20px',
                  }}
                >
                  <div style={{ flex: 1, minWidth: '260px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ backgroundColor: '#EFF6FF', color: '#026CDF', fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                        Fan Resale
                      </span>
                      <span style={{ fontSize: '12px', color: '#6B6B6B' }}>
                        Listed by: {item.sellerId?.firstName || 'Verified Fan'}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1F1F1F', margin: '0 0 4px 0' }}>
                      {event.title || 'Event Ticket'}
                    </h3>

                    <p style={{ fontSize: '13px', color: '#6B6B6B', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} color="#026CDF" /> {dateStr} • {event.venue || 'Venue'}
                    </p>

                    <div style={{ display: 'flex', gap: '12px', fontSize: '12px', fontWeight: 600, color: '#4B4B4B' }}>
                      <span>SEC: {ticket.section || 'GA'}</span>
                      <span>ROW: {ticket.row || 'GA'}</span>
                      <span>SEAT: {ticket.seat || 'Open'}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#8C8C8C', display: 'block', textTransform: 'uppercase' }}>Verified Price</span>
                      <span style={{ fontSize: '24px', fontWeight: 900, color: '#026CDF' }}>
                        ${item.price?.toFixed(2)}
                      </span>
                    </div>

                    {!isMine ? (
                      <button
                        className="btn-primary"
                        style={{ padding: '10px 22px', fontSize: '14px', borderRadius: '8px' }}
                        disabled={buyingId === item._id}
                        onClick={() => handleBuy(item._id)}
                      >
                        {buyingId === item._id ? 'Securing...' : 'Buy This Ticket'}
                      </button>
                    ) : (
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#6B6B6B', backgroundColor: '#F3F4F6', padding: '6px 12px', borderRadius: '6px' }}>
                        Your Active Listing
                      </span>
                    )}
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
