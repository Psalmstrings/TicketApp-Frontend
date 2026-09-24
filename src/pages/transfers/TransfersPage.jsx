import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout.jsx';
import TicketmasterSpinner from '../../components/ui/TicketmasterSpinner.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import api from '../../lib/axios.js';
import {
  Send,
  Inbox,
  Clock,
  Check,
  X,
  ChevronLeft,
  Calendar,
  MapPin,
  ShieldCheck,
  Ticket,
} from 'lucide-react';

export default function TransfersPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [tab, setTab] = useState('received');
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/transfers/my-transfers');
      const list = Array.isArray(data?.data) ? data.data : Array.isArray(data?.transfers) ? data.transfers : Array.isArray(data) ? data : [];
      setTransfers(list);
    } catch (err) {
      console.error(err);
      setTransfers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    setActionLoading(id + action);
    try {
      if (action === 'accept') {
        await api.post(`/transfers/${id}/accept`);
        toast.success('Ticket transfer accepted! Added to My Tickets.');
      } else {
        await api.post(`/transfers/${id}/decline`);
        toast.info('Transfer declined.');
      }
      fetchTransfers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed.');
    } finally {
      setActionLoading(null);
    }
  };

  const sent = transfers.filter((t) => t?.type === 'SENT');
  const received = transfers.filter((t) => t?.type === 'RECEIVED');
  const currentList = tab === 'sent' ? sent : received;

  return (
    <AppLayout>
      {/* Header Bar */}
      <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E5E5', padding: '28px 0 0' }}>
        <div className="tm-container">
          <Link
            to="/for-you"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#026CDF',
              fontSize: '13px',
              fontWeight: 700,
              textDecoration: 'none',
              marginBottom: '12px',
            }}
          >
            <ChevronLeft size={16} /> Back to For You
          </Link>

          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1F1F1F', margin: '0 0 16px 0' }}>
            Ticket Transfers
          </h1>

          {/* Tab Navigation */}
          <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid #E5E5E5' }}>
            {[
              { key: 'received', label: 'Received Transfers', icon: Inbox, count: received.length },
              { key: 'sent', label: 'Sent Transfers', icon: Send, count: sent.length },
            ].map((t) => {
              const Icon = t.icon;
              const isActive = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  style={{
                    padding: '12px 0',
                    border: 'none',
                    background: 'none',
                    fontSize: '14px',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#026CDF' : '#6B6B6B',
                    borderBottom: isActive ? '3px solid #026CDF' : '3px solid transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Icon size={16} /> {t.label} ({t.count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Transfers List */}
      <div className="tm-container" style={{ padding: '32px 20px', maxWidth: '720px' }}>
        {loading ? (
          <div style={{ padding: '60px 0', textAlign: 'center' }}>
            <TicketmasterSpinner size="md" message="Loading transfer records..." />
          </div>
        ) : currentList.length === 0 ? (
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
            {tab === 'received' ? <Inbox size={36} color="#9E9E9E" style={{ marginBottom: '12px' }} /> : <Send size={36} color="#9E9E9E" style={{ marginBottom: '12px' }} />}
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1F1F1F', margin: '0 0 6px 0' }}>
              No {tab} transfer requests
            </h3>
            <p style={{ fontSize: '13px', color: '#6B6B6B', margin: 0 }}>
              {tab === 'received'
                ? 'When someone transfers an event ticket to you, it will appear here for you to accept.'
                : 'Tickets you transfer to friends or family will be tracked here.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {currentList.map((transfer) => {
              const ticket = transfer.ticketId || {};
              const event = ticket.eventId || {};
              const isPending = transfer.status === 'PENDING';

              return (
                <div
                  key={transfer._id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '14px',
                    border: '1px solid #E5E5E5',
                    padding: '18px 20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1F1F1F', margin: '0 0 3px 0' }}>
                        {event.title || 'Event Admission'}
                      </h3>
                      <p style={{ fontSize: '13px', color: '#6B6B6B', margin: 0 }}>
                        {tab === 'sent'
                          ? `Recipient: ${transfer.recipientName || transfer.recipientEmail}`
                          : `Sender: ${transfer.senderId?.firstName || 'A ticket holder'} ${transfer.senderId?.lastName || ''}`}
                      </p>
                    </div>
                    <StatusBadge status={transfer.status} />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: '#6B6B6B', marginBottom: '14px' }}>
                    <span>Sec: {ticket.section || 'GA'} • Row: {ticket.row || 'GA'} • Seat: {ticket.seat || 'Open'}</span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} />
                      {transfer.createdAt ? new Date(transfer.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                    </span>
                  </div>

                  {tab === 'received' && isPending && (
                    <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid #F0F0F0', paddingTop: '14px' }}>
                      <button
                        className="btn-primary"
                        style={{ flex: 2, padding: '10px' }}
                        disabled={actionLoading === transfer._id + 'accept'}
                        onClick={() => handleAction(transfer._id, 'accept')}
                      >
                        <Check size={16} /> Accept & Add to Wallet
                      </button>

                      <button
                        className="btn-secondary"
                        style={{ flex: 1, padding: '10px', color: '#DC2626' }}
                        disabled={actionLoading === transfer._id + 'decline'}
                        onClick={() => handleAction(transfer._id, 'decline')}
                      >
                        <X size={16} /> Decline
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
