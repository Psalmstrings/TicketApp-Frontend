import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Heart, ArrowRight } from 'lucide-react';

/**
 * Ticketmaster Signature Event Card
 *
 * Implements the official Ticketmaster event presentation with date badge,
 * high-resolution artwork, event title, venue, category, and pricing.
 */
export default function EventCard({
  event,
  showFavorite = true,
  showPrice = true,
  variant = 'standard', // 'standard' | 'compact' | 'featured'
  className = '',
  style = {},
}) {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  if (!event) return null;

  const id = event._id || event.id;
  const title = event.title || 'Untitled Event';
  const venue = event.venue || 'Venue TBA';
  const address = event.address || '';
  const category = event.category || 'Event';

  // Extract cover image
  const imageUrl =
    event.coverImage?.url ||
    event.bannerImage ||
    event.coverImageUrl ||
    (typeof event.coverImage === 'string' ? event.coverImage : '') ||
    'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&auto=format&fit=crop&q=80';

  // Parse Date
  const rawDate = event.startDate || event.date;
  const dateObj = rawDate ? new Date(rawDate) : null;
  const monthStr = dateObj ? dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase() : 'TBA';
  const dayStr = dateObj ? dateObj.toLocaleDateString('en-US', { day: '2-digit' }) : '--';
  const weekdayStr = dateObj ? dateObj.toLocaleDateString('en-US', { weekday: 'short' }) : '';
  const timeStr = event.startTime || (dateObj ? dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '');

  // Calculate price
  let minPrice = event.minPrice;
  if (minPrice === undefined && Array.isArray(event.ticketTypes) && event.ticketTypes.length > 0) {
    const prices = event.ticketTypes.map(t => t.price).filter(p => typeof p === 'number');
    if (prices.length > 0) minPrice = Math.min(...prices);
  }

  const priceDisplay =
    minPrice === undefined || minPrice === null
      ? 'See Tickets'
      : minPrice === 0
      ? 'FREE'
      : `From $${minPrice}`;

  const handleCardClick = () => {
    navigate(`/events/${id}`);
  };

  const toggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(prev => !prev);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`card card-hover ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E5E5',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        cursor: 'pointer',
        overflow: 'hidden',
        height: '100%',
        position: 'relative',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        ...style,
      }}
    >
      {/* Artwork Section */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '56.25%', // 16:9 Aspect Ratio
          overflow: 'hidden',
          backgroundColor: '#F0F0F0',
        }}
      >
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        />

        {/* Category Badge */}
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            backgroundColor: 'rgba(31, 31, 31, 0.75)',
            backdropFilter: 'blur(4px)',
            color: '#FFFFFF',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            padding: '4px 9px',
            borderRadius: '4px',
            zIndex: 2,
          }}
        >
          {category}
        </div>

        {/* Favorite Heart Button */}
        {showFavorite && (
          <button
            onClick={toggleFavorite}
            aria-label="Add to favorites"
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              width: 34,
              height: 34,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(4px)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              zIndex: 2,
              transition: 'transform 0.15s ease',
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.9)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Heart
              size={18}
              fill={isFavorite ? '#DC2626' : 'none'}
              color={isFavorite ? '#DC2626' : '#4B4B4B'}
              strokeWidth={2.2}
            />
          </button>
        )}
      </div>

      {/* Info Body */}
      <div
        style={{
          padding: '16px',
          display: 'flex',
          gap: '14px',
          flex: 1,
          alignItems: 'flex-start',
        }}
      >
        {/* Date Badge */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 48,
            width: 48,
            height: 52,
            backgroundColor: '#F8F9FA',
            border: '1px solid #E5E5E5',
            borderRadius: '8px',
            flexShrink: 0,
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#026CDF',
              lineHeight: 1,
              letterSpacing: '0.04em',
              marginBottom: '2px',
            }}
          >
            {monthStr}
          </span>
          <span
            style={{
              fontSize: '18px',
              fontWeight: 800,
              color: '#1F1F1F',
              lineHeight: 1,
            }}
          >
            {dayStr}
          </span>
        </div>

        {/* Event Meta Details */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontSize: '15px',
              fontWeight: 700,
              color: '#1F1F1F',
              margin: '0 0 6px 0',
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {title}
          </h3>

          {/* Time & Venue */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <p
              style={{
                fontSize: '13px',
                color: '#6B6B6B',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              <span>{weekdayStr ? `${weekdayStr} · ${timeStr}` : timeStr}</span>
            </p>

            <p
              style={{
                fontSize: '13px',
                color: '#6B6B6B',
                margin: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {venue}
              {address && address !== venue ? ` • ${address}` : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Footer / CTA Bar */}
      <div
        style={{
          padding: '10px 16px 14px',
          borderTop: '1px solid #F0F0F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'auto',
        }}
      >
        {showPrice && (
          <div>
            <span style={{ fontSize: '11px', color: '#8C8C8C', textTransform: 'uppercase', display: 'block', lineHeight: 1 }}>
              Price
            </span>
            <span
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: priceDisplay === 'FREE' ? '#059669' : '#026CDF',
              }}
            >
              {priceDisplay}
            </span>
          </div>
        )}

        <button
          className="btn-outline"
          style={{
            padding: '6px 14px',
            fontSize: '13px',
            borderRadius: '6px',
            marginLeft: 'auto',
          }}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/events/${id}`);
          }}
        >
          See Tickets <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}
