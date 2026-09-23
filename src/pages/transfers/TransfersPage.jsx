import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Inbox, Clock, Check, X, ChevronRight, AlertCircle } from 'lucide-react';
import api from '../../lib/axios.js';
import AppLayout from '../../components/layout/AppLayout.jsx';

const STATUS_INFO = {
  PENDING: { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', label: 'Pending' },
  ACCEPTED: { color: '#10b981', bg: 'rgba(16,185,129,0.15)', label: 'Accepted' },
  DECLINED: { color: '#ef4444', bg: 'rgba(239,68,68,0.15)', label: 'Declined' },
  EXPIRED: { color: '#6b7280', bg: 'rgba(107,114,128,0.15)', label: 'Expired' },
  CANCELLED: { color: '#6b7280', bg: 'rgba(107,114,128,0.15)', label: 'Cancelled' },
};

export default function TransfersPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('received');
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => { fetchTransfers(); }, []);

  const fetchTransfers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/transfers/my-transfers');
      const list = Array.isArray(data?.data) ? data.data : Array.isArray(data?.transfers) ? data.transfers : Array.isArray(data) ? data : [];
      setTransfers(list);
    } catch (err) { console.error(err); setTransfers([]); }
    finally { setLoading(false); }
  };

  const handleAction = async (id, action) => {
    setActionLoading(id + action);
    try {
      if (action === 'accept') await api.post(`/transfers/${id}/accept`);
      else await api.post(`/transfers/${id}/decline`);
      setMsg(action === 'accept' ? 'Transfer accepted! Ticket added to your wallet.' : 'Transfer declined.');
      fetchTransfers();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  const sent = (Array.isArray(transfers) ? transfers : []).filter(t => t?.type === 'SENT');
  const received = (Array.isArray(transfers) ? transfers : []).filter(t => t?.type === 'RECEIVED');
  const current = tab === 'sent' ? sent : received;

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';

  return (
    <AppLayout>
      <div style={{ paddingBottom: '80px', minHeight: '100vh' }}>
        <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #2d1b69)', padding: '48px 16px 0' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginBottom: '12px' }}>
            <ArrowLeft size={18} color="#fff" />
          </button>
          <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 800, margin: '0 0 20px' }}>Transfers</h1>
          <div style={{ display: 'flex' }}>
            {['received', 'sent'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '12px', background: 'none', border: 'none', borderBottom: tab === t ? '2px solid #6366f1' : '2px solid transparent', color: tab === t ? '#6366f1' : 'rgba(255,255,255,0.5)', fontWeight: tab === t ? 600 : 400, fontSize: '13px', cursor: 'pointer', textTransform: 'capitalize' }}>
                {t === 'received' ? <><Inbox size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />Received</> : <><Send size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />Sent</>}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: '16px' }}>
          {msg && (
            <div style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '12px', padding: '12px 14px', marginBottom: '14px', color: '#818cf8', fontSize: '13px' }}>
              {msg}
            </div>
          )}

          {loading ? (
            [1,2,3].map(i => <div key={i} style={{ height: '90px', background: '#1a1a2e', borderRadius: '16px', marginBottom: '12px' }} />)
          ) : current.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              {tab === 'received' ? <Inbox size={40} color="#374151" style={{ marginBottom: '12px' }} /> : <Send size={40} color="#374151" style={{ marginBottom: '12px' }} />}
              <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>No {tab} transfers</p>
            </div>
          ) : (
            current.map(transfer => {
              const status = STATUS_INFO[transfer.status] || { color: '#6b7280', bg: 'rgba(107,114,128,0.15)', label: transfer.status };
              const ticket = transfer.ticketId || {};
              const event = ticket.eventId || {};
              return (
                <div key={transfer._id} style={{ background: '#1a1a2e', borderRadius: '16px', padding: '16px', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <p style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '14px', margin: '0 0 3px' }}>
                        {event.title || 'Event Ticket'}
                      </p>
                      <p style={{ color: '#64748b', fontSize: '12px', margin: 0 }}>
                        {tab === 'sent' ? `To: ${transfer.recipientName || transfer.recipientEmail || transfer.recipientPhone}` : `From: ${transfer.senderId?.firstName} ${transfer.senderId?.lastName}`}
                      </p>
                    </div>
                    <span style={{ background: status.bg, color: status.color, padding: '3px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 600 }}>
                      {status.label}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
                    <Clock size={11} color="#475569" />
                    <p style={{ color: '#475569', fontSize: '11px', margin: 0 }}>{formatDate(transfer.createdAt)}</p>
                    {transfer.expiresAt && transfer.status === 'PENDING' && (
                      <p style={{ color: '#f59e0b', fontSize: '11px', margin: '0 0 0 8px' }}>
                        Expires: {formatDate(transfer.expiresAt)}
                      </p>
                    )}
                  </div>
                  {tab === 'received' && transfer.status === 'PENDING' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleAction(transfer._id, 'accept')}
                        disabled={!!actionLoading}
                        style={{ flex: 1, padding: '10px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 600, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <Check size={14} />
                        {actionLoading === transfer._id + 'accept' ? '...' : 'Accept'}
                      </button>
                      <button
                        onClick={() => handleAction(transfer._id, 'decline')}
                        disabled={!!actionLoading}
                        style={{ flex: 1, padding: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', color: '#ef4444', fontWeight: 600, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <X size={14} />
                        {actionLoading === transfer._id + 'decline' ? '...' : 'Decline'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </AppLayout>
  );
}
