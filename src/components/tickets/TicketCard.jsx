import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Custom Ticketmaster double-ticket icon matching mobile design
 */
export function TicketsIcon({ size = 18, color = '#FFFFFF' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      <rect x="2" y="6" width="15" height="12" rx="2" />
      <path d="M17 9l4 2v6l-4 2" />
      <line x1="7" y1="10" x2="7.01" y2="10" strokeWidth="3" />
      <line x1="7" y1="14" x2="7.01" y2="14" strokeWidth="3" />
    </svg>
  );
}

/**
 * Resolve absolute or relative image URL
 */
const resolveImageUrl = (img) => {
  if (!img) return 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&auto=format&fit=crop&q=80';
  if (typeof img === 'string') {
    if (img.startsWith('/uploads')) return `http://localhost:5000${img}`;
    return img;
  }
  if (img.url) {
    if (img.url.startsWith('/uploads')) return `http://localhost:5000${img.url}`;
    return img.url;
  }
  return 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&auto=format&fit=crop&q=80';
};

/**
 * Reusable Event Ticket Card for "My Tickets"
 * Matches Ticketmaster mobile design (Screenshot 1)
 */
export default function TicketCard({
  ticket,
  event: passedEvent,
  tickets = [],
  ticketCount: passedCount,
  onClick,
  className = '',
  style = {},
}) {
  const navigate = useNavigate();

  if (!ticket && !passedEvent) return null;

  const event = ticket?.eventId || passedEvent || {};
  const id = ticket?._id || ticket?.id;
  const count = passedCount || (tickets && tickets.length > 0 ? tickets.length : 1);

  const title = event.title || 'Event Admission';
  const venue = event.venue || 'Venue';
  const address = event.address ? ` - ${event.address}` : '';
  const venueDisplay = `${venue}${address}`;

  const imageUrl = resolveImageUrl(
    event.coverImage?.url || event.coverImage || event.bannerImage || event.coverImageUrl
  );

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    if (id) {
      navigate(`/tickets/${id}`);
    } else if (event._id || event.id) {
      navigate(`/events/${event._id || event.id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`ticketmaster-event-card ${className}`}
      style={{
        width: '100%',
        backgroundColor: '#000000',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 18px rgba(0, 0, 0, 0.45)',
        cursor: 'pointer',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.6)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 18px rgba(0, 0, 0, 0.45)';
      }}
    >
      {/* Event Artwork Image */}
      <div
        style={{
          width: '100%',
          height: '210px',
          overflow: 'hidden',
          backgroundColor: '#111111',
          position: 'relative',
        }}
      >
        <img
          src={imageUrl}
          alt={title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
          onError={(e) => {
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&auto=format&fit=crop&q=80';
          }}
        />
      </div>

      {/* Card Details (Pitch Black) */}
      <div
        style={{
          padding: '16px 16px 18px',
          backgroundColor: '#000000',
          color: '#FFFFFF',
        }}
      >
        {/* Title */}
        <h2
          style={{
            fontSize: '20px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            lineHeight: 1.25,
            color: '#FFFFFF',
            margin: '0 0 12px 0',
            wordBreak: 'break-word',
          }}
        >
          {title}
        </h2>

        {/* Subtle White Bar Accent */}
        <div
          style={{
            width: '135px',
            height: '3px',
            backgroundColor: '#FFFFFF',
            borderRadius: '2px',
            marginBottom: '14px',
          }}
        />

        {/* Venue & Ticket Count Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          {/* Venue (Left) */}
          <p
            style={{
              margin: 0,
              fontSize: '14px',
              fontWeight: 700,
              color: '#FFFFFF',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 'calc(100% - 70px)',
            }}
          >
            {venueDisplay}
          </p>

          {/* Ticket Count (Right) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              flexShrink: 0,
            }}
          >
            <TicketsIcon size={18} color="#FFFFFF" />
            <span
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#FFFFFF',
                letterSpacing: '0.02em',
              }}
            >
              x{count}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
