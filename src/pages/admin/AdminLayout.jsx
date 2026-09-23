import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Users, Calendar, Ticket, ShoppingBag, FileText, BarChart3, ArrowLeft } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/admin', icon: <BarChart3 size={18} />, label: 'Stats', end: true },
  { to: '/admin/users', icon: <Users size={18} />, label: 'Users' },
  { to: '/admin/events', icon: <Calendar size={18} />, label: 'Events' },
  { to: '/admin/tickets', icon: <Ticket size={18} />, label: 'Tickets' },
  { to: '/admin/orders', icon: <ShoppingBag size={18} />, label: 'Orders' },
  { to: '/admin/logs', icon: <FileText size={18} />, label: 'Logs' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a' }}>
      {/* Admin Header */}
      <div style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', padding: '48px 16px 0', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <button onClick={() => navigate('/home')} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <ArrowLeft size={18} color="#fff" />
          </button>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Admin</p>
            <h1 style={{ color: '#fff', fontSize: '18px', fontWeight: 800, margin: 0 }}>Management Panel</h1>
          </div>
        </div>
        {/* Tab nav */}
        <div style={{ display: 'flex', overflowX: 'auto', scrollbarWidth: 'none', gap: '0' }}>
          {NAV_ITEMS.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end}
              style={({ isActive }) => ({
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '10px 14px',
                textDecoration: 'none',
                borderBottom: isActive ? '2px solid #fff' : '2px solid transparent',
                color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              })}>
              {item.icon}
              <span style={{ fontSize: '10px', fontWeight: 600 }}>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
      <div style={{ paddingBottom: '40px' }}>
        <Outlet />
      </div>
    </div>
  );
}
