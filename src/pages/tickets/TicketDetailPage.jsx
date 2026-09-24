import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout.jsx';
import TicketmasterSpinner from '../../components/ui/TicketmasterSpinner.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import api from '../../lib/axios.js';
import {
  ChevronLeft,
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
  Send,
  DollarSign,
  QrCode,
  Tag,
  AlertCircle,
  CheckCircle2,
  Share2,
} from 'lucide-react';

export default function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showTransfer, setShowTransfer] = useState(false);
  const [showResale, setShowResale] = useState(false);

  // Form states
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [transferring, setTransferring] = useState(false);

  const [resalePrice, setResalePrice] = useState('');
  const [listing, setListing] = useState(false);

  const isApproved = user?.status === 'APPROVED' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/tickets/${id}`);
      setTicket(data.data || data);
    } catch (err) {
      toast.error('Ticket could not be loaded.');
      navigate('/tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!recipientEmail.trim()) {
      toast.error('Recipient email is required.');
      return;
    }
    setTransferring(true);
    try {
      await api.post('/transfers', {
        ticketId: ticket._id || ticket.id,
        recipientEmail: recipientEmail.trim(),
        recipientName: recipientName.trim(),
      });
      toast.success('Transfer invitation sent!');
      setShowTransfer(false);
      fetchTicket();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Transfer failed.');
    } finally {
      setTransferring(false);
    }
  };

  const handleResale = async (e) => {
    e.preventDefault();
    const price = parseFloat(resalePrice);
    if (isNaN(price) || price <= 0) {
      toast.error('Please enter a valid price.');
      return;
    }
    setListing(true);
    try {
      await api.post('/resale', {
        ticketId: ticket._id || ticket.id,
        price,
      });
      toast.success('Ticket listed on the Resale Marketplace!');
      setShowResale(false);
      fetchTicket();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Listing failed.');
    } finally {
      setListing(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <TicketmasterSpinner size="lg" message="Loading ticket details..." />
        </div>
      </AppLayout>
    );
  }

  if (!ticket) return null;

  const event = ticket.eventId || {};
  const ticketType = ticket.ticketTypeId || {};

  const title = event.title || 'Event Admission';
  const venue = event.venue || 'Venue';
  const address = event.address || '';
  const dateObj = event.startDate ? new Date(event.startDate) : null;
  const dateStr = dateObj
    ? dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : 'Date TBA';
  const timeStr = event.startTime || (dateObj ? dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '');

  const section = ticket.section || ticketType.section || 'General';
  const row = ticket.row || ticketType.row || 'GA';
  const seat = ticket.seat || 'Open';
  const ticketNumber = ticket.ticketNumber || 'TICK-TM-000000';

  const canTransfer = ticket.status === 'SOLD' && ticket.transferable && isApproved;
  const canResell = ticket.status === 'SOLD' && ticket.resellable && isApproved;

  const imageUrl =
    event.coverImage?.url ||
    event.bannerImage ||
    'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&auto=format&fit=crop&q=80';

  return (
    <AppLayout>
      <div className="tm-container" style={{ padding: '28px 20px', maxWidth: '640px' }}>
        {/* Back Link */}
        <Link
          to="/tickets"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#026CDF',
            fontSize: '14px',
            fontWeight: 700,
            textDecoration: 'none',
            marginBottom: '20px',
          }}
        >
          <ChevronLeft size={18} /> Back to My Tickets
        </Link>

        {/* Digital Ticket Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #E5E5E5',
            boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
            overflow: 'hidden',
          }}
        >
          {/* Header Banner */}
          <div
            style={{
              position: 'relative',
              height: '160px',
              background: `linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%), url(${imageUrl}) center/cover no-repeat`,
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              color: '#FFFFFF',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                }}
              >
                Ticketmaster Verified
              </span>
              <StatusBadge status={ticket.status} />
            </div>

            <div>
              <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 4px 0' }}>
                {title}
              </h1>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)', margin: 0 }}>
                {venue} {address ? `• ${address}` : ''}
              </p>
            </div>
          </div>

          {/* Seat Indicators */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              backgroundColor: '#F8F9FA',
              borderBottom: '1px solid #E5E5E5',
              textAlign: 'center',
            }}
          >
            <div style={{ padding: '14px', borderRight: '1px solid #E5E5E5' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#6B6B6B' }}>SEC</span>
              <p style={{ margin: '2px 0 0', fontSize: '22px', fontWeight: 800, color: '#1F1F1F' }}>{section}</p>
            </div>
            <div style={{ padding: '14px', borderRight: '1px solid #E5E5E5' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#6B6B6B' }}>ROW</span>
              <p style={{ margin: '2px 0 0', fontSize: '22px', fontWeight: 800, color: '#1F1F1F' }}>{row}</p>
            </div>
            <div style={{ padding: '14px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#6B6B6B' }}>SEAT</span>
              <p style={{ margin: '2px 0 0', fontSize: '22px', fontWeight: 800, color: '#1F1F1F' }}>{seat}</p>
            </div>
          </div>

          {/* QR Code Presentation Box */}
          <div style={{ padding: '32px 24px', textAlign: 'center', backgroundColor: '#FFFFFF' }}>
            <div
              style={{
                width: '220px',
                height: '220px',
                margin: '0 auto',
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '2px solid #E5E5E5',
                padding: '12px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Animated laser scan beam */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  height: '3px',
                  backgroundColor: '#026CDF',
                  boxShadow: '0 0 10px #026CDF',
                  animation: 'tmLaserScan 2s ease-in-out infinite alternate',
                  zIndex: 3,
                }}
              />

              {ticket.qrCodeImage || ticket.qrDataUrl ? (
                <img
                  src={ticket.qrCodeImage || ticket.qrDataUrl}
                  alt="QR Code"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              ) : (
                <QrCode size={160} color="#1F1F1F" />
              )}
            </div>

            <p style={{ fontSize: '14px', fontWeight: 700, color: '#1F1F1F', marginTop: '16px', marginBottom: '2px' }}>
              Hold near reader at venue entrance
            </p>
            <p style={{ fontSize: '12px', fontFamily: 'monospace', color: '#6B6B6B', margin: 0, letterSpacing: '1px' }}>
              {ticketNumber}
            </p>
          </div>

          {/* Ticket Perforation */}
          <div style={{ position: 'relative', height: '16px', display: 'flex', alignItems: 'center' }}>
            <div className="ticket-notch-left" />
            <div
              style={{
                width: '100%',
                height: '1px',
                borderTop: '2px dashed #D1D5DB',
                margin: '0 16px',
              }}
            />
            <div className="ticket-notch-right" />
          </div>

          {/* Event Details Breakdown */}
          <div style={{ padding: '20px 24px', backgroundColor: '#FAFAFA' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6B6B6B' }}>Date</span>
                <span style={{ fontWeight: 600, color: '#1F1F1F' }}>{dateStr}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6B6B6B' }}>Time</span>
                <span style={{ fontWeight: 600, color: '#1F1F1F' }}>{timeStr || '19:00'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6B6B6B' }}>Venue</span>
                <span style={{ fontWeight: 600, color: '#1F1F1F' }}>{venue}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6B6B6B' }}>Ticket Tier</span>
                <span style={{ fontWeight: 600, color: '#1F1F1F' }}>{ticketType.name || 'General Admission'}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: canTransfer && canResell ? '1fr 1fr' : '1fr', gap: '12px', marginTop: '20px' }}>
              {canTransfer && (
                <button
                  className="btn-primary"
                  style={{ padding: '12px' }}
                  onClick={() => setShowTransfer(true)}
                >
                  <Send size={16} /> Transfer Ticket
                </button>
              )}

              {canResell && (
                <button
                  className="btn-secondary"
                  style={{ padding: '12px', color: '#EA580C' }}
                  onClick={() => setShowResale(true)}
                >
                  <DollarSign size={16} /> List for Resale
                </button>
              )}
            </div>

            {!isApproved && ticket.status === 'SOLD' && (
              <div style={{ marginTop: '14px', padding: '10px 14px', backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#92400E' }}>
                <AlertCircle size={16} />
                <span>Account approval is required by an administrator before transfers or resale are unlocked.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transfer Modal */}
      {showTransfer && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setShowTransfer(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '460px',
              width: '100%',
            }}
          >
            <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: 800 }}>Transfer Ticket</h3>
            <p style={{ fontSize: '13px', color: '#6B6B6B', margin: '0 0 16px 0' }}>
              Send this ticket securely to a friend or family member.
            </p>

            <form onSubmit={handleTransfer}>
              <div style={{ marginBottom: '14px' }}>
                <label className="input-label">Recipient Name</label>
                <input
                  type="text"
                  placeholder="e.g. Jordan Miller"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="input"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label className="input-label">Recipient Email *</label>
                <input
                  type="email"
                  placeholder="recipient@example.com"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="input"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setShowTransfer(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={transferring}
                  className="btn-primary"
                  style={{ flex: 2 }}
                >
                  {transferring ? 'Sending...' : 'Send Transfer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resale Modal */}
      {showResale && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setShowResale(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '460px',
              width: '100%',
            }}
          >
            <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: 800 }}>List on Resale Marketplace</h3>
            <p style={{ fontSize: '13px', color: '#6B6B6B', margin: '0 0 16px 0' }}>
              Set your asking price for this ticket. Once sold, funds are deposited to your wallet.
            </p>

            <form onSubmit={handleResale}>
              <div style={{ marginBottom: '20px' }}>
                <label className="input-label">Asking Price ($) *</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="e.g. 75"
                  value={resalePrice}
                  onChange={(e) => setResalePrice(e.target.value)}
                  className="input"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setShowResale(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={listing}
                  className="btn-primary"
                  style={{ flex: 2, backgroundColor: '#EA580C' }}
                >
                  {listing ? 'Listing...' : 'Confirm Resale'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes tmLaserScan {
          0% { top: 12px; }
          100% { top: 206px; }
        }
      `}</style>
    </AppLayout>
  );
}
