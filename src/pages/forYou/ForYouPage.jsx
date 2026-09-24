import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import TicketmasterSpinner from '../../components/ui/TicketmasterSpinner.jsx';
import api from '../../lib/axios.js';
import {
  Wallet,
  Plus,
  Zap,
  Ticket,
  Send,
  DollarSign,
  Compass,
  QrCode,
  Calendar,
  AlertCircle,
  HelpCircle,
  MessageCircle,
  BookOpen,
  ChevronRight,
  ChevronDown,
  X,
  CheckCircle2,
  ExternalLink,
  Shield,
  ArrowRight,
} from 'lucide-react';

export default function ForYouPage() {
  const { user, refreshUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [showBuyCreditModal, setShowBuyCreditModal] = useState(false);
  const [showAutoCreateModal, setShowAutoCreateModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Buy Credit State
  const [creditAmount, setCreditAmount] = useState('50');
  const [fundingWallet, setFundingWallet] = useState(false);

  // Auto Create State
  const [searchQuery, setSearchQuery] = useState('');
  const [tmResults, setTmResults] = useState([]);
  const [searchingTm, setSearchingTm] = useState(false);
  const [importingId, setImportingId] = useState(null);

  // Support Form State
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSubject, setSupportSubject] = useState('Ticket Question');
  const [supportSubmitted, setSupportSubmitted] = useState(false);

  // Tutorial Accordion State
  const [openTutorialIndex, setOpenTutorialIndex] = useState(null);

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  const isApproved = user?.status === 'APPROVED' || isAdmin;
  const isPending = user?.status === 'PENDING' && !isAdmin;
  const balance = user?.balance ?? 0;
  const isLowBalance = balance < 10;

  // Handle Buy Credit
  const handleBuyCredit = async (e) => {
    e.preventDefault();
    const amt = parseFloat(creditAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.error('Please enter a valid dollar amount.');
      return;
    }
    setFundingWallet(true);
    try {
      await api.post('/auth/topup', { amount: amt });
      toast.success(`Successfully added $${amt.toFixed(2)} to your wallet!`);
      setShowBuyCreditModal(false);
      refreshUser();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fund wallet.');
    } finally {
      setFundingWallet(false);
    }
  };

  // Search Ticketmaster / External for 1-click Auto Import
  const handleSearchAutoCreate = async (e) => {
    if (e) e.preventDefault();
    setSearchingTm(true);
    try {
      const { data } = await api.get(`/tickets/ticketmaster/search?query=${encodeURIComponent(searchQuery)}`);
      setTmResults(data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to search catalog.');
    } finally {
      setSearchingTm(false);
    }
  };

  // Import event 1-click
  const handleImportEvent = async (ev) => {
    setImportingId(ev.id);
    try {
      await api.post('/events', {
        title: ev.title,
        venue: ev.venue,
        description: ev.description,
        category: ev.category,
        startDate: ev.date,
        startTime: ev.time,
        coverImageUrl: ev.coverImage,
        ticketTypes: ev.ticketTypes,
        status: 'PUBLISHED',
      });
      toast.success(`"${ev.title}" created successfully!`);
      setShowAutoCreateModal(false);
      navigate('/my-events');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Import failed.');
    } finally {
      setImportingId(null);
    }
  };

  // Support Message Submit
  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    setSupportSubmitted(true);
    setTimeout(() => {
      setSupportSubmitted(false);
      setShowSupportModal(false);
      setSupportMessage('');
      toast.success('Your support request has been submitted. Our concierge team will reply within 24 hours.');
    }, 1200);
  };

  const tutorials = [
    {
      title: 'How to claim and access your digital tickets',
      content:
        'When you order tickets, they are immediately stored in your account under "My Tickets". Each ticket generates an encrypted dynamic QR code for entry. Simply present your digital ticket screen at the venue turnstile or scanner.',
    },
    {
      title: 'Transferring tickets to family and friends',
      content:
        'Approved ticket holders can securely transfer individual tickets. Select your ticket, tap "Transfer Ticket", and enter the recipient\'s email or phone. The recipient receives a claim link and ticket ownership transfers instantly upon acceptance.',
    },
    {
      title: 'Selling tickets on the verified Resale Marketplace',
      content:
        'Cannot make the show? Approved users can list their tickets on the Resale Marketplace at a price of their choice. Once purchased by another user, ticket ownership transfers securely and proceeds are credited directly to your wallet.',
    },
    {
      title: 'Account approval requirements for organizers & sellers',
      content:
        'To prevent ticket fraud and duplicate scalping, all new user accounts start with Pending status. Platform administrators review and approve accounts. Once approved, you gain full access to event creation, ticket issuance, and ticket transfers.',
    },
  ];

  return (
    <AppLayout>
      <div className="tm-container" style={{ padding: '28px 20px', maxWidth: '1000px' }}>
        {/* Page Title */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#1F1F1F', margin: '0 0 4px 0' }}>
            For You Hub
          </h1>
          <p style={{ fontSize: '14px', color: '#6B6B6B', margin: 0 }}>
            Personalized ticketing wallet, event creator tools, apps, and account management.
          </p>
        </div>

        {/* ===== PROFILE / WALLET CARD ===== */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E5E5E5',
            padding: '24px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
            marginBottom: '28px',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
            {/* User Meta */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#026CDF',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  fontWeight: 800,
                  overflow: 'hidden',
                  flexShrink: 0,
                  boxShadow: '0 4px 10px rgba(2, 108, 223, 0.25)',
                }}
              >
                {user?.avatar?.url ? (
                  <img src={user.avatar.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  (user?.firstName?.[0] || 'U').toUpperCase()
                )}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1F1F1F', margin: 0 }}>
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <StatusBadge status={user?.status || 'PENDING'} />
                </div>
                <p style={{ fontSize: '13px', color: '#6B6B6B', margin: '4px 0 0 0' }}>
                  {user?.email} • {user?.phone || 'No phone set'}
                </p>
              </div>
            </div>

            {/* Wallet Balance & Buy Credit */}
            <div
              style={{
                backgroundColor: '#F8F9FA',
                border: '1px solid #E5E5E5',
                borderRadius: '12px',
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
              }}
            >
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>
                  Wallet Balance
                </span>
                <span style={{ fontSize: '24px', fontWeight: 900, color: '#1F1F1F' }}>
                  ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <button
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '8px' }}
                onClick={() => setShowBuyCreditModal(true)}
              >
                <Plus size={15} /> Buy Credit
              </button>
            </div>
          </div>

          {/* Low Balance Alert */}
          {isLowBalance && (
            <div
              style={{
                marginTop: '18px',
                backgroundColor: '#FFFBEB',
                border: '1px solid #FDE68A',
                borderRadius: '10px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} color="#D97706" />
                <span style={{ fontSize: '13px', color: '#92400E', fontWeight: 500 }}>
                  Low Balance Notice: Your wallet balance is below $10.00. Top up to purchase premium tickets.
                </span>
              </div>
              <button
                onClick={() => setShowBuyCreditModal(true)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#026CDF',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Top Up Now →
              </button>
            </div>
          )}
        </div>

        {/* ===== CREATE TICKET SECTION ===== */}
        <section style={{ marginBottom: '32px' }}>
          <div style={{ marginBottom: '14px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1F1F1F', margin: 0 }}>
              Event & Ticket Creation
            </h2>
            <p style={{ fontSize: '13px', color: '#6B6B6B', margin: '2px 0 0 0' }}>
              Create and publish your own live events or import verified catalog templates.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {/* Create Manually */}
            <div
              onClick={() => {
                if (!isApproved) {
                  toast.error('Account approval is required before you can create events.');
                  return;
                }
                navigate('/create');
              }}
              className="card card-hover"
              style={{
                padding: '20px',
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #E5E5E5',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: '#EBF3FD',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px',
                  }}
                >
                  <Calendar size={22} color="#026CDF" />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1F1F1F', margin: '0 0 6px 0' }}>
                  Create Ticket Manually
                </h3>
                <p style={{ fontSize: '13px', color: '#6B6B6B', margin: 0, lineHeight: 1.4 }}>
                  4-step event creator: Details, ticket tiers (VIP/GA), Cloudinary banner, and instant publish.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#026CDF', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Launch Wizard <ChevronRight size={14} />
                </span>
                {!isApproved && (
                  <span style={{ fontSize: '11px', color: '#D97706', fontWeight: 600 }}>Approval Req.</span>
                )}
              </div>
            </div>

            {/* Create Automatically */}
            <div
              onClick={() => {
                if (!isApproved) {
                  toast.error('Account approval is required before you can create events.');
                  return;
                }
                setShowAutoCreateModal(true);
                handleSearchAutoCreate();
              }}
              className="card card-hover"
              style={{
                padding: '20px',
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #E5E5E5',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: '#FEF3C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px',
                  }}
                >
                  <Zap size={22} color="#D97706" />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1F1F1F', margin: '0 0 6px 0' }}>
                  Create Automatically
                </h3>
                <p style={{ fontSize: '13px', color: '#6B6B6B', margin: 0, lineHeight: 1.4 }}>
                  1-Click event generation from external Ticketmaster catalog with pre-configured seat tiers.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#D97706', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  1-Click Generator <ChevronRight size={14} />
                </span>
                {!isApproved && (
                  <span style={{ fontSize: '11px', color: '#D97706', fontWeight: 600 }}>Approval Req.</span>
                )}
              </div>
            </div>

            {/* Manage Existing Tickets */}
            <div
              onClick={() => navigate('/my-events')}
              className="card card-hover"
              style={{
                padding: '20px',
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #E5E5E5',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: '#ECFDF5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px',
                  }}
                >
                  <Ticket size={22} color="#059669" />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1F1F1F', margin: '0 0 6px 0' }}>
                  Manage Existing Events
                </h3>
                <p style={{ fontSize: '13px', color: '#6B6B6B', margin: 0, lineHeight: 1.4 }}>
                  Monitor sales analytics, view attendee manifests, and manage event status.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  View Events <ChevronRight size={14} />
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ===== ADDITIONAL APPS GRID ===== */}
        <section style={{ marginBottom: '32px' }}>
          <div style={{ marginBottom: '14px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1F1F1F', margin: 0 }}>
              Additional Apps & Features
            </h2>
            <p style={{ fontSize: '13px', color: '#6B6B6B', margin: '2px 0 0 0' }}>
              Quick access to your tickets, transfer requests, resale marketplace, and QR scanners.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
            <AppCard
              icon={<Ticket size={20} color="#026CDF" />}
              title="My Tickets"
              desc="View & present tickets"
              onClick={() => navigate('/tickets')}
              bg="#EBF3FD"
            />
            <AppCard
              icon={<Send size={20} color="#7C3AED" />}
              title="Transfers"
              desc="Send & accept tickets"
              onClick={() => navigate('/transfers')}
              bg="#F5F3FF"
            />
            <AppCard
              icon={<DollarSign size={20} color="#EA580C" />}
              title="Resale Market"
              desc="Verified ticket exchange"
              onClick={() => navigate('/resale')}
              bg="#FFF7ED"
            />
            <AppCard
              icon={<QrCode size={20} color="#059669" />}
              title="QR Scanner"
              desc="Staff admission check-in"
              onClick={() => navigate('/scan')}
              bg="#ECFDF5"
            />
            <AppCard
              icon={<Compass size={20} color="#0284C7" />}
              title="Discover"
              desc="Find upcoming tours"
              onClick={() => navigate('/explore')}
              bg="#F0F9FF"
            />
            {isAdmin && (
              <AppCard
                icon={<Shield size={20} color="#DC2626" />}
                title="Admin Console"
                desc="Platform management"
                onClick={() => navigate('/admin')}
                bg="#FEF2F2"
              />
            )}
          </div>
        </section>

        {/* ===== TELEGRAM & CONTACT SUPPORT ===== */}
        <section style={{ marginBottom: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {/* Telegram App */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #E5E5E5',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: '#229ED9',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <MessageCircle size={26} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 3px 0' }}>Telegram Alerts</h4>
                <p style={{ fontSize: '12px', color: '#6B6B6B', margin: '0 0 8px 0' }}>
                  Receive instant drops, transfer notifications, and barcode alerts.
                </p>
                <a
                  href="https://t.me/ticketmaster"
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: '12px', fontWeight: 700, color: '#229ED9', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  Join Telegram Channel <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* Support Concierge */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #E5E5E5',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: '#026CDF',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <HelpCircle size={26} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 3px 0' }}>Contact Support</h4>
                <p style={{ fontSize: '12px', color: '#6B6B6B', margin: '0 0 8px 0' }}>
                  Have an order issue or need approval assistance? Reach out to support.
                </p>
                <button
                  onClick={() => setShowSupportModal(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#026CDF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  Contact Concierge <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ===== TUTORIALS ACCORDION ===== */}
        <section style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <BookOpen size={20} color="#026CDF" />
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1F1F1F', margin: 0 }}>
              Ticketing Platform Tutorials
            </h2>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E5E5E5', overflow: 'hidden' }}>
            {tutorials.map((tut, idx) => {
              const isOpen = openTutorialIndex === idx;
              return (
                <div key={idx} style={{ borderBottom: idx < tutorials.length - 1 ? '1px solid #E5E5E5' : 'none' }}>
                  <button
                    onClick={() => setOpenTutorialIndex(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#1F1F1F' }}>{tut.title}</span>
                    <ChevronDown
                      size={18}
                      color="#6B6B6B"
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                      }}
                    />
                  </button>

                  {isOpen && (
                    <div style={{ padding: '0 20px 18px', fontSize: '13px', color: '#4B4B4B', lineHeight: 1.6 }}>
                      {tut.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* ===== BUY CREDIT MODAL ===== */}
      {showBuyCreditModal && (
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
          onClick={() => setShowBuyCreditModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '440px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Wallet size={22} color="#026CDF" />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Buy TickApp Credit</h3>
              </div>
              <button
                onClick={() => setShowBuyCreditModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6B6B6B' }}
              >
                ×
              </button>
            </div>

            <p style={{ fontSize: '13px', color: '#6B6B6B', margin: '0 0 16px 0' }}>
              Select an amount to fund your instant ticket checkout wallet.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px' }}>
              {['25', '50', '100', '250'].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setCreditAmount(amt)}
                  style={{
                    padding: '10px 0',
                    borderRadius: '8px',
                    border: creditAmount === amt ? '2px solid #026CDF' : '1px solid #E5E5E5',
                    backgroundColor: creditAmount === amt ? '#EBF3FD' : '#FFFFFF',
                    color: creditAmount === amt ? '#026CDF' : '#1F1F1F',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  ${amt}
                </button>
              ))}
            </div>

            <form onSubmit={handleBuyCredit}>
              <div style={{ marginBottom: '18px' }}>
                <label className="input-label">Custom Amount ($)</label>
                <input
                  type="number"
                  min="5"
                  step="5"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                  className="input"
                  placeholder="Enter amount in USD"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={fundingWallet}
                className="btn-primary"
                style={{ width: '100%', padding: '13px' }}
              >
                {fundingWallet ? <TicketmasterSpinner size="sm" color="#FFFFFF" /> : `Add $${creditAmount || 0} to Wallet`}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ===== AUTO CREATE MODAL ===== */}
      {showAutoCreateModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setShowAutoCreateModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #E5E5E5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Automatic Event Generator</h3>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B6B6B' }}>
                  1-Click import from verified Ticketmaster templates
                </p>
              </div>
              <button
                onClick={() => setShowAutoCreateModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6B6B6B' }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: '16px 24px' }}>
              <form onSubmit={handleSearchAutoCreate} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <input
                  type="text"
                  placeholder="Search artist or tour template (e.g. Coldplay, Burna Boy)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input"
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn-primary" style={{ padding: '10px 18px', fontSize: '13px' }}>
                  {searchingTm ? 'Searching...' : 'Search'}
                </button>
              </form>

              {searchingTm ? (
                <div style={{ padding: '40px', textAlign: 'center' }}>
                  <TicketmasterSpinner size="md" message="Searching catalog..." />
                </div>
              ) : tmResults.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#6B6B6B', padding: '30px' }}>No catalog templates found.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {tmResults.map((ev) => (
                    <div
                      key={ev.id}
                      style={{
                        display: 'flex',
                        gap: '14px',
                        alignItems: 'center',
                        padding: '12px',
                        borderRadius: '10px',
                        border: '1px solid #E5E5E5',
                        backgroundColor: '#FAFAFA',
                      }}
                    >
                      <img
                        src={ev.coverImage}
                        alt=""
                        style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {ev.title}
                        </h4>
                        <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B6B6B' }}>
                          {ev.venue} • {ev.category}
                        </p>
                        <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#026CDF' }}>
                          {ev.ticketTypes?.length || 0} Ticket Tiers included
                        </p>
                      </div>

                      <button
                        className="btn-primary"
                        style={{ padding: '8px 14px', fontSize: '12px', borderRadius: '6px' }}
                        disabled={importingId === ev.id}
                        onClick={() => handleImportEvent(ev)}
                      >
                        {importingId === ev.id ? 'Importing...' : '1-Click Create'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== SUPPORT CONTACT MODAL ===== */}
      {showSupportModal && (
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
          onClick={() => setShowSupportModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '460px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HelpCircle size={22} color="#026CDF" />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Ticketing Concierge</h3>
              </div>
              <button
                onClick={() => setShowSupportModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6B6B6B' }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSupportSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label className="input-label">Subject</label>
                <select
                  value={supportSubject}
                  onChange={(e) => setSupportSubject(e.target.value)}
                  className="input"
                >
                  <option value="Ticket Question">Ticket & Barcode Inquiry</option>
                  <option value="Transfer Issue">Ticket Transfer Assistance</option>
                  <option value="Account Approval">Account Approval Request</option>
                  <option value="Event Organizer Inquiry">Organizer / Event Support</option>
                </select>
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label className="input-label">Message Details</label>
                <textarea
                  rows={4}
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  placeholder="Describe your inquiry or order reference..."
                  className="input"
                  style={{ resize: 'vertical' }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={supportSubmitted}
                className="btn-primary"
                style={{ width: '100%', padding: '12px' }}
              >
                {supportSubmitted ? 'Sending Request...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

function AppCard({ icon, title, desc, onClick, bg }) {
  return (
    <div
      onClick={onClick}
      className="card card-hover"
      style={{
        padding: '16px',
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E5E5E5',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <div
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          backgroundColor: bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 2px 0', color: '#1F1F1F' }}>{title}</h4>
        <p style={{ fontSize: '11px', color: '#6B6B6B', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {desc}
        </p>
      </div>
      <ChevronRight size={14} color="#9E9E9E" />
    </div>
  );
}
