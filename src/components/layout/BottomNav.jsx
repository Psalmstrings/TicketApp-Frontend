import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Compass, Sparkles, Ticket, DollarSign, User } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/home', icon: Compass, label: 'Discover' },
  { to: '/for-you', icon: Sparkles, label: 'For You' },
  { to: '/tickets', icon: Ticket, label: 'My Tickets' },
  { to: '/resale', icon: DollarSign, label: 'Sell' },
  { to: '/profile', icon: User, label: 'My Account' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav
      className="mobile-only"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E5E5E5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: '64px',
        zIndex: 1000,
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
      }}
    >
      {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
        const isActive =
          location.pathname === to ||
          (to === '/home' && location.pathname === '/') ||
          (to !== '/home' && location.pathname.startsWith(to));

        return (
          <NavLink
            key={to}
            to={to}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              textDecoration: 'none',
              height: '100%',
              color: isActive ? '#026CDF' : '#6B6B6B',
              transition: 'color 0.15s ease',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                backgroundColor: isActive ? '#EBF3FD' : 'transparent',
                transition: 'background-color 0.15s ease',
              }}
            >
              <Icon
                size={20}
                color={isActive ? '#026CDF' : '#6B6B6B'}
                strokeWidth={isActive ? 2.5 : 2}
              />
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: isActive ? 700 : 500,
                lineHeight: 1,
              }}
            >
              {label}
            </span>

            {/* Active top line accent indicator */}
            {isActive && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '25%',
                  right: '25%',
                  height: '3px',
                  backgroundColor: '#026CDF',
                  borderRadius: '0 0 3px 3px',
                }}
              />
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
