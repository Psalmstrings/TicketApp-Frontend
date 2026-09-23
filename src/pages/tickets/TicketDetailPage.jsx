import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, QrCode, MapPin, Clock, User, Tag, RotateCcw,
  Send, DollarSign, Check, AlertCircle, X, Loader
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../lib/axios.js';

const STATUS_INFO = {
  SOLD: { color: '#10b981', label: 'Active', bg: 'rgba(16,185,129,0.15)' },
  AVAILABLE: { color: '#6366f1', label: 'Available', bg: 'rgba(99,102,241,0.15)' },
  USED: { color: '#6b7280', label: 'Used', bg: 'rgba(107,114,128,0.15)' },
  TRANSFERRED: { color: '#8b5cf6', label: 'Transferred', bg: 'rgba(139,92,246,0.15)' },
  TRANSFER_PENDING: { color: '#f59e0b', label: 'Transfer Pending', bg: 'rgba(245,158,11,0.15)' },
  LISTED: { color: '#f59e0b', label: 'Listed for Resale', bg: 'rgba(245,158,11,0.15)' },
  CANCELLED: { color: '#ef4444', label: 'Cancelled', bg: 'rgba(239,68,68,0.15)' },
};

function TransferModal({ ticket, onClose, onSuccess }) {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recipientEmail && !recipientPhone) {
      setError('Enter recipient email or phone number.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/transfers', { ticketId: ticket._id, recipientEmail, recipientPhone, recipientName });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'flex-end', zIndex: 1000 }}
      onClick={onClose}>
      <div style={{ background: '#1e1e3a', borderRadius: '24px 24px 0 0', padding: '24px 20px 48px', width: '100%', border: '1px solid rgba(255,255,255,0.1)' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ color: '#e2e8f0', fontSize: '18px', fontWeight: 700, margin: 0 }}>Transfer Ticket</h3>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={16} color="#94a3b8" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', padding: '12px', marginBottom: '14px', color: '#f87171', fontSize: '13px' }}>
              {error}
            </div>
          )}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Recipient Name (optional)
            </label>
            <input
              value={recipientName}
              onChange={e => setRecipientName(e.target.value)}
              placeholder="John Doe"
              style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Recipient Email
            </label>
            <input
              type="email"
              value={recipientEmail}
              onChange={e => setRecipientEmail(e.target.value)}
              placeholder="recipient@email.com"
              style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Or Phone Number
            </label>
            <input
              type="tel"
              value={recipientPhone}
              onChange={e => setRecipientPhone(e.target.value)}
              placeholder="+234 800 000 0000"
              style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '14px', color: '#fff', fontWeight: 600, fontSize: '15px', cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Sending...' : 'Send Transfer'}
          </button>
        </form>
      </div>
    </div>
  );
}

function ResaleModal({ ticket, onClose, onSuccess }) {
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!price || isNaN(price) || Number(price) <= 0) {
      setError('Enter a valid resale price.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/resale', { ticketId: ticket._id, price: Number(price) });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to list ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'flex-end', zIndex: 1000 }}
      onClick={onClose}>
      <div style={{ background: '#1e1e3a', borderRadius: '24px 24px 0 0', padding: '24px 20px 48px', width: '100%', border: '1px solid rgba(255,255,255,0.1)' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ color: '#e2e8f0', fontSize: '18px', fontWeight: 700, margin: 0 }}>List for Resale</h3>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={16} color="#94a3b8" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', padding: '12px', marginBottom: '14px', color: '#f87171', fontSize: '13px' }}>
              {error}
            </div>
          )}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Resale Price (₦)
            </label>
            <input
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="0.00"
              min="1"
              style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none', borderRadius: '14px', color: '#fff', fontWeight: 600, fontSize: '15px', cursor: loading ? 'wait' : 'pointer' }}>
            {loading ? 'Listing...' : 'List for Resale'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showResale, setShowResale] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const isApproved = user?.status === 'APPROVED' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  useEffect(() => { fetchTicket(); }, [id]);

  const fetchTicket = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/tickets/${id}`);
      setTicket(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid rgba(99,102,241,0.3)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!ticket) return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#64748b' }}>Ticket not found</p>
    </div>
  );

  const event = ticket.eventId || {};
  const tt = ticket.ticketTypeId || {};
  const status = STATUS_INFO[ticket.status] || { color: '#6b7280', label: ticket.status, bg: 'rgba(107,114,128,0.15)' };
  const canTransfer = ticket.status === 'SOLD' && ticket.transferable && isApproved;
  const canResell = ticket.status === 'SOLD' && ticket.resellable && isApproved;

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : '';

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', paddingBottom: '40px' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        padding: '48px 16px 28px',
        position: 'relative',
      }}>
        <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginBottom: '16px' }}>
          <ArrowLeft size={20} color="#fff" />
        </button>
        <h1 style={{ color: '#fff', fontSize: '18px', fontWeight: 800, margin: '0 0 4px' }}>{event.title}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ background: status.bg, color: status.color, padding: '3px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 600 }}>
            {status.label}
          </span>
        </div>
      </div>

      <div style={{ padding: '20px 16px' }}>
        {/* Success message */}
        {successMsg && (
          <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px', color: '#10b981', fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Check size={16} />
            {successMsg}
          </div>
        )}

        {/* QR Code Card */}
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '24px',
          textAlign: 'center',
          marginBottom: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}>
          {ticket.qrDataUrl ? (
            <img src={ticket.qrDataUrl} alt="QR Code" style={{ width: '100%', maxWidth: '220px', height: 'auto' }} />
          ) : (
            <div style={{ width: '220px', height: '220px', margin: '0 auto', background: '#f1f5f9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <QrCode size={80} color="#6366f1" />
            </div>
          )}
          <p style={{ color: '#1e293b', fontSize: '12px', marginTop: '12px', fontFamily: 'monospace', letterSpacing: '1px' }}>
            #{ticket.ticketNumber}
          </p>
        </div>

        {/* Ticket Details */}
        <div style={{ background: '#1a1a2e', borderRadius: '20px', padding: '20px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 700, margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Ticket Details
          </h3>
          {[
            { icon: <Tag size={16} color="#6366f1" />, label: 'Type', value: tt.name || 'General' },
            { icon: <MapPin size={16} color="#6366f1" />, label: 'Venue', value: event.venue || '—' },
            { icon: <Clock size={16} color="#6366f1" />, label: 'Date', value: formatDate(event.startDate) },
            { icon: <User size={16} color="#6366f1" />, label: 'Section', value: ticket.section || 'General' },
            { label: 'Row', value: ticket.row || 'GA' },
            { label: 'Seat', value: ticket.seat || 'Open' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {item.icon || <div style={{ width: '16px' }} />}
                <span style={{ color: '#64748b', fontSize: '13px' }}>{item.label}</span>
              </div>
              <span style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 500 }}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {canTransfer && (
            <button
              onClick={() => setShowTransfer(true)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '14px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '14px', color: '#fff', fontWeight: 600, fontSize: '15px', cursor: 'pointer' }}
            >
              <Send size={18} />
              Transfer Ticket
            </button>
          )}
          {canResell && (
            <button
              onClick={() => setShowResale(true)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '14px', background: 'transparent', border: '1px solid rgba(245,158,11,0.4)', borderRadius: '14px', color: '#f59e0b', fontWeight: 600, fontSize: '15px', cursor: 'pointer' }}
            >
              <DollarSign size={18} />
              List for Resale
            </button>
          )}
          {!isApproved && (ticket.status === 'SOLD') && (
            <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '14px', padding: '14px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <AlertCircle size={18} color="#f59e0b" />
              <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
                Account approval required to transfer or resell tickets.
              </p>
            </div>
          )}
        </div>
      </div>

      {showTransfer && (
        <TransferModal
          ticket={ticket}
          onClose={() => setShowTransfer(false)}
          onSuccess={() => {
            setShowTransfer(false);
            setSuccessMsg('Transfer initiated! Recipient will receive a transfer request.');
            fetchTicket();
          }}
        />
      )}
      {showResale && (
        <ResaleModal
          ticket={ticket}
          onClose={() => setShowResale(false)}
          onSuccess={() => {
            setShowResale(false);
            setSuccessMsg('Ticket listed for resale successfully!');
            fetchTicket();
          }}
        />
      )}
    </div>
  );
}
