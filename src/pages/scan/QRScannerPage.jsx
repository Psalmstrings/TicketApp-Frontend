import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft as Back, QrCode, Check, X, AlertCircle, RotateCcw, Loader } from 'lucide-react';
import api from '../../lib/axios.js';
import AppLayout from '../../components/layout/AppLayout.jsx';

export default function QRScannerPage() {
  const navigate = useNavigate();
  const [qrInput, setQrInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { status: 'VALID'|'INVALID'|'USED', ticket, event, message }

  const handleScan = async (e) => {
    e.preventDefault();
    if (!qrInput.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.post('/tickets/checkin/scan', { qrToken: qrInput.trim() });
      setResult({
        status: 'VALID',
        ticket: data.data?.ticket,
        event: data.data?.event,
        message: data.message || 'Ticket is valid!',
      });
    } catch (err) {
      const code = err.response?.data?.code;
      const msg = err.response?.data?.message || 'Invalid ticket';
      setResult({
        status: code === 'ALREADY_CHECKED_IN' ? 'USED' : 'INVALID',
        message: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setResult(null); setQrInput(''); };

  return (
    <AppLayout>
      <div style={{ paddingBottom: '80px', minHeight: '100vh' }}>
        <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #2d1b69)', padding: '48px 16px 24px' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginBottom: '12px' }}>
            <Back size={18} color="#fff" />
          </button>
          <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 800, margin: 0 }}>QR Scanner</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', margin: '6px 0 0' }}>Validate event tickets at the gate</p>
        </div>

        <div style={{ padding: '20px 16px' }}>
          {/* Viewfinder */}
          <div style={{ background: '#1a1a2e', borderRadius: '20px', padding: '30px 20px', textAlign: 'center', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto 16px', border: '2px solid rgba(99,102,241,0.5)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Corner decorations */}
              {[
                { top: -2, left: -2, borderTop: '3px solid #6366f1', borderLeft: '3px solid #6366f1' },
                { top: -2, right: -2, borderTop: '3px solid #6366f1', borderRight: '3px solid #6366f1' },
                { bottom: -2, left: -2, borderBottom: '3px solid #6366f1', borderLeft: '3px solid #6366f1' },
                { bottom: -2, right: -2, borderBottom: '3px solid #6366f1', borderRight: '3px solid #6366f1' },
              ].map((s, i) => (
                <div key={i} style={{ position: 'absolute', width: '24px', height: '24px', borderRadius: '2px', ...s }} />
              ))}
              {/* Scanline animation */}
              <div style={{
                position: 'absolute',
                left: 0, right: 0, height: '2px',
                background: 'linear-gradient(90deg, transparent, #6366f1, transparent)',
                animation: 'scanline 2s ease-in-out infinite',
              }} />
              <QrCode size={64} color="rgba(99,102,241,0.3)" />
            </div>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
              Point camera at QR code or enter code below
            </p>
          </div>

          {/* Input form */}
          {!result && (
            <form onSubmit={handleScan}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  QR Code / Ticket Token
                </label>
                <textarea
                  value={qrInput}
                  onChange={e => setQrInput(e.target.value)}
                  placeholder="Paste QR token here (e.g. TICKAPP-V1.xxx.xxx)"
                  rows={3}
                  style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#e2e8f0', fontSize: '13px', outline: 'none', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'monospace' }}
                />
              </div>
              <button type="submit" disabled={loading || !qrInput.trim()}
                style={{ width: '100%', padding: '14px', background: !qrInput.trim() ? '#1a1a2e' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', color: !qrInput.trim() ? '#475569' : '#fff', fontWeight: 600, fontSize: '15px', cursor: !qrInput.trim() ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {loading ? <><Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> Checking...</> : <>Validate Ticket</>}
              </button>
            </form>
          )}

          {/* Result */}
          {result && (
            <div style={{ background: '#1a1a2e', borderRadius: '20px', overflow: 'hidden', border: `1px solid ${result.status === 'VALID' ? 'rgba(16,185,129,0.3)' : result.status === 'USED' ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
              {/* Status bar */}
              <div style={{ background: result.status === 'VALID' ? 'rgba(16,185,129,0.15)' : result.status === 'USED' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)', padding: '20px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: result.status === 'VALID' ? 'rgba(16,185,129,0.2)' : result.status === 'USED' ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  {result.status === 'VALID' ? <Check size={28} color="#10b981" /> : result.status === 'USED' ? <AlertCircle size={28} color="#f59e0b" /> : <X size={28} color="#ef4444" />}
                </div>
                <h3 style={{ color: result.status === 'VALID' ? '#10b981' : result.status === 'USED' ? '#f59e0b' : '#ef4444', fontSize: '20px', fontWeight: 800, margin: '0 0 6px' }}>
                  {result.status === 'VALID' ? 'VALID TICKET' : result.status === 'USED' ? 'ALREADY USED' : 'INVALID TICKET'}
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>{result.message}</p>
              </div>

              {/* Ticket info */}
              {result.ticket && (
                <div style={{ padding: '16px' }}>
                  {[
                    { label: 'Holder', value: `${result.ticket.ownerId?.firstName || ''} ${result.ticket.ownerId?.lastName || ''}`.trim() || '—' },
                    { label: 'Event', value: result.event?.title || '—' },
                    { label: 'Ticket #', value: result.ticket.ticketNumber || '—' },
                    { label: 'Type', value: result.ticket.ticketTypeId?.name || 'General' },
                    { label: 'Section', value: result.ticket.section || 'General' },
                  ].map((item, i, arr) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                      <span style={{ color: '#64748b', fontSize: '13px' }}>{item.label}</span>
                      <span style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 600 }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ padding: '16px', paddingTop: 0 }}>
                <button onClick={reset}
                  style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', color: '#e2e8f0', fontWeight: 600, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <RotateCcw size={16} />
                  Scan Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes scanline { 0%, 100% { top: 10%; opacity: 1; } 50% { top: 85%; opacity: 0.7; } } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </AppLayout>
  );
}
