import React from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  Users,
  Calendar,
  Ticket,
  ShoppingBag,
  FileText,
  BarChart3,
  ArrowLeft,
  Shield,
  ExternalLink,
} from 'lucide-react';
import TicketmasterLogo from '../../components/ui/TicketmasterLogo.jsx';

const NAV_ITEMS = [
  { to: '/admin', icon: <BarChart3 size={16} />, label: 'Analytics', end: true },
  { to: '/admin/users', icon: <Users size={16} />, label: 'Users & Approval' },
  { to: '/admin/events', icon: <Calendar size={16} />, label: 'Events' },
  { to: '/admin/tickets', icon: <Ticket size={16} />, label: 'Tickets' },
  { to: '/admin/orders', icon: <ShoppingBag size={16} />, label: 'Orders' },
  { to: '/admin/logs', icon: <FileText size={16} />, label: 'Audit Logs' },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F5F5', display: 'flex', flexDirection: 'column' }}>
      {/* Admin Top Header */}
      <header
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E5E5E5',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <div className="tm-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Link to="/home" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <TicketmasterLogo height={24} color="#026CDF" />
            </Link>
            <div style={{ width: '1px', height: '20px', backgroundColor: '#E5E5E5' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#EFF6FF', color: '#026CDF', padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <Shield size={13} /> Enterprise Admin Console
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              to="/home"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#6B6B6B',
                textDecoration: 'none',
              }}
            >
              Exit to Main Marketplace <ExternalLink size={13} />
            </Link>
          </div>
        </div>

        {/* Sub-Nav Tabs Bar */}
        <div style={{ borderTop: '1px solid #F0F0F0', backgroundColor: '#FFFFFF' }}>
          <div className="tm-container" style={{ display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '12px 14px',
                  fontSize: '13px',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#026CDF' : '#6B6B6B',
                  textDecoration: 'none',
                  borderBottom: isActive ? '3px solid #026CDF' : '3px solid transparent',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                })}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </header>

      {/* Main Admin View Container */}
      <main style={{ flex: 1, padding: '24px 0 40px' }}>
        <div className="tm-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
