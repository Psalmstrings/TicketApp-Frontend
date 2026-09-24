import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, QrCode, ArrowRight, Send, DollarSign, CheckCircle2, AlertCircle } from 'lucide-react';

const STATUS_CONFIG = {
  SOLD: { label: 'Valid / Active', bg: '#ECFDF5', color: '#059669', border: '#A7F3D0' },
  AVAILABLE: { label: 'Available', bg: '#EFF6FF', color: '#026CDF', border: '#BFDBFE' },
  USED: { label: 'Used / Redeemed', bg: '#F3F4F6', color: '#6B7280', border: '#E5E7EB' },
  TRANSFERRED: { label: 'Transferred', bg: '#F5F3FF', color: '#7C3AED', border: '#DDD6FE' },
  TRANSFER_PENDING: { label: 'Transfer Pending', bg: '#FFFBEB', color: '#D97706', border: '#FDE68A' },
  LISTED: { label: 'Listed for Resale', bg: '#FFF7ED', color: '#EA580C', border: '#FED7AA' },
  CANCELLED: { label: 'Cancelled', bg: '#FEF2F2', color: '#DC2626', border: '#FECACA' },
  RESERVED: { label: 'Reserved', bg: '#F0FDF4', color: '#16A34A', border: '#BBF7D0' },
};

/**
 * Reusable Ticketmaster TicketCard Component
 * Supports variants: 'digital' | 'purchased' | 'wallet' | 'transfer' | 'resale' | 'selection'
 */
export default function TicketCard({
  ticket,
  event: passedEvent,
  variant = 'wallet',
  onTransfer,
  onResale,
  onSelect,
  isSelected = false,
  className = '',
  style = {},
}) {
  const navigate = useNavigate();

  if (!ticket && !passedEvent) return null;

  const event = ticket?.eventId || passedEvent || {};
  const ticketType = ticket?.ticketTypeId || {};

  const id = ticket?._id || ticket?.id;
  const eventId = event._id || event.id;

  const statusKey = ticket?.status || 'SOLD';
  const status = STATUS_CONFIG[statusKey] || STATUS_CONFIG.SOLD;

  const title = event.title || 'Event Admission';
  const venue = event.venue || 'Venue';
  const address = event.address || '';
  const dateObj = event.startDate ? new Date(event.startDate) : null;
  const dateStr = dateObj
    ? dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
    : 'Date TBA';
  const timeStr = event.startTime || (dateObj ? dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '');

  const section = ticket?.section || ticketType.section || 'GA';
  const row = ticket?.row || ticketType.row || 'GA';
  const seat = ticket?.seat || 'General';
  const ticketNumber = ticket?.ticketNumber || 'TICK-TM-000000';
  const price = ticket?.price !== undefined ? ticket.price : ticketType.price;

  const imageUrl =
    event.coverImage?.url ||
    event.bannerImage ||
    event.coverImageUrl ||
    'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&auto=format&fit=crop&q=80';

  const handleCardClick = () => {
    if (variant === 'selection' && onSelect) {
      onSelect(ticket || ticketType);
      return;
    }
    if (id) {
      navigate(`/tickets/${id}`);
    } else if (eventId) {
      navigate(`/events/${eventId}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`ticket-wrapper ${className}`}
      style={{
        width: '100%',
        maxWidth: variant === 'digital' ? '460px' : '100%',
        margin: '0 auto',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: isSelected ? '2px solid #026CDF' : '1px solid #E5E5E5',
        boxShadow: isSelected
          ? '0 0 0 3px rgba(2, 108, 223, 0.2), 0 8px 24px rgba(0,0,0,0.08)'
          : '0 4px 16px rgba(0,0,0,0.06)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        ...style,
      }}
    >
      {/* Visual Accent Header Banner */}
      <div
        style={{
          position: 'relative',
          height: variant === 'digital' ? '140px' : '100px',
          background: `linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.75) 100%), url(${imageUrl}) center/cover no-repeat`,
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          color: '#FFFFFF',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              backgroundColor: 'rgba(0, 0, 0, 0.55)',
              padding: '3px 8px',
              borderRadius: '4px',
              backdropFilter: 'blur(4px)',
            }}
          >
            Ticketmaster Verified
          </span>

          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: '20px',
              backgroundColor: status.bg,
              color: status.color,
              border: `1px solid ${status.border}`,
            }}
          >
            {status.label}
          </span>
        </div>

        <div>
          <h3
            style={{
              fontSize: variant === 'digital' ? '20px' : '17px',
              fontWeight: 800,
              color: '#FFFFFF',
              margin: '0 0 2px 0',
              textShadow: '0 1px 3px rgba(0,0,0,0.6)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </h3>
          <p
            style={{
              fontSize: '13px',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: 0,
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            }}
          >
            {venue} {address ? `• ${address}` : ''}
          </p>
        </div>
      </div>

      {/* Main Ticket Info Section */}
      <div style={{ padding: '16px 20px 8px' }}>
        {/* Date & Time Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '14px',
            borderBottom: '1px solid #F0F0F0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={16} color="#026CDF" />
            <div>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#1F1F1F' }}>
                {dateStr}
              </p>
              {timeStr && (
                <p style={{ margin: 0, fontSize: '12px', color: '#6B6B6B' }}>
                  Doors open • {timeStr}
                </p>
              )}
            </div>
          </div>

          {price !== undefined && (
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '11px', color: '#8C8C8C', display: 'block' }}>Admission</span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: '#026CDF' }}>
                {price === 0 ? 'FREE' : `$${price}`}
              </span>
            </div>
          )}
        </div>

        {/* Seat Coordinates Matrix (SEC / ROW / SEAT) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            padding: '14px 0 6px',
            textAlign: 'center',
          }}
        >
          <div style={{ backgroundColor: '#F8F9FA', borderRadius: '8px', padding: '10px 4px', border: '1px solid #E5E5E5' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#6B6B6B', letterSpacing: '0.05em' }}>
              SEC
            </span>
            <p style={{ margin: '2px 0 0 0', fontSize: '17px', fontWeight: 800, color: '#1F1F1F' }}>
              {section}
            </p>
          </div>

          <div style={{ backgroundColor: '#F8F9FA', borderRadius: '8px', padding: '10px 4px', border: '1px solid #E5E5E5' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#6B6B6B', letterSpacing: '0.05em' }}>
              ROW
            </span>
            <p style={{ margin: '2px 0 0 0', fontSize: '17px', fontWeight: 800, color: '#1F1F1F' }}>
              {row}
            </p>
          </div>

          <div style={{ backgroundColor: '#F8F9FA', borderRadius: '8px', padding: '10px 4px', border: '1px solid #E5E5E5' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#6B6B6B', letterSpacing: '0.05em' }}>
              SEAT
            </span>
            <p style={{ margin: '2px 0 0 0', fontSize: '17px', fontWeight: 800, color: '#1F1F1F' }}>
              {seat}
            </p>
          </div>
        </div>
      </div>

      {/* Perforation Cut-out Divider */}
      <div style={{ position: 'relative', margin: '8px 0', height: '14px', display: 'flex', alignItems: 'center' }}>
        <div className="ticket-notch-left" />
        <div
          style={{
            width: '100%',
            height: '1px',
            borderTop: '2px dashed #D1D5DB',
            margin: '0 14px',
          }}
        />
        <div className="ticket-notch-right" />
      </div>

      {/* Ticket Stub & Barcode / Actions Section */}
      <div style={{ padding: '8px 20px 18px', backgroundColor: '#FFFFFF' }}>
        {/* Barcode / QR Simulation */}
        <div
          style={{
            backgroundColor: '#F8F9FA',
            border: '1px solid #E5E5E5',
            borderRadius: '10px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E5E5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#026CDF',
              }}
            >
              <QrCode size={22} />
            </div>

            <div>
              <p style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: '#1F1F1F', letterSpacing: '0.02em' }}>
                Tap to View Barcode
              </p>
              <p style={{ margin: '2px 0 0 0', fontSize: '11px', fontFamily: 'monospace', color: '#6B6B6B' }}>
                {ticketNumber}
              </p>
            </div>
          </div>

          {/* Barcode stripes graphic */}
          <div
            style={{
              display: 'flex',
              gap: '2px',
              height: '24px',
              alignItems: 'center',
              opacity: 0.7,
            }}
          >
            {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3].map((w, i) => (
              <div
                key={i}
                style={{
                  width: `${w}px`,
                  height: '100%',
                  backgroundColor: '#1F1F1F',
                }}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
          <button
            className="btn-primary"
            style={{ flex: 2, padding: '10px 14px', fontSize: '13px', borderRadius: '8px' }}
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
          >
            View Ticket <ArrowRight size={14} />
          </button>

          {onTransfer && statusKey === 'SOLD' && (
            <button
              className="btn-secondary"
              style={{ flex: 1, padding: '10px 10px', fontSize: '13px', borderRadius: '8px' }}
              onClick={(e) => {
                e.stopPropagation();
                onTransfer(ticket);
              }}
            >
              <Send size={14} /> Transfer
            </button>
          )}

          {onResale && statusKey === 'SOLD' && (
            <button
              className="btn-secondary"
              style={{ flex: 1, padding: '10px 10px', fontSize: '13px', borderRadius: '8px', color: '#D97706' }}
              onClick={(e) => {
                e.stopPropagation();
                onResale(ticket);
              }}
            >
              <DollarSign size={14} /> Sell
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
