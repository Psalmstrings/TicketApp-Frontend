import React from 'react';
import logo from './ticketmaster-logoo.png';

/**
 * Ticketmaster Logo Component
 * Uses the provided local PNG asset.
 */
export default function TicketmasterLogo({
  height = 38,
  width = 'auto',
  className = '',
  style = {},
}) {
  return (
    <img
      src={logo}
      alt="Ticketmaster"
      height={height}
      width={width}
      className={className}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        objectFit: 'contain',
        ...style,
      }}
    />
  );
}