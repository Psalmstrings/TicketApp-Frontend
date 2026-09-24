import React from 'react';

/**
 * Ticketmaster Signature Loading Spinner
 * Matches the official Ticketmaster smooth circular rotating arc loader.
 */
export default function TicketmasterSpinner({
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  color = '#026CDF',
  trackColor = '#E5E5E5',
  fullPage = false,
  overlay = false,
  message = '',
  className = '',
  style = {},
}) {
  const sizeMap = {
    sm: { diameter: 20, stroke: 2.5 },
    md: { diameter: 36, stroke: 3.5 },
    lg: { diameter: 52, stroke: 4 },
    xl: { diameter: 68, stroke: 5 },
  };

  const { diameter, stroke } = sizeMap[size] || sizeMap.md;
  const radius = (diameter - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const spinnerContent = (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        ...style,
      }}
      role="status"
      aria-live="polite"
      aria-label={message || 'Loading Ticketmaster content'}
    >
      <div style={{ position: 'relative', width: diameter, height: diameter }}>
        <svg
          width={diameter}
          height={diameter}
          viewBox={`0 0 ${diameter} ${diameter}`}
          style={{
            animation: 'tmSpinnerRotate 0.9s cubic-bezier(0.4, 0, 0.2, 1) infinite',
            transformOrigin: 'center center',
          }}
        >
          {/* Background track */}
          <circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth={stroke}
          />
          {/* Primary animated arc */}
          <circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.7}
            strokeLinecap="round"
          />
        </svg>
      </div>

      {message && (
        <p
          style={{
            margin: 0,
            fontSize: size === 'sm' ? '12px' : '14px',
            fontWeight: 500,
            color: '#4B4B4B',
            letterSpacing: '0.01em',
          }}
        >
          {message}
        </p>
      )}

      <style>{`
        @keyframes tmSpinnerRotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );

  if (fullPage) {
    return (
      <div
        style={{
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          width: '100%',
        }}
      >
        {spinnerContent}
      </div>
    );
  }

  if (overlay) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
}
