import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout.jsx';
import TicketCard from '../../components/tickets/TicketCard.jsx';
import TicketmasterSpinner from '../../components/ui/TicketmasterSpinner.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../lib/axios.js';
import { Ticket, ArrowRight, HelpCircle, X, ExternalLink, ShieldCheck } from 'lucide-react';

/**
 * Circular Flag Icon matching screenshot 1
 */
function CountryFlagCircle({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{
        borderRadius: '50%',
        flexShrink: 0,
        overflow: 'hidden',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.2)',
      }}
    >
      <rect x="0" y="0" width="8" height="24" fill="#169B62" />
      <rect x="8" y="0" width="8" height="24" fill="#FFFFFF" />
      <rect x="16" y="0" width="8" height="24" fill="#FF883E" />
    </svg>
  );
}

export default function MyTicketsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('upcoming');
  const [upcomingTickets, setUpcomingTickets] = useState([]);
  const [pastTickets, setPastTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHelpModal, setShowHelpModal] = useState(false);

  useEffect(() => {
    fetchAllTickets();
  }, []);

  const fetchAllTickets = async () => {
    setLoading(true);
    try {
      // Fetch both upcoming and past tickets to display accurate tab counts
      const [upRes, pastRes] = await Promise.allSettled([
        api.get('/tickets/my-tickets?filter=upcoming'),
        api.get('/tickets/my-tickets?filter=past'),
      ]);

      const upData =
        upRes.status === 'fulfilled'
          ? Array.isArray(upRes.value?.data?.data)
            ? upRes.value.data.data
            : Array.isArray(upRes.value?.data)
            ? upRes.value.data
            : []
          : [];

      const pastData =
        pastRes.status === 'fulfilled'
          ? Array.isArray(pastRes.value?.data?.data)
            ? pastRes.value.data.data
            : Array.isArray(pastRes.value?.data)
            ? pastRes.value.data
            : []
          : [];

      setUpcomingTickets(upData);
      setPastTickets(pastData);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setUpcomingTickets([]);
      setPastTickets([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Group tickets by event so that multiple tickets for the same event
   * display as a single card with the ticket count (e.g. x3)
   */
  const groupTicketsByEvent = (ticketList) => {
    const groups = [];
    const eventMap = new Map();

    ticketList.forEach((ticket) => {
      const event = ticket.eventId || {};
      const eventKey = event._id || event.id || event.title || ticket._id || 'unknown';

      if (!eventMap.has(eventKey)) {
        const newGroup = {
          eventKey,
          event,
          tickets: [],
          primaryTicketId: ticket._id || ticket.id,
          primaryTicket: ticket,
          ticketCount: 0,
        };
        eventMap.set(eventKey, newGroup);
        groups.push(newGroup);
      }

      const group = eventMap.get(eventKey);
      group.tickets.push(ticket);
      group.ticketCount = group.tickets.length;
    });

    return groups;
  };

  const upcomingGroups = groupTicketsByEvent(upcomingTickets);
  const pastGroups = groupTicketsByEvent(pastTickets);

  const displayedGroups = activeTab === 'upcoming' ? upcomingGroups : pastGroups;

  return (
    <AppLayout hideHeader={true} hideFooter={true} hideBottomNav={false} bgColor="#000000">
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          margin: '0 auto',
          minHeight: '100vh',
          backgroundColor: '#000000',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Top App Header matching Screenshot 1 */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 900,
            backgroundColor: '#000000',
            paddingTop: '16px',
            borderBottom: '1px solid #1A1A1A',
          }}
        >
          {/* Top Bar: Title + Flag + Help */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 18px 14px',
              position: 'relative',
            }}
          >
            {/* Left Spacer for symmetry */}
            <div style={{ width: '48px' }} />

            {/* Centered Title with Country Flag Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                justifyContent: 'center',
              }}
            >
              <h1
                style={{
                  fontSize: '17px',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  margin: 0,
                  letterSpacing: '-0.01em',
                }}
              >
                My Tickets
              </h1>
              <CountryFlagCircle size={20} />
            </div>

            {/* Right: Help button */}
            <button
              onClick={() => setShowHelpModal(true)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '4px 6px',
                width: '48px',
                textAlign: 'right',
              }}
            >
              Help
            </button>
          </div>

          {/* Navigation Tabs: Upcoming (N) | Past (N) */}
          <div
            style={{
              display: 'flex',
              width: '100%',
              borderTop: '1px solid #141414',
            }}
          >
            {/* Upcoming Tab */}
            <button
              onClick={() => setActiveTab('upcoming')}
              style={{
                flex: 1,
                padding: '14px 0',
                background: 'none',
                border: 'none',
                fontSize: '15px',
                fontWeight: activeTab === 'upcoming' ? 700 : 500,
                color: activeTab === 'upcoming' ? '#FFFFFF' : '#8E8E93',
                cursor: 'pointer',
                textAlign: 'center',
                position: 'relative',
                transition: 'color 0.15s ease',
              }}
            >
              Upcoming ({upcomingGroups.length})
              {activeTab === 'upcoming' && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    backgroundColor: '#FFFFFF',
                  }}
                />
              )}
            </button>

            {/* Past Tab */}
            <button
              onClick={() => setActiveTab('past')}
              style={{
                flex: 1,
                padding: '14px 0',
                background: 'none',
                border: 'none',
                fontSize: '15px',
                fontWeight: activeTab === 'past' ? 700 : 500,
                color: activeTab === 'past' ? '#FFFFFF' : '#8E8E93',
                cursor: 'pointer',
                textAlign: 'center',
                position: 'relative',
                transition: 'color 0.15s ease',
              }}
            >
              Past ({pastGroups.length})
              {activeTab === 'past' && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    backgroundColor: '#FFFFFF',
                  }}
                />
              )}
            </button>
          </div>
        </div>

        {/* Tickets Content List */}
        <div
          style={{
            padding: '16px 16px 90px',
            flex: 1,
            backgroundColor: '#000000',
          }}
        >
          {loading ? (
            <div style={{ padding: '80px 0', textAlign: 'center' }}>
              <TicketmasterSpinner size="md" message="Loading your tickets..." />
            </div>
          ) : displayedGroups.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                backgroundColor: '#0D0D0D',
                borderRadius: '12px',
                border: '1px solid #1F1F1F',
                marginTop: '20px',
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: '#1A1A1A',
                  color: '#026CDF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <Ticket size={28} />
              </div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  margin: '0 0 8px 0',
                }}
              >
                No {activeTab} tickets
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  color: '#8E8E93',
                  margin: '0 0 24px 0',
                  lineHeight: 1.5,
                }}
              >
                {activeTab === 'upcoming'
                  ? "You don't have any upcoming tickets yet. Browse top trending concerts, sports, and shows."
                  : 'You have no past tickets or previous event orders.'}
              </p>

              {activeTab === 'upcoming' && (
                <Link
                  to="/explore"
                  className="btn-primary"
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    backgroundColor: '#026CDF',
                    color: '#FFFFFF',
                    fontWeight: 700,
                  }}
                >
                  Browse Events <ArrowRight size={16} />
                </Link>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {displayedGroups.map((group) => (
                <TicketCard
                  key={group.eventKey}
                  ticket={group.primaryTicket}
                  event={group.event}
                  tickets={group.tickets}
                  ticketCount={group.ticketCount}
                  onClick={() => navigate(`/tickets/${group.primaryTicketId}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setShowHelpModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#1E1E1E',
              color: '#FFFFFF',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '420px',
              width: '100%',
              border: '1px solid #333333',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <HelpCircle size={22} color="#026CDF" />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>
                  Customer Support
                </h3>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '22px',
                  color: '#8E8E93',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '14px', color: '#B3B3B3', lineHeight: 1.5, marginBottom: '20px' }}>
              Need assistance with your tickets, orders, or event entry? Our support team is available 24/7.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <div
                style={{
                  padding: '12px 14px',
                  backgroundColor: '#2A2A2A',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <ShieldCheck size={18} color="#059669" />
                <div>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
                    100% Buyer Guarantee
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9CA3AF' }}>
                    Valid tickets or your money back
                  </p>
                </div>
              </div>

              <div
                style={{
                  padding: '12px 14px',
                  backgroundColor: '#2A2A2A',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <Ticket size={18} color="#026CDF" />
                <div>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
                    SafeTix Digital Barcodes
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9CA3AF' }}>
                    Barcodes update dynamically for secure gate entry
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                fontWeight: 700,
                backgroundColor: '#026CDF',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
