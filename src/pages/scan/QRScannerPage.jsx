import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, QrCode, Check, X, AlertCircle, RotateCcw, Loader } from 'lucide-react';
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
      <style>{`
        @keyframes scanline {
          0%   { top: 0 }
          50%  { top: calc(100% - 2px) }
          100% { top: 0 }
        }
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>

      <div style={{ background: '#F5F5F5', minHeight: '100vh', paddingBottom: '80px' }}>

        {/* Header */}
        <div style={{ background: '#FFFFFF', borderBottom: '1px solid #E5E5E5', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', position: 'sticky', top: 0, zIndex: 10 }}>
          <button onClick={() => navigate(-1)} style={{ background: '#F5F5F5', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <ChevronLeft size={20} color="#1F1F1F" />
          </button>
          <div>
            <h1 style={{ color: '#1F1F1F', fontSize: '18px', fontWeight: 800, margin: 0 }}>Ticket Scanner</h1>
            <p style={{ color: '#6B6B6B', fontSize: '12px', margin: 0 }}>Gate check-in validation</p>
          </div>
        </div>

        <div style={{ padding: '20px 16px', maxWidth: '480px', margin: '0 auto' }}>

          {/* Viewfinder card */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: '12px', padding: '32px 24px', textAlign: 'center', marginBottom: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto 16px' }}>
              {/* Corner brackets */}
              {[
                { top: 0, left: 0, borderTop: '3px solid #026CDF', borderLeft: '3px solid #026CDF', borderRadius: '4px 0 0 0' },
                { top: 0, right: 0, borderTop: '3px solid #026CDF', borderRight: '3px solid #026CDF', borderRadius: '0 4px 0 0' },
                { bottom: 0, left: 0, borderBottom: '3px solid #026CDF', borderLeft: '3px solid #026CDF', borderRadius: '0 0 0 4px' },
                { bottom: 0, right: 0, borderBottom: '3px solid #026CDF', borderRight: '3px solid #026CDF', borderRadius: '0 0 4px 0' },
              ].map((s, i) => (
                <div key={i} style={{ position: 'absolute', width: '24px', height: '24px', ...s }} />
              ))}

              {/* Inner dashed border */}
              <div style={{ position: 'absolute', inset: '8px', border: '1px dashed #E5E5E5', borderRadius: '4px' }} />

              {/* Scanline animation */}
              <div style={{
                position: 'absolute',
                left: '8px', right: '8px', height: '2px',
                background: 'linear-gradient(90deg, transparent, #026CDF, transparent)',
                animation: 'scanline 2s ease-in-out infinite',
                top: 0,
              }} />

              {/* QR icon center */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <QrCode size={64} color="rgba(2,108,223,0.25)" />
              </div>
            </div>
            <p style={{ color: '#6B6B6B', fontSize: '13px', margin: 0 }}>Point camera at QR code or enter code below</p>
          </div>

          {/* Result card */}
          {result && (
            <div style={{
              background: result.status === 'VALID' ? '#F0FDF4' : result.status === 'USED' ? '#FFFBEB' : '#FEF2F2',
              border: `1px solid ${result.status === 'VALID' ? '#BBF7D0' : result.status === 'USED' ? '#FDE68A' : '#FECACA'}`,
              borderRadius: '12px', padding: '24px', marginBottom: '16px', textAlign: 'center',
            }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%', margin: '0 auto 14px',
                background: result.status === 'VALID' ? '#DCFCE7' : result.status === 'USED' ? '#FEF3C7' : '#FEE2E2',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {result.status === 'VALID'
                  ? <Check size={28} color="#16A34A" />
                  : result.status === 'USED'
                  ? <AlertCircle size={28} color="#D97706" />
                  : <X size={28} color="#DC2626" />
                }
              </div>
              <h3 style={{
                fontWeight: 800, fontSize: '18px', margin: '0 0 6px',
                color: result.status === 'VALID' ? '#16A34A' : result.status === 'USED' ? '#D97706' : '#DC2626',
              }}>
                {result.status === 'VALID' ? 'TICKET VALID' : result.status === 'USED' ? 'ALREADY USED' : 'INVALID TICKET'}
              </h3>
              <p style={{ color: result.status === 'VALID' ? '#15803D' : result.status === 'USED' ? '#B45309' : '#B91C1C', fontSize: '13px', margin: '0 0 8px', lineHeight: '1.5' }}>
                {result.message}
              </p>
              {result.status === 'VALID' && result.event && (
                <p style={{ color: '#6B6B6B', fontSize: '12px', margin: '0 0 4px' }}>Event: <strong style={{ color: '#1F1F1F' }}>{result.event?.title}</strong></p>
              )}
              {result.status === 'VALID' && result.ticket && (
                <p style={{ color: '#6B6B6B', fontSize: '12px', margin: 0, fontFamily: 'monospace' }}>#{result.ticket?.ticketNumber}</p>
              )}
            </div>
          )}

          {/* Input form */}
          {!result ? (
            <form onSubmit={handleScan}>
              <div style={{ background: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <label style={{ display: 'block', color: '#1F1F1F', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>QR Code / Ticket ID</label>
                <input
                  value={qrInput}
                  onChange={e => setQrInput(e.target.value)}
                  placeholder="Paste or type QR token here..."
                  autoFocus
                  style={{ width: '100%', padding: '12px 14px', background: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: '6px', color: '#1F1F1F', fontSize: '14px', outline: 'none', boxSizing: 'border-box', marginBottom: '12px', fontFamily: 'monospace' }}
                  onFocus={e => e.target.style.borderColor = '#026CDF'}
                  onBlur={e => e.target.style.borderColor = '#E5E5E5'}
                />
                <button
                  type="submit"
                  disabled={loading || !qrInput.trim()}
                  style={{ width: '100%', padding: '13px', background: loading || !qrInput.trim() ? '#93C5FD' : '#026CDF', border: 'none', borderRadius: '6px', color: '#FFFFFF', fontWeight: 700, fontSize: '15px', cursor: loading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  {loading
                    ? <><div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Validating…</>
                    : 'Validate Ticket'
                  }
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={reset}
              style={{ width: '100%', padding: '13px', background: '#026CDF', border: 'none', borderRadius: '6px', color: '#FFFFFF', fontWeight: 700, fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <RotateCcw size={16} /> Scan Another Ticket
            </button>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
