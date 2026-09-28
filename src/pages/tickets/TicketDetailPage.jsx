import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout.jsx';
import TicketmasterSpinner from '../../components/ui/TicketmasterSpinner.jsx';
import DigitalTicket from '../../components/tickets/DigitalTicket.jsx';
import { TicketsIcon } from '../../components/tickets/TicketCard.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import api from '../../lib/axios.js';
import {
  ArrowLeft,
  ArrowUpRight,
  RefreshCw,
  MoreVertical,
  HelpCircle,
  X,
  MapPin,
  Send,
  DollarSign,
  ShieldCheck,
} from 'lucide-react';

/**
 * Barcode Scanner Icon matching Ticketmaster "View Tickets" button in Screenshot 2
 */
function BarcodeScanIcon({ size = 20, color = '#FFFFFF' }) {
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
      {/* Corner viewfinders */}
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      {/* Barcode lines */}
      <line x1="7" y1="8" x2="7" y2="16" />
      <line x1="10" y1="8" x2="10" y2="16" />
      <line x1="13" y1="8" x2="13" y2="16" />
      <line x1="17" y1="8" x2="17" y2="16" />
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
 * Date Badge formatter matching Screenshot 2: "Tue 18 Nov, 2025 @ 7:00 PM"
 */
const formatBadgeDate = (dateVal, timeVal) => {
  if (!dateVal) return 'Tue 18 Nov, 2025 @ 7:00 PM';
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return 'Tue 18 Nov, 2025 @ 7:00 PM';
  const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
  const day = d.getDate();
  const month = d.toLocaleDateString('en-US', { month: 'short' });
  const year = d.getFullYear();
  const time = timeVal || d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${dayName} ${day} ${month}, ${year} @ ${time}`;
};

export default function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [ticket, setTicket] = useState(null);
  const [allTickets, setAllTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tickets');

  // Modals
  const [activeDigitalTicket, setActiveDigitalTicket] = useState(null);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showResale, setShowResale] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Form states
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [transferring, setTransferring] = useState(false);

  const [resalePrice, setResalePrice] = useState('');
  const [listing, setListing] = useState(false);

  const isApproved =
    user?.status === 'APPROVED' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/tickets/${id}`);
      const ticketData = data.data || data;
      setTicket(ticketData);

      if (Array.isArray(ticketData.allEventTickets) && ticketData.allEventTickets.length > 0) {
        setAllTickets(ticketData.allEventTickets);
      } else {
        setAllTickets([ticketData]);
      }
    } catch (err) {
      console.error('Error loading ticket details:', err);
      toast.error('Ticket could not be loaded.');
      navigate('/tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    if (!recipientEmail.trim()) {
      toast.error('Recipient email is required.');
      return;
    }
    setTransferring(true);
    try {
      const targetTicket = activeDigitalTicket || ticket;
      await api.post('/transfers', {
        ticketId: targetTicket._id || targetTicket.id,
        recipientEmail: recipientEmail.trim(),
        recipientName: recipientName.trim(),
      });
      toast.success('Transfer invitation sent successfully!');
      setShowTransfer(false);
      setRecipientEmail('');
      setRecipientName('');
      fetchTicket();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Transfer failed.');
    } finally {
      setTransferring(false);
    }
  };

  const handleResaleSubmit = async (e) => {
    e.preventDefault();
    const price = parseFloat(resalePrice);
    if (isNaN(price) || price <= 0) {
      toast.error('Please enter a valid price.');
      return;
    }
    setListing(true);
    try {
      const targetTicket = activeDigitalTicket || ticket;
      await api.post('/resale', {
        ticketId: targetTicket._id || targetTicket.id,
        price,
      });
      toast.success('Ticket listed on the Resale Marketplace!');
      setShowResale(false);
      setResalePrice('');
      fetchTicket();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Listing failed.');
    } finally {
      setListing(false);
    }
  };

  if (loading) {
    return (
      <AppLayout hideHeader={true} hideFooter={true} hideBottomNav={true} bgColor="#000000">
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <TicketmasterSpinner size="lg" message="Loading ticket details..." />
        </div>
      </AppLayout>
    );
  }

  if (!ticket) return null;

  const event = ticket.eventId || {};
  const ticketType = ticket.ticketTypeId || {};

  const title = event.title || 'MICO - INTERNET HOMETOWN HERO WORLD TOUR';
  const venue = event.venue || 'Moby Dick Club';
  const address = event.address ? `, ${event.address}` : ', Madrid';
  const fullVenue = `${venue}${address}`;

  const dateBadge = formatBadgeDate(event.startDate, event.startTime);

  const imageUrl = resolveImageUrl(
    event.coverImage?.url || event.coverImage || event.bannerImage || event.coverImageUrl
  );

  const ticketsCount = allTickets.length > 0 ? allTickets.length : 1;

  return (
    <AppLayout hideHeader={true} hideFooter={true} hideBottomNav={true} bgColor="#FFFFFF">
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          margin: '0 auto',
          minHeight: '100vh',
          backgroundColor: '#FFFFFF',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 0 40px rgba(0,0,0,0.08)',
        }}
      >
        {/* ================= HERO SECTION ================= */}
        <div style={{ position: 'relative', width: '100%' }}>
          {/* Background Poster Image */}
          <div
            style={{
              width: '100%',
              height: '260px',
              backgroundColor: '#1E1E1E',
              position: 'relative',
              overflow: 'hidden',
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

            {/* Gradient Overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.6) 100%)',
              }}
            />

            {/* Floating Top Header Controls */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                padding: '16px 18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 10,
              }}
            >
              {/* Back Circular Button */}
              <button
                onClick={() => navigate('/tickets')}
                aria-label="Back to tickets"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <ArrowLeft size={20} />
              </button>

              {/* Help Pill Button */}
              <button
                onClick={() => setShowHelp(true)}
                style={{
                  padding: '6px 16px',
                  borderRadius: '20px',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  backdropFilter: 'blur(8px)',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                }}
              >
                Help
              </button>
            </div>
          </div>

          {/* Dark Hero Event Card sitting directly over/below the artwork */}
          <div
            style={{
              backgroundColor: '#121212',
              padding: '16px 16px 18px',
              color: '#FFFFFF',
            }}
          >
            {/* Date Badge */}
            <div
              style={{
                display: 'inline-block',
                backgroundColor: '#202020',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '4px',
                padding: '4px 10px',
                fontSize: '12px',
                fontWeight: 700,
                color: '#FFFFFF',
                marginBottom: '10px',
                letterSpacing: '0.01em',
              }}
            >
              {dateBadge}
            </div>

            {/* Event Title */}
            <h1
              style={{
                fontSize: '19px',
                fontWeight: 800,
                textTransform: 'uppercase',
                color: '#FFFFFF',
                lineHeight: 1.25,
                margin: '0 0 10px 0',
                letterSpacing: '0.01em',
              }}
            >
              {title}
            </h1>

            {/* Venue & Tickets Count Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: '13px',
                  color: '#D1D5DB',
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: 'calc(100% - 60px)',
                }}
              >
                {fullVenue}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                <TicketsIcon size={17} color="#FFFFFF" />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
                  x{ticketsCount}
                </span>
              </div>
            </div>

            {/* Blue "View Tickets" Button */}
            <button
              onClick={() => setActiveDigitalTicket(allTickets[0] || ticket)}
              style={{
                width: '100%',
                backgroundColor: '#026CDF',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '4px',
                padding: '13px 16px',
                fontSize: '15px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0050A8')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#026CDF')}
            >
              <BarcodeScanIcon size={20} color="#FFFFFF" />
              <span>View Tickets</span>
            </button>
          </div>
        </div>

        {/* ================= TABS: Tickets | Extras ================= */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #E5E7EB',
          }}
        >
          <button
            onClick={() => setActiveTab('tickets')}
            style={{
              flex: 1,
              padding: '14px 0',
              background: 'none',
              border: 'none',
              fontSize: '14px',
              fontWeight: 800,
              color: activeTab === 'tickets' ? '#000000' : '#8E8E93',
              borderBottom: activeTab === 'tickets' ? '3px solid #000000' : '3px solid transparent',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.15s ease',
            }}
          >
            Tickets
          </button>

          <button
            onClick={() => setActiveTab('extras')}
            style={{
              flex: 1,
              padding: '14px 0',
              background: 'none',
              border: 'none',
              fontSize: '14px',
              fontWeight: 600,
              color: activeTab === 'extras' ? '#000000' : '#8E8E93',
              borderBottom: activeTab === 'extras' ? '3px solid #000000' : '3px solid transparent',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.15s ease',
            }}
          >
            Extras
          </button>
        </div>

        {/* ================= MAIN CONTENT AREA ================= */}
        <div style={{ padding: '16px 16px 120px', flex: 1, backgroundColor: '#FFFFFF' }}>
          {activeTab === 'tickets' ? (
            <>
              {/* Header Row: x3 Tickets & Menu */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#6B7280' }}>
                  x{ticketsCount} Tickets
                </span>

                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    aria-label="Options"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      color: '#6B7280',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <MoreVertical size={18} />
                  </button>

                  {/* Kebab Dropdown Menu */}
                  {showMenu && (
                    <div
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: '100%',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                        zIndex: 200,
                        width: '180px',
                        overflow: 'hidden',
                      }}
                    >
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          setShowTransfer(true);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '10px 14px',
                          border: 'none',
                          background: 'none',
                          fontSize: '13px',
                          fontWeight: 600,
                          color: '#111827',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <ArrowUpRight size={15} color="#026CDF" /> Transfer Tickets
                      </button>

                      <button
                        onClick={() => {
                          setShowMenu(false);
                          setShowResale(true);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '10px 14px',
                          border: 'none',
                          background: 'none',
                          fontSize: '13px',
                          fontWeight: 600,
                          color: '#111827',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <RefreshCw size={14} color="#EA580C" /> Sell Tickets
                      </button>

                      <button
                        onClick={() => {
                          setShowMenu(false);
                          setShowHelp(true);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '10px 14px',
                          borderTop: '1px solid #F3F4F6',
                          borderBottom: 'none',
                          borderLeft: 'none',
                          borderRight: 'none',
                          background: 'none',
                          fontSize: '13px',
                          color: '#6B7280',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <HelpCircle size={14} /> Help & FAQ
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Individual Ticket Cards List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {allTickets.map((t, index) => {
                  const secDisplay =
                    t.sectionDisplay ||
                    t.section ||
                    `GA${index + 1}`;
                  const tierName =
                    t.ticketTypeId?.name ||
                    (t.section?.toLowerCase().includes('ga') || secDisplay.startsWith('GA')
                      ? 'General admission'
                      : 'Reserved Seating');
                  const rightLabel =
                    t.ticketTypeId?.name?.toUpperCase() ||
                    'GENERAL ADMISSION';

                  return (
                    <div
                      key={t._id || t.id || index}
                      onClick={() => setActiveDigitalTicket(t)}
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E5E7EB',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)';
                      }}
                    >
                      {/* Top Header Strip */}
                      <div
                        style={{
                          backgroundColor: '#F3F4F6',
                          padding: '10px 16px',
                          borderBottom: '1px solid #E5E7EB',
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: '14px',
                            fontWeight: 700,
                            color: '#111827',
                          }}
                        >
                          {tierName}
                        </p>
                      </div>

                      {/* Bottom Section: SECTION / GA1 / GENERAL ADMISSION */}
                      <div
                        style={{
                          padding: '12px 16px 14px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-end',
                          backgroundColor: '#FFFFFF',
                        }}
                      >
                        <div>
                          <span
                            style={{
                              display: 'block',
                              fontSize: '11px',
                              fontWeight: 700,
                              color: '#6B7280',
                              letterSpacing: '0.05em',
                              textTransform: 'uppercase',
                              marginBottom: '2px',
                            }}
                          >
                            SECTION
                          </span>
                          <span
                            style={{
                              display: 'block',
                              fontSize: '20px',
                              fontWeight: 900,
                              color: '#000000',
                              lineHeight: 1.1,
                            }}
                          >
                            {secDisplay}
                          </span>
                        </div>

                        <span
                          style={{
                            fontSize: '13px',
                            fontWeight: 700,
                            color: '#111827',
                            textTransform: 'uppercase',
                            letterSpacing: '0.02em',
                          }}
                        >
                          {rightLabel}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* MORE OPTIONS Section */}
              <div style={{ marginTop: '28px' }}>
                <h3
                  style={{
                    fontSize: '13px',
                    fontWeight: 800,
                    color: '#111827',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    margin: '0 0 12px 0',
                  }}
                >
                  MORE OPTIONS
                </h3>

                {/* Venue / Location Information Card */}
                <div
                  style={{
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  }}
                >
                  <div
                    style={{
                      height: '110px',
                      backgroundColor: '#F3F4F6',
                      backgroundImage:
                        'url(https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&auto=format&fit=crop&q=80)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.25)',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '13px',
                        textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                      }}
                    >
                      <MapPin size={16} /> Venue & Seating Map
                    </div>
                  </div>

                  <div style={{ padding: '14px 16px' }}>
                    <p style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: 700, color: '#111827' }}>
                      {venue}
                    </p>
                    <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#6B7280' }}>
                      {address ? address.replace(/^,\s*/, '') : 'Madrid, Spain'}
                    </p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${venue} ${address}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#026CDF',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      Get Directions ↗
                    </a>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Extras Tab Content */
            <div style={{ textAlign: 'center', padding: '40px 16px', color: '#6B7280' }}>
              <p style={{ fontSize: '15px', fontWeight: 600, color: '#111827', marginBottom: '6px' }}>
                No Extras Available
              </p>
              <p style={{ fontSize: '13px', margin: 0 }}>
                Parking passes, VIP lounge upgrades, and merchandise add-ons will appear here when available.
              </p>
            </div>
          )}
        </div>

        {/* ================= FLOATING ACTION PILL (Transfer | Sell) ================= */}
        <div
          style={{
            position: 'fixed',
            bottom: '26px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: '9999px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.06)',
            border: '1px solid #E5E7EB',
            overflow: 'hidden',
          }}
        >
          {/* Transfer Button */}
          <button
            onClick={() => {
              if (!isApproved) {
                toast.error('Account approval required to transfer tickets.');
                return;
              }
              setShowTransfer(true);
            }}
            style={{
              padding: '12px 28px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <ArrowUpRight size={18} color="#000000" strokeWidth={2.5} />
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#000000' }}>Transfer</span>
          </button>

          {/* Divider */}
          <div style={{ width: '1px', height: '30px', backgroundColor: '#E5E7EB' }} />

          {/* Sell Button */}
          <button
            onClick={() => {
              if (!isApproved) {
                toast.error('Account approval required to resell tickets.');
                return;
              }
              setShowResale(true);
            }}
            style={{
              padding: '12px 28px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <RefreshCw size={17} color="#6B7280" strokeWidth={2.2} />
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#6B7280' }}>Sell</span>
          </button>
        </div>

        {/* ================= DIGITAL TICKET MODAL ================= */}
        {activeDigitalTicket && (
          <DigitalTicket
            ticket={activeDigitalTicket}
            onClose={() => setActiveDigitalTicket(null)}
            onTransfer={(t) => {
              setActiveDigitalTicket(null);
              setShowTransfer(true);
            }}
            onResale={(t) => {
              setActiveDigitalTicket(null);
              setShowResale(true);
            }}
            canTransfer={isApproved}
            canResell={isApproved}
          />
        )}

        {/* ================= TRANSFER MODAL ================= */}
        {showTransfer && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(4px)',
              zIndex: 3000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
            onClick={() => setShowTransfer(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '24px',
                maxWidth: '440px',
                width: '100%',
                boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Send size={20} color="#026CDF" />
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Transfer Tickets</h3>
                </div>
                <button
                  onClick={() => setShowTransfer(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '22px',
                    cursor: 'pointer',
                    color: '#6B7280',
                  }}
                >
                  ×
                </button>
              </div>

              <p style={{ fontSize: '13px', color: '#6B6B6B', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                Safely transfer ticket to a friend or family member. They will receive an email invitation to accept.
              </p>

              <form onSubmit={handleTransferSubmit}>
                <div style={{ marginBottom: '14px' }}>
                  <label className="input-label">Recipient Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Alex Smith"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="input"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label className="input-label">Recipient Email Address *</label>
                  <input
                    type="email"
                    placeholder="friend@example.com"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="input"
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ flex: 1 }}
                    onClick={() => setShowTransfer(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={transferring}
                    className="btn-primary"
                    style={{ flex: 2 }}
                  >
                    {transferring ? 'Sending...' : 'Send Transfer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= RESALE MODAL ================= */}
        {showResale && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(4px)',
              zIndex: 3000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
            onClick={() => setShowResale(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '24px',
                maxWidth: '440px',
                width: '100%',
                boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <DollarSign size={20} color="#EA580C" />
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>List on Resale Marketplace</h3>
                </div>
                <button
                  onClick={() => setShowResale(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '22px',
                    cursor: 'pointer',
                    color: '#6B7280',
                  }}
                >
                  ×
                </button>
              </div>

              <p style={{ fontSize: '13px', color: '#6B6B6B', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                List your ticket on Ticketmaster's verified exchange. Once sold, proceeds are credited to your balance.
              </p>

              <form onSubmit={handleResaleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label className="input-label">Asking Price ($) *</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="e.g. 85"
                    value={resalePrice}
                    onChange={(e) => setResalePrice(e.target.value)}
                    className="input"
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ flex: 1 }}
                    onClick={() => setShowResale(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={listing}
                    className="btn-primary"
                    style={{ flex: 2, backgroundColor: '#EA580C' }}
                  >
                    {listing ? 'Listing...' : 'Confirm Resale'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= HELP MODAL ================= */}
        {showHelp && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(4px)',
              zIndex: 3000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
            onClick={() => setShowHelp(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '24px',
                maxWidth: '420px',
                width: '100%',
                boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HelpCircle size={22} color="#026CDF" />
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Ticket Support</h3>
                </div>
                <button
                  onClick={() => setShowHelp(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '22px',
                    cursor: 'pointer',
                    color: '#6B7280',
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#4B4B4B' }}>
                <div style={{ padding: '12px', backgroundColor: '#F8F9FA', borderRadius: '8px' }}>
                  <p style={{ margin: '0 0 4px', fontWeight: 700, color: '#111827' }}>How do I enter the venue?</p>
                  <p style={{ margin: 0 }}>Tap "View Tickets" or any ticket to show the live SafeTix rotating barcode at the turnstiles.</p>
                </div>

                <div style={{ padding: '12px', backgroundColor: '#F8F9FA', borderRadius: '8px' }}>
                  <p style={{ margin: '0 0 4px', fontWeight: 700, color: '#111827' }}>Can I transfer to a friend?</p>
                  <p style={{ margin: 0 }}>Yes! Use the floating Transfer button at the bottom to send via email.</p>
                </div>

                <div style={{ padding: '12px', backgroundColor: '#F8F9FA', borderRadius: '8px' }}>
                  <p style={{ margin: '0 0 4px', fontWeight: 700, color: '#111827' }}>Can I sell my ticket?</p>
                  <p style={{ margin: 0 }}>Tap Sell to list on the verified exchange and get paid directly to your balance.</p>
                </div>
              </div>

              <button
                onClick={() => setShowHelp(false)}
                className="btn-primary"
                style={{ width: '100%', marginTop: '20px', padding: '12px' }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
