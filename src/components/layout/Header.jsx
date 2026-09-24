import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  MapPin,
  Calendar,
  User,
  ChevronDown,
  Menu,
  X,
  Bell,
  Ticket,
  DollarSign,
  Shield,
  HelpCircle,
  LogOut,
  Sparkles,
  Settings,
} from 'lucide-react';
import TicketmasterLogo from '..//ui/TicketmasterLogo.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const CITIES = ['All Cities', 'New York', 'Los Angeles', 'London', 'Lagos', 'Chicago', 'Houston', 'Atlanta'];
const DATES = [
  { label: 'All Dates', value: '' },
  { label: 'Today', value: 'today' },
  { label: 'This Weekend', value: 'this_weekend' },
  { label: 'This Month', value: 'this_month' },
];

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedDate, setSelectedDate] = useState('');

  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const cityRef = useRef(null);
  const dateRef = useRef(null);
  const userMenuRef = useRef(null);

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  const isApproved = user?.status === 'APPROVED' || isAdmin;
  const isPending = user?.status === 'PENDING' && !isAdmin;

  // Sync search input if in explore URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('search');
    const c = params.get('city');
    const d = params.get('date');
    if (q) setSearchTerm(q);
    if (c) setSelectedCity(c);
    if (d) setSelectedDate(d);
  }, [location.search]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cityRef.current && !cityRef.current.contains(e.target)) setIsCityDropdownOpen(false);
      if (dateRef.current && !dateRef.current.contains(e.target)) setIsDateDropdownOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setIsUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('search', searchTerm.trim());
    if (selectedCity && selectedCity !== 'All Cities') params.set('city', selectedCity);
    if (selectedDate) params.set('date', selectedDate);
    setIsMobileSearchOpen(false);
    navigate(`/explore?${params.toString()}`);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/home');
  };

  return (
    <header
      style={{
        backgroundColor: '#0357b1',
        borderBottom: '1px solid #E5E5E5',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      {/* Pending Account Notice Banner */}
      {user && isPending && (
        <div
          style={{
            backgroundColor: '#102cc9',
            borderBottom: '1px solid #FDE68A',
            color: '#92400E',
            padding: '7px 16px',
            fontSize: '12px',
            fontWeight: 500,
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <span>⏳ Your account is currently <strong>Pending Admin Review</strong>. Once approved, you can create and transfer tickets.</span>
        </div>
      )}

      {/* Main Top Navigation Row */}
      <div className="tm-container" style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
        {/* Left: Logo & Primary Category Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <Link to="/home" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <TicketmasterLogo height={36} color="#ffffff" />
          </Link>

          {/* Desktop Categories */}
          <nav className="desktop-flex" style={{ display: 'none', alignItems: 'center', gap: '20px' }}>
            {[
              { label: 'Concerts', path: '/explore?category=Concerts' },
              { label: 'Sports', path: '/explore?category=Sports' },
              { label: 'Arts & Theater', path: '/explore?category=Arts%20%26%20Theater' },
              { label: 'Family', path: '/explore?category=Family' },
              { label: 'For You', path: '/for-you' },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.path}
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: location.pathname + location.search === item.path ? '#026CDF' : '#fffcfc',
                  textDecoration: 'none',
                  padding: '6px 0',
                  borderBottom: location.pathname + location.search === item.path ? '2px solid #026CDF' : '2px solid transparent',
                  transition: 'color 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#026CDF')}
                onMouseLeave={(e) => {
                  if (location.pathname + location.search !== item.path) e.currentTarget.style.color = '#ffffff';
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Center: Desktop Global Search Bar */}
        <div className="desktop-only" style={{ flex: 1, maxWidth: '640px' }}>
          <form
            onSubmit={handleSearchSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#F5F5F5',
              border: '1px solid #E5E5E5',
              borderRadius: '24px',
              padding: '4px 6px 4px 16px',
              transition: 'all 0.2s ease',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#026CDF')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#E5E5E5')}
          >
            {/* Search Input */}
            <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '8px' }}>
              <Search size={16} color="#6B6B6B" />
              <input
                type="text"
                placeholder="Search events, artists, venues"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  width: '100%',
                  fontSize: '13px',
                  color: '#1F1F1F',
                }}
              />
            </div>

            {/* Divider */}
            <div style={{ width: '1px', height: '22px', backgroundColor: '#E0E0E0', margin: '0 8px' }} />

            {/* City Selector */}
            <div ref={cityRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#4B4B4B',
                  cursor: 'pointer',
                  padding: '6px 8px',
                  borderRadius: '16px',
                }}
              >
                <MapPin size={13} color="#026CDF" />
                <span style={{ maxWidth: '85px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {selectedCity}
                </span>
                <ChevronDown size={12} color="#6B6B6B" />
              </button>

              {isCityDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '110%',
                    right: 0,
                    width: '180px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E5E5',
                    borderRadius: '10px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    zIndex: 1050,
                    padding: '6px 0',
                  }}
                >
                  {CITIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setSelectedCity(c);
                        setIsCityDropdownOpen(false);
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 14px',
                        background: selectedCity === c ? '#EBF3FD' : 'transparent',
                        border: 'none',
                        color: selectedCity === c ? '#026CDF' : '#1F1F1F',
                        fontSize: '13px',
                        fontWeight: selectedCity === c ? 600 : 400,
                        cursor: 'pointer',
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Divider */}
            <div style={{ width: '1px', height: '22px', backgroundColor: '#E0E0E0', margin: '0 8px' }} />

            {/* Date Selector */}
            <div ref={dateRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#4B4B4B',
                  cursor: 'pointer',
                  padding: '6px 8px',
                  borderRadius: '16px',
                }}
              >
                <Calendar size={13} color="#026CDF" />
                <span>{DATES.find((d) => d.value === selectedDate)?.label || 'All Dates'}</span>
                <ChevronDown size={12} color="#6B6B6B" />
              </button>

              {isDateDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '110%',
                    right: 0,
                    width: '160px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E5E5',
                    borderRadius: '10px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    zIndex: 1050,
                    padding: '6px 0',
                  }}
                >
                  {DATES.map((d) => (
                    <button
                      key={d.label}
                      type="button"
                      onClick={() => {
                        setSelectedDate(d.value);
                        setIsDateDropdownOpen(false);
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 14px',
                        background: selectedDate === d.value ? '#EBF3FD' : 'transparent',
                        border: 'none',
                        color: selectedDate === d.value ? '#026CDF' : '#1F1F1F',
                        fontSize: '13px',
                        fontWeight: selectedDate === d.value ? 600 : 400,
                        cursor: 'pointer',
                      }}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Submit Icon */}
            <button
              type="submit"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#026CDF',
                border: 'none',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                marginLeft: '6px',
                flexShrink: 0,
              }}
            >
              <Search size={14} />
            </button>
          </form>
        </div>

        {/* Right Section: Sell, Help, Sign In / Account Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Sell CTA (Desktop) */}
          <Link
            to="/resale"
            className="desktop-only"
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#fffafa',
              textDecoration: 'none',
              padding: '6px 10px',
            }}
          >
            Sell
          </Link>

          {/* Help Modal trigger */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="desktop-only"
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '14px',
              fontWeight: 600,
              color: '#ffffff',
              cursor: 'pointer',
              padding: '6px 10px',
            }}
          >
            Help
          </button>

          {/* Search Trigger for Mobile */}
          <button
            className="mobile-only"
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            aria-label="Open search"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              color: '#1F1F1F',
            }}
          >
            <Search size={20} />
          </button>

          {/* User Account / Sign In */}
          {user ? (
            <div ref={userMenuRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#F8F9FA',
                  border: '1px solid #E5E5E5',
                  borderRadius: '24px',
                  padding: '4px 10px 4px 6px',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: '#026CDF',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    fontWeight: 700,
                    overflow: 'hidden',
                  }}
                >
                  {user.avatar?.url ? (
                    <img src={user.avatar.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    (user.firstName?.[0] || 'U').toUpperCase()
                  )}
                </div>

                <span
                  className="desktop-only"
                  style={{ fontSize: '13px', fontWeight: 600, color: '#1F1F1F', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                >
                  {user.firstName || 'My Account'}
                </span>
                <ChevronDown size={13} color="#6B6B6B" />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '115%',
                    right: 0,
                    width: '260px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E5E5',
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                    zIndex: 1100,
                    overflow: 'hidden',
                  }}
                >
                  {/* Account Header */}
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid #F0F0F0', backgroundColor: '#FAFAFA' }}>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#1F1F1F' }}>
                      {user.firstName} {user.lastName}
                    </p>
                    <p style={{ margin: '2px 0 6px 0', fontSize: '12px', color: '#6B6B6B' }}>{user.email}</p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          padding: '3px 8px',
                          borderRadius: '12px',
                          backgroundColor: isApproved ? '#ECFDF5' : '#FFFBEB',
                          color: isApproved ? '#059669' : '#D97706',
                          border: `1px solid ${isApproved ? '#A7F3D0' : '#FDE68A'}`,
                        }}
                      >
                        {user.status}
                      </span>

                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#026CDF' }}>
                        ${(user.balance || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Nav Links */}
                  <div style={{ padding: '6px 0' }}>
                    <Link
                      to="/for-you"
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', fontSize: '13px', color: '#1F1F1F', textDecoration: 'none' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8F9FA')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <Sparkles size={16} color="#026CDF" /> For You Hub
                    </Link>

                    <Link
                      to="/tickets"
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', fontSize: '13px', color: '#1F1F1F', textDecoration: 'none' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8F9FA')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <Ticket size={16} color="#026CDF" /> My Tickets
                    </Link>

                    <Link
                      to="/transfers"
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', fontSize: '13px', color: '#1F1F1F', textDecoration: 'none' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8F9FA')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <Share2Icon size={16} color="#026CDF" /> Transfers
                    </Link>

                    <Link
                      to="/resale"
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', fontSize: '13px', color: '#1F1F1F', textDecoration: 'none' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8F9FA')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <DollarSign size={16} color="#D97706" /> Resale Marketplace
                    </Link>

                    <Link
                      to="/my-events"
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', fontSize: '13px', color: '#1F1F1F', textDecoration: 'none' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8F9FA')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <Calendar size={16} color="#026CDF" /> Organizer Dashboard
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', fontSize: '13px', color: '#026CDF', fontWeight: 600, textDecoration: 'none', backgroundColor: '#EFF6FF' }}
                      >
                        <Shield size={16} color="#026CDF" /> Admin Console
                      </Link>
                    )}

                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', fontSize: '13px', color: '#1F1F1F', textDecoration: 'none' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8F9FA')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <Settings size={16} color="#6B6B6B" /> My Account & Settings
                    </Link>
                  </div>

                  {/* Sign Out */}
                  <div style={{ borderTop: '1px solid #F0F0F0', padding: '6px 0' }}>
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 16px',
                        fontSize: '13px',
                        color: '#DC2626',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <LogOut size={16} color="#DC2626" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link to="/login" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>
                Register
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="mobile-only"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Open navigation menu"
            style={{
              background: 'transparent',
              border: 'none',
              padding: '6px',
              cursor: 'pointer',
              color: '#1F1F1F',
            }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Expandable Search Bar */}
      {isMobileSearchOpen && (
        <div style={{ padding: '12px 16px', backgroundColor: '#F8F9FA', borderTop: '1px solid #E5E5E5' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                border: '1px solid #D1D5DB',
                borderRadius: '8px',
                padding: '8px 12px',
                gap: '8px',
              }}
            >
              <Search size={16} color="#6B6B6B" />
              <input
                type="text"
                placeholder="Search events, artists, venues"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px' }}
                autoFocus
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="input"
                style={{ padding: '8px 10px', fontSize: '13px' }}
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input"
                style={{ padding: '8px 10px', fontSize: '13px' }}
              >
                {DATES.map((d) => (
                  <option key={d.label} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn-primary" style={{ padding: '10px', fontSize: '14px' }}>
              Search Tickets
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '70px',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#FFFFFF',
            zIndex: 999,
            padding: '20px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#8C8C8C', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Browse Categories
            </span>
            {[
              { label: 'Concerts', path: '/explore?category=Concerts' },
              { label: 'Sports', path: '/explore?category=Sports' },
              { label: 'Arts & Theater', path: '/explore?category=Arts%20%26%20Theater' },
              { label: 'Family', path: '/explore?category=Family' },
            ].map((cat) => (
              <Link
                key={cat.label}
                to={cat.path}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  padding: '12px 14px',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#1F1F1F',
                  textDecoration: 'none',
                  borderBottom: '1px solid #F0F0F0',
                }}
              >
                {cat.label}
              </Link>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#8C8C8C', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Marketplace & Features
            </span>
            <Link
              to="/for-you"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ padding: '10px 14px', fontSize: '14px', fontWeight: 600, color: '#026CDF', textDecoration: 'none' }}
            >
              For You Hub
            </Link>
            <Link
              to="/resale"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ padding: '10px 14px', fontSize: '14px', fontWeight: 600, color: '#1F1F1F', textDecoration: 'none' }}
            >
              Sell / Resale Marketplace
            </Link>
            <Link
              to="/scan"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ padding: '10px 14px', fontSize: '14px', fontWeight: 600, color: '#1F1F1F', textDecoration: 'none' }}
            >
              Staff QR Scanner
            </Link>
            <Link
              to="/my-events"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ padding: '10px 14px', fontSize: '14px', fontWeight: 600, color: '#1F1F1F', textDecoration: 'none' }}
            >
              Organizer Dashboard
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ padding: '10px 14px', fontSize: '14px', fontWeight: 700, color: '#026CDF', textDecoration: 'none' }}
              >
                Admin Console
              </Link>
            )}
          </div>

          {user ? (
            <button
              onClick={handleLogout}
              className="btn-secondary"
              style={{ marginTop: 'auto', padding: '12px', color: '#DC2626' }}
            >
              <LogOut size={16} /> Sign Out
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto' }}>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="btn-secondary">
                Sign In
              </Link>
              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary">
                Register
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Help & Support Modal */}
      {showHelpModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setShowHelpModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HelpCircle size={22} color="#026CDF" />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Ticketing Help Center</h3>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6B6B6B' }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px', color: '#4B4B4B' }}>
              <div>
                <p style={{ fontWeight: 700, color: '#1F1F1F', margin: '0 0 4px' }}>How do digital tickets work?</p>
                <p style={{ margin: 0 }}>Tickets are stored in your account under "My Tickets" with a secure, scan-ready QR code.</p>
              </div>

              <div>
                <p style={{ fontWeight: 700, color: '#1F1F1F', margin: '0 0 4px' }}>Why is my account pending?</p>
                <p style={{ margin: 0 }}>Newly registered users undergo review by administrators. Once approved, you can create events and transfer tickets.</p>
              </div>

              <div>
                <p style={{ fontWeight: 700, color: '#1F1F1F', margin: '0 0 4px' }}>Can I transfer or resell my tickets?</p>
                <p style={{ margin: 0 }}>Yes! Approved users can transfer tickets to friends by email/phone or list them on the verified Resale Marketplace.</p>
              </div>
            </div>

            <button
              className="btn-primary"
              style={{ width: '100%', marginTop: '20px', padding: '12px' }}
              onClick={() => setShowHelpModal(false)}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

function Share2Icon(props) {
  return (
    <svg width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none" stroke={props.color || "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3"></circle>
      <circle cx="6" cy="12" r="3"></circle>
      <circle cx="18" cy="19" r="3"></circle>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
    </svg>
  );
}
