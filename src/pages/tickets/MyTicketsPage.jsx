import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout.jsx';
import TicketCard from '../../components/tickets/TicketCard.jsx';
import DigitalTicket from '../../components/tickets/DigitalTicket.jsx';
import TicketmasterSpinner from '../../components/ui/TicketmasterSpinner.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import api from '../../lib/axios.js';
import { Ticket, ArrowRight, Send, DollarSign, X } from 'lucide-react';

const TABS = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past', label: 'Past' },
  { key: 'transferred', label: 'Transferred' },
  { key: 'listed', label: 'Resale Listings' },
];

export default function MyTicketsPage() {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [filter, setFilter] = useState('upcoming');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Digital Ticket Modal & Actions
  const [activeDigitalTicket, setActiveDigitalTicket] = useState(null);
  const [transferTicketTarget, setTransferTicketTarget] = useState(null);
  const [resaleTicketTarget, setResaleTicketTarget] = useState(null);

  // Transfer form
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [submittingTransfer, setSubmittingTransfer] = useState(false);

  // Resale form
  const [resalePrice, setResalePrice] = useState('');
  const [submittingResale, setSubmittingResale] = useState(false);

  const isApproved = user?.status === 'APPROVED' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  useEffect(() => {
    fetchTickets();
  }, [filter]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/tickets/my-tickets?filter=${filter}`);
      const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      setTickets(list);
    } catch (err) {
      console.error(err);
      setTickets([]);
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
    setSubmittingTransfer(true);
    try {
      await api.post('/transfers', {
        ticketId: transferTicketTarget._id || transferTicketTarget.id,
        recipientEmail: recipientEmail.trim(),
        recipientName: recipientName.trim(),
      });
      toast.success('Transfer initiated! Recipient will receive an invitation to accept.');
      setTransferTicketTarget(null);
      setRecipientEmail('');
      setRecipientName('');
      fetchTickets();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Transfer failed.');
    } finally {
      setSubmittingTransfer(false);
    }
  };

  const handleResaleSubmit = async (e) => {
    e.preventDefault();
    const price = parseFloat(resalePrice);
    if (isNaN(price) || price <= 0) {
      toast.error('Enter a valid resale price.');
      return;
    }
    setSubmittingResale(true);
    try {
      await api.post('/resale', {
        ticketId: resaleTicketTarget._id || resaleTicketTarget.id,
        price,
      });
      toast.success('Ticket listed on the Resale Marketplace!');
      setResaleTicketTarget(null);
      setResalePrice('');
      fetchTickets();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Listing failed.');
    } finally {
      setSubmittingResale(false);
    }
  };

  return (
    <AppLayout>
      {/* Header Bar */}
      <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E5E5', padding: '28px 0 0' }}>
        <div className="tm-container">
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1F1F1F', margin: '0 0 16px 0' }}>
            My Tickets
          </h1>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid #E5E5E5' }}>
            {TABS.map((t) => {
              const isActive = filter === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setFilter(t.key)}
                  style={{
                    padding: '12px 0',
                    border: 'none',
                    background: 'none',
                    fontSize: '14px',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#026CDF' : '#6B6B6B',
                    borderBottom: isActive ? '3px solid #026CDF' : '3px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Ticket Wallet Content Area */}
      <div className="tm-container" style={{ padding: '32px 20px', maxWidth: '840px' }}>
        {loading ? (
          <div style={{ padding: '60px 0', textAlign: 'center' }}>
            <TicketmasterSpinner size="md" message="Loading your ticket wallet..." />
          </div>
        ) : tickets.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E5E5E5',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#EBF3FD',
                color: '#026CDF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <Ticket size={28} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1F1F1F', margin: '0 0 6px 0' }}>
              No {filter} tickets found
            </h3>
            <p style={{ fontSize: '14px', color: '#6B6B6B', margin: '0 0 20px 0', lineHeight: 1.5 }}>
              {filter === 'upcoming'
                ? "You don't have any upcoming tickets yet. Browse trending concerts, sports matches, and shows."
                : `No tickets currently categorized under "${filter}".`}
            </p>

            {filter === 'upcoming' && (
              <Link to="/explore" className="btn-primary" style={{ padding: '12px 24px', borderRadius: '8px' }}>
                Browse Live Events <ArrowRight size={16} />
              </Link>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {tickets.map((t) => (
              <TicketCard
                key={t._id || t.id}
                ticket={t}
                variant="wallet"
                onTransfer={(ticket) => {
                  if (!isApproved) {
                    toast.error('Account approval required to transfer tickets.');
                    return;
                  }
                  setTransferTicketTarget(ticket);
                }}
                onResale={(ticket) => {
                  if (!isApproved) {
                    toast.error('Account approval required to resell tickets.');
                    return;
                  }
                  setResaleTicketTarget(ticket);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ===== DIGITAL TICKET MODAL ===== */}
      {activeDigitalTicket && (
        <DigitalTicket
          ticket={activeDigitalTicket}
          onClose={() => setActiveDigitalTicket(null)}
          onTransfer={(t) => {
            setActiveDigitalTicket(null);
            setTransferTicketTarget(t);
          }}
          onResale={(t) => {
            setActiveDigitalTicket(null);
            setResaleTicketTarget(t);
          }}
          canTransfer={isApproved}
          canResell={isApproved}
        />
      )}

      {/* ===== TRANSFER MODAL ===== */}
      {transferTicketTarget && (
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
          onClick={() => setTransferTicketTarget(null)}
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
                <Send size={20} color="#026CDF" />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Transfer Ticket</h3>
              </div>
              <button
                onClick={() => setTransferTicketTarget(null)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6B6B6B' }}
              >
                ×
              </button>
            </div>

            <p style={{ fontSize: '13px', color: '#6B6B6B', margin: '0 0 16px 0', lineHeight: 1.5 }}>
              Transfer ticket <strong>#{transferTicketTarget.ticketNumber}</strong> safely. The recipient will be notified and can accept directly.
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

              <button
                type="submit"
                disabled={submittingTransfer}
                className="btn-primary"
                style={{ width: '100%', padding: '13px' }}
              >
                {submittingTransfer ? 'Sending Invitation...' : 'Send Transfer Invitation'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ===== RESALE MODAL ===== */}
      {resaleTicketTarget && (
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
          onClick={() => setResaleTicketTarget(null)}
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
                <DollarSign size={20} color="#EA580C" />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>List on Resale Marketplace</h3>
              </div>
              <button
                onClick={() => setResaleTicketTarget(null)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6B6B6B' }}
              >
                ×
              </button>
            </div>

            <p style={{ fontSize: '13px', color: '#6B6B6B', margin: '0 0 16px 0', lineHeight: 1.5 }}>
              List ticket <strong>#{resaleTicketTarget.ticketNumber}</strong> on Ticketmaster's verified exchange. When purchased, payment is credited to your balance.
            </p>

            <form onSubmit={handleResaleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label className="input-label">Resale Listing Price ($) *</label>
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

              <button
                type="submit"
                disabled={submittingResale}
                className="btn-primary"
                style={{ width: '100%', padding: '13px', backgroundColor: '#EA580C' }}
              >
                {submittingResale ? 'Listing Ticket...' : 'Confirm Resale Listing'}
              </button>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
