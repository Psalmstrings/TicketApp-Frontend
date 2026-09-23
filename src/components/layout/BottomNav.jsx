import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Search, Ticket, PlusCircle, User, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const NAV_ITEMS = [
  { to: '/home', icon: Home, label: 'Home' },
  { to: '/explore', icon: Search, label: 'Explore' },
  { to: '/tickets', icon: Ticket, label: 'Tickets' },
  { to: '/create', icon: PlusCircle, label: 'Create', requireApproved: true },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const { user } = useAuth();
  const location = useLocation();

  const isApproved = user?.status === 'APPROVED' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '430px',
      background: 'rgba(15,15,26,0.95)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(99,102,241,0.2)',
      display: 'flex',
      alignItems: 'center',
      height: '64px',
      zIndex: 500,
      boxSizing: 'border-box',
    }}>
      {NAV_ITEMS.map(({ to, icon: Icon, label, requireApproved }) => {
        const isActive = location.pathname === to || (to !== '/home' && location.pathname.startsWith(to));
        const isLocked = requireApproved && !isApproved;

        return (
          <NavLink
            key={to}
            to={to}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px', textDecoration: 'none', padding: '8px 4px', position: 'relative' }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isActive ? 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))' : 'transparent',
              transition: 'all 0.2s',
              position: 'relative',
            }}>
              {isLocked ? (
                <Lock size={20} color="#374151" />
              ) : (
                <Icon
                  size={20}
                  color={isActive ? '#818cf8' : '#4b5563'}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              )}
            </div>
            <span style={{
              fontSize: '10px',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? '#818cf8' : '#4b5563',
              letterSpacing: '0.3px',
            }}>
              {label}
            </span>
            {isActive && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '24px',
                height: '2px',
                background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                borderRadius: '0 0 4px 4px',
              }} />
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
