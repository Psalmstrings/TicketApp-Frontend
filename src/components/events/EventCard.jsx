import React from 'react';
import { Calendar, MapPin, Tag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * EventCard – reusable card for displaying an event summary.
 *
 * @param {object} event - event object from the API
 * @param {string} [className] - optional extra class
 */
export default function EventCard({ event, className = '' }) {
  const navigate = useNavigate();

  if (!event) return null;

  const {
    _id,
    title = 'Untitled Event',
    venue = 'TBA',
    date,
    category,
    coverImage,
    ticketTypes = [],
    status,
  } = event;

  // Format date
  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Date TBA';

  // Price range from ticket types
  const prices = ticketTypes.map((t) => t.price).filter((p) => typeof p === 'number');
  const minPrice = prices.length ? Math.min(...prices) : null;
  const maxPrice = prices.length ? Math.max(...prices) : null;
  const priceLabel =
    prices.length === 0
      ? null
      : minPrice === 0
      ? 'FREE'
      : minPrice === maxPrice
      ? `$${minPrice}`
      : `$${minPrice} – $${maxPrice}`;

  // Gradient fallback colours by category
  const categoryGradients = {
    Music: 'linear-gradient(135deg, #1a0533 0%, #4c1d95 100%)',
    Sports: 'linear-gradient(135deg, #0c2340 0%, #1e40af 100%)',
    Tech: 'linear-gradient(135deg, #0f1a33 0%, #1d4ed8 100%)',
    Arts: 'linear-gradient(135deg, #2d0a0a 0%, #9f1239 100%)',
    Food: 'linear-gradient(135deg, #1a1200 0%, #92400e 100%)',
    default: 'linear-gradient(135deg, #0f0f1a 0%, #1e1b4b 100%)',
  };
  const fallbackGradient = categoryGradients[category] ?? categoryGradients.default;

  return (
    <div
      className={className}
      onClick={() => navigate(`/events/${_id}`)}
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        background: '#16162a',
        border: '1px solid rgba(255,255,255,0.07)',
        cursor: 'pointer',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.35)';
      }}
    >
      {/* Cover image area */}
      <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
        {coverImage ? (
          <img
            src={coverImage}
            alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: fallbackGradient }} />
        )}

        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(22,22,42,0.95) 0%, rgba(22,22,42,0.2) 60%, transparent 100%)',
          }}
        />

        {/* Category badge */}
        {category && (
          <span
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              background: 'rgba(99,102,241,0.85)',
              backdropFilter: 'blur(6px)',
              color: '#e0e7ff',
              fontSize: 11,
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: 20,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              border: '1px solid rgba(129,140,248,0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Tag size={10} />
            {category}
          </span>
        )}

        {/* Price label */}
        {priceLabel && (
          <span
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              background: priceLabel === 'FREE' ? 'rgba(16,185,129,0.85)' : 'rgba(15,15,26,0.85)',
              backdropFilter: 'blur(6px)',
              color: priceLabel === 'FREE' ? '#d1fae5' : '#e2e8f0',
              fontSize: 12,
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: 20,
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          >
            {priceLabel}
          </span>
        )}
      </div>

      {/* Card body */}
      <div style={{ padding: '14px 16px 16px' }}>
        <h3
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: '#f1f5f9',
            marginBottom: 8,
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {title}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 14 }}>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              color: '#94a3b8',
            }}
          >
            <Calendar size={13} style={{ color: '#6366f1', flexShrink: 0 }} />
            {formattedDate}
          </span>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              color: '#94a3b8',
            }}
          >
            <MapPin size={13} style={{ color: '#6366f1', flexShrink: 0 }} />
            <span
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '90%',
              }}
            >
              {venue}
            </span>
          </span>
        </div>

        {/* View Event button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/events/${_id}`);
          }}
          style={{
            width: '100%',
            padding: '10px 0',
            background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
            border: 'none',
            borderRadius: 10,
            color: '#fff',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            letterSpacing: '0.02em',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          View Event <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
