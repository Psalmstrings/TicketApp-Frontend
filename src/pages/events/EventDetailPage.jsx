import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import AppLayout from '../../components/layout/AppLayout.jsx';
import TicketmasterSpinner from '../../components/ui/TicketmasterSpinner.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import api from '../../lib/axios.js';
import {
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
  Share2,
  Heart,
  ChevronLeft,
  Users,
  CheckCircle2,
  Info,
  CreditCard,
  Lock,
  ArrowRight,
} from 'lucide-react';

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  // Checkout modal state
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [purchasing, setPurchasing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(null);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/events/${id}`);
      const ev = data.data || data.event || data;
      setEvent(ev);
      if (ev.ticketTypes && ev.ticketTypes.length > 0) {
        setSelectedType(ev.ticketTypes[0]);
      }
    } catch (err) {
      toast.error('Event could not be loaded.');
      navigate('/explore');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: `Check out tickets for ${event?.title} on Ticketmaster!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Event link copied to clipboard!');
    }
  };

  const handleOpenCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!selectedType) {
      toast.error('Please select a ticket tier.');
      return;
    }
    setShowCheckoutModal(true);
  };

  const handleConfirmPurchase = async () => {
    setPurchasing(true);
    try {
      const { data } = await api.post('/orders', {
        eventId: event._id || event.id,
        ticketTypeId: selectedType._id || selectedType.id,
        quantity,
      });

      // Celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore if canvas confetti fails
      }

      setOrderComplete(data.data || data);
      toast.success('Tickets confirmed! Added to My Tickets.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Purchase could not be completed.');
      setShowCheckoutModal(false);
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <TicketmasterSpinner size="lg" message="Loading event information..." />
        </div>
      </AppLayout>
    );
  }

  if (!event) return null;

  const dateObj = event.startDate ? new Date(event.startDate) : null;
  const dateFormatted = dateObj
    ? dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : 'Date TBA';
  const timeFormatted = event.startTime || (dateObj ? dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '');

  const imageUrl =
    event.coverImage?.url ||
    event.bannerImage ||
    event.coverImageUrl ||
    'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200&auto=format&fit=crop&q=80';

  const ticketTypes = event.ticketTypes || [];
  const isSoldOut = ticketTypes.length > 0 && ticketTypes.every((t) => (t.availableQuantity || t.quantity) <= 0);

  // Price calculations
  const unitPrice = selectedType ? (selectedType.price || 0) : 0;
  const subtotal = unitPrice * quantity;
  const serviceFee = unitPrice > 0 ? Number((subtotal * 0.1).toFixed(2)) : 0;
  const orderProcessingFee = unitPrice > 0 ? 2.50 : 0;
  const totalAmount = subtotal + serviceFee + orderProcessingFee;

  return (
    <AppLayout>
      {/* ===== HERO ARTWORK BANNER ===== */}
      <div
        style={{
          position: 'relative',
          backgroundColor: '#111827',
          color: '#FFFFFF',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'relative',
            minHeight: '360px',
            background: `linear-gradient(180deg, rgba(17,24,39,0.4) 0%, rgba(17,24,39,0.85) 75%, #111827 100%), url(${imageUrl}) center/cover no-repeat`,
            display: 'flex',
            alignItems: 'flex-end',
          }}
        >
          <div className="tm-container" style={{ padding: '40px 20px', width: '100%' }}>
            {/* Back link */}
            <Link
              to="/explore"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#E0E0E0',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
                marginBottom: '16px',
                backgroundColor: 'rgba(0,0,0,0.4)',
                padding: '6px 12px',
                borderRadius: '20px',
                backdropFilter: 'blur(4px)',
              }}
            >
              <ChevronLeft size={16} /> All Events
            </Link>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ backgroundColor: '#026CDF', color: '#FFFFFF', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.04em' }}>
                    {event.category || 'Concert'}
                  </span>
                  <StatusBadge status={event.status} />
                </div>

                <h1 style={{ fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 900, color: '#FFFFFF', margin: '0 0 10px 0', lineHeight: 1.15 }}>
                  {event.title}
                </h1>

                <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.9)', margin: 0, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '14px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={16} color="#60A5FA" /> {dateFormatted}
                  </span>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={16} color="#60A5FA" /> {timeFormatted || 'Doors at 19:00'}
                  </span>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={16} color="#60A5FA" /> {event.venue} {event.address ? `, ${event.address}` : ''}
                  </span>
                </p>
              </div>

              {/* Share & Favorite Buttons */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleShare}
                  aria-label="Share event"
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <Share2 size={18} />
                </button>

                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  aria-label="Add to favorites"
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: isFavorite ? '#DC2626' : '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <Heart size={18} fill={isFavorite ? '#DC2626' : 'none'} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== TWO-COLUMN MAIN CONTENT ===== */}
      <div className="tm-container" style={{ padding: '36px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1.2fr)', gap: '32px', alignItems: 'start' }}>
          {/* Left Column: Event Details & Venue Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* About the Event */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px solid #E5E5E5', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1F1F1F', margin: '0 0 12px 0' }}>
                About This Event
              </h2>
              <p style={{ fontSize: '14px', color: '#4B4B4B', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>
                {event.description || 'Join thousands of live entertainment fans for an unforgettable performance featuring high-energy production and full stadium sound.'}
              </p>

              {event.entranceInfo && (
                <div style={{ marginTop: '16px', padding: '12px 14px', backgroundColor: '#F8F9FA', borderRadius: '8px', border: '1px solid #E5E5E5' }}>
                  <p style={{ margin: 0, fontSize: '13px', color: '#1F1F1F', fontWeight: 600 }}>
                    🚪 Entrance Information: <span style={{ fontWeight: 400, color: '#4B4B4B' }}>{event.entranceInfo}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Venue & Location Information */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px solid #E5E5E5', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1F1F1F', margin: '0 0 14px 0' }}>
                Venue & Admission Details
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#4B4B4B' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <MapPin size={18} color="#026CDF" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ color: '#1F1F1F' }}>{event.venue}</strong>
                    <p style={{ margin: '2px 0 0', color: '#6B6B6B' }}>{event.address || 'Address provided upon booking'}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Clock size={18} color="#026CDF" />
                  <span>Doors Open: <strong>{event.doorsOpen || '2 hours prior to showtime'}</strong></span>
                </div>

                {event.organizerId && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Users size={18} color="#026CDF" />
                    <span>Presented by: <strong>{event.organizerId.firstName} {event.organizerId.lastName}</strong></span>
                  </div>
                )}
              </div>
            </div>

            {/* 100% Buyer Guarantee & Security */}
            <div style={{ backgroundColor: '#EFF6FF', borderRadius: '16px', padding: '20px', border: '1px solid #BFDBFE', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <ShieldCheck size={26} color="#026CDF" style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#1E3A8A', margin: '0 0 4px 0' }}>
                  Ticketmaster Verified Authentic
                </h4>
                <p style={{ fontSize: '13px', color: '#1E40AF', margin: 0, lineHeight: 1.5 }}>
                  Every ticket purchased on this platform comes with an encrypted QR code verified at turnstiles. Safe transfers, reliable entry, and zero duplicate admissions.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Ticketmaster Ticket Selector Panel */}
          <div
            style={{
              position: 'sticky',
              top: '90px',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E5E5E5',
              padding: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            }}
          >
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1F1F1F', margin: '0 0 16px 0' }}>
              Select Ticket Tiers
            </h2>

            {/* Ticket Tier Cards List */}
            {ticketTypes.length === 0 ? (
              <p style={{ color: '#6B6B6B', fontSize: '14px' }}>No tickets currently available for this event.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                {ticketTypes.map((tt) => {
                  const ttId = tt._id || tt.id;
                  const isSelected = selectedType && (selectedType._id || selectedType.id) === ttId;
                  const available = tt.availableQuantity !== undefined ? tt.availableQuantity : tt.quantity;
                  const isTierSoldOut = available <= 0;

                  return (
                    <div
                      key={ttId}
                      onClick={() => !isTierSoldOut && setSelectedType(tt)}
                      style={{
                        padding: '14px 16px',
                        borderRadius: '12px',
                        border: isSelected ? '2px solid #026CDF' : '1px solid #E5E5E5',
                        backgroundColor: isSelected ? '#EBF3FD' : isTierSoldOut ? '#F9FAFB' : '#FFFFFF',
                        cursor: isTierSoldOut ? 'not-allowed' : 'pointer',
                        opacity: isTierSoldOut ? 0.6 : 1,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <p style={{ fontSize: '15px', fontWeight: 700, color: '#1F1F1F', margin: 0 }}>
                              {tt.name}
                            </p>
                            {isSelected && <CheckCircle2 size={16} color="#026CDF" />}
                          </div>

                          <p style={{ fontSize: '12px', color: '#6B6B6B', margin: '2px 0 0 0' }}>
                            Section {tt.section || 'GA'} • Row {tt.row || 'GA'}
                          </p>

                          <p style={{ fontSize: '11px', color: available < 20 ? '#DC2626' : '#059669', margin: '4px 0 0 0', fontWeight: 600 }}>
                            {isTierSoldOut ? 'Sold Out' : `${available} tickets remaining`}
                          </p>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '18px', fontWeight: 800, color: '#026CDF' }}>
                            {tt.price === 0 ? 'FREE' : `$${tt.price}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quantity Stepper */}
            {selectedType && !isSoldOut && (
              <div style={{ marginBottom: '20px', padding: '14px', backgroundColor: '#F8F9FA', borderRadius: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#1F1F1F' }}>Quantity</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        border: '1px solid #D1D5DB',
                        backgroundColor: '#FFFFFF',
                        fontSize: '16px',
                        fontWeight: 700,
                        cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                        opacity: quantity <= 1 ? 0.4 : 1,
                      }}
                    >
                      -
                    </button>
                    <span style={{ fontSize: '16px', fontWeight: 800, minWidth: '24px', textAlign: 'center' }}>
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(selectedType.availableQuantity || 8, q + 1))}
                      disabled={quantity >= (selectedType.availableQuantity || 8)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        border: '1px solid #D1D5DB',
                        backgroundColor: '#FFFFFF',
                        fontSize: '16px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Pricing Summary */}
            {selectedType && (
              <div style={{ marginBottom: '20px', borderTop: '1px solid #F0F0F0', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6B6B6B', marginBottom: '6px' }}>
                  <span>{selectedType.name} (${unitPrice} × {quantity})</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                {unitPrice > 0 && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6B6B6B', marginBottom: '6px' }}>
                      <span>Service Fee</span>
                      <span>${serviceFee.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6B6B6B', marginBottom: '6px' }}>
                      <span>Order Processing</span>
                      <span>${orderProcessingFee.toFixed(2)}</span>
                    </div>
                  </>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 800, color: '#1F1F1F', borderTop: '1px solid #E5E5E5', paddingTop: '10px', marginTop: '10px' }}>
                  <span>Total Due</span>
                  <span style={{ color: '#026CDF' }}>${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Primary Action Button */}
            <button
              className="btn-primary"
              style={{ width: '100%', padding: '14px', borderRadius: '10px', fontSize: '15px' }}
              disabled={isSoldOut || !selectedType}
              onClick={handleOpenCheckout}
            >
              {isSoldOut ? 'SOLD OUT' : 'GET TICKETS'}
            </button>
          </div>
        </div>
      </div>

      {/* ===== CHECKOUT & PAYMENT MODAL ===== */}
      {showCheckoutModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(5px)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '480px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
            }}
          >
            {orderComplete ? (
              /* Confirmation Screen */
              <div style={{ padding: '36px 24px', textAlign: 'center' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#ECFDF5',
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  <CheckCircle2 size={38} />
                </div>

                <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#1F1F1F', margin: '0 0 6px 0' }}>
                  Tickets Confirmed! 🎉
                </h3>
                <p style={{ fontSize: '14px', color: '#6B6B6B', margin: '0 0 20px 0' }}>
                  Your {quantity} ticket(s) for <strong>{event.title}</strong> have been secured and assigned to your wallet.
                </p>

                <div style={{ backgroundColor: '#F8F9FA', borderRadius: '12px', padding: '14px', textAlign: 'left', marginBottom: '24px', border: '1px solid #E5E5E5' }}>
                  <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#6B6B6B' }}>Order Number: <strong>{orderComplete.order?.orderNumber || 'ORD-TM-2026'}</strong></p>
                  <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#6B6B6B' }}>Tier: <strong>{selectedType.name}</strong></p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#6B6B6B' }}>Total Paid: <strong>${totalAmount.toFixed(2)}</strong></p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    className="btn-primary"
                    style={{ padding: '14px', borderRadius: '10px', fontSize: '15px' }}
                    onClick={() => navigate('/tickets')}
                  >
                    View in My Tickets <ArrowRight size={16} />
                  </button>
                  <button
                    className="btn-secondary"
                    style={{ padding: '12px', borderRadius: '10px' }}
                    onClick={() => {
                      setShowCheckoutModal(false);
                      setOrderComplete(null);
                    }}
                  >
                    Continue Browsing
                  </button>
                </div>
              </div>
            ) : (
              /* Checkout Form */
              <div>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5E5E5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Confirm Order & Payment</h3>
                  <button
                    onClick={() => setShowCheckoutModal(false)}
                    style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6B6B6B' }}
                  >
                    ×
                  </button>
                </div>

                <div style={{ padding: '20px 24px' }}>
                  {/* Event summary snippet */}
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #F0F0F0' }}>
                    <img src={imageUrl} alt="" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                    <div>
                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>{event.title}</h4>
                      <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B6B6B' }}>
                        {dateFormatted} • {selectedType.name} ({quantity} ticket{quantity > 1 ? 's' : ''})
                      </p>
                    </div>
                  </div>

                  {/* Payment method selector */}
                  <div style={{ marginBottom: '20px' }}>
                    <label className="input-label">Select Payment Method</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '12px 14px',
                          borderRadius: '10px',
                          border: paymentMethod === 'CARD' ? '2px solid #026CDF' : '1px solid #E5E5E5',
                          backgroundColor: paymentMethod === 'CARD' ? '#EBF3FD' : '#FFFFFF',
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'CARD'}
                          onChange={() => setPaymentMethod('CARD')}
                        />
                        <CreditCard size={18} color="#026CDF" />
                        <span style={{ fontSize: '14px', fontWeight: 600 }}>Credit / Debit Card or Wallet</span>
                      </label>

                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '12px 14px',
                          borderRadius: '10px',
                          border: paymentMethod === 'PAYSTACK' ? '2px solid #026CDF' : '1px solid #E5E5E5',
                          backgroundColor: paymentMethod === 'PAYSTACK' ? '#EBF3FD' : '#FFFFFF',
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'PAYSTACK'}
                          onChange={() => setPaymentMethod('PAYSTACK')}
                        />
                        <Lock size={18} color="#059669" />
                        <span style={{ fontSize: '14px', fontWeight: 600 }}>Paystack / Flutterwave Gateway</span>
                      </label>
                    </div>
                  </div>

                  {/* Total breakdown */}
                  <div style={{ padding: '14px', backgroundColor: '#F8F9FA', borderRadius: '10px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 800 }}>
                      <span>Total Amount</span>
                      <span style={{ color: '#026CDF' }}>${totalAmount.toFixed(2)}</span>
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#6B6B6B' }}>
                      Includes 100% verified ticket authentication and ticket wallet protection.
                    </p>
                  </div>

                  <button
                    onClick={handleConfirmPurchase}
                    disabled={purchasing}
                    className="btn-primary"
                    style={{ width: '100%', padding: '14px', borderRadius: '10px', fontSize: '15px' }}
                  >
                    {purchasing ? (
                      <TicketmasterSpinner size="sm" color="#FFFFFF" message="Processing order..." />
                    ) : (
                      `Place Order • $${totalAmount.toFixed(2)}`
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </AppLayout>
  );
}
