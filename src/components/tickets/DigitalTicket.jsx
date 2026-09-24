import React from 'react';
import { Calendar, MapPin, QrCode, ArrowLeft, Send, DollarSign, Share2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import TicketmasterLogo from '../ui/TicketmasterLogo.jsx';

export default function DigitalTicket({
  ticket,
  onClose,
  onTransfer,
  onResale,
  canTransfer = true,
  canResell = true,
}) {
  if (!ticket) return null;

  const event = ticket.eventId || {};
  const ticketType = ticket.ticketTypeId || {};

  const title = event.title || 'Event Admission';
  const venue = event.venue || 'Venue';
  const address = event.address || '';
  const dateObj = event.startDate ? new Date(event.startDate) : null;
  const dateStr = dateObj
    ? dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : 'Date TBA';
  const timeStr = event.startTime || (dateObj ? dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '');

  const section = ticket.section || ticketType.section || 'General';
  const row = ticket.row || ticketType.row || 'GA';
  const seat = ticket.seat || 'Open';
  const ticketNumber = ticket.ticketNumber || 'TICK-TM-000000';

  const imageUrl =
    event.coverImage?.url ||
    event.bannerImage ||
    'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&auto=format&fit=crop&q=80';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Top Header Bar */}
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: '#026CDF',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TicketmasterLogo color="#FFFFFF" height={22} />
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', opacity: 0.9 }}>
              DIGITAL WALLET
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              color: '#FFFFFF',
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Event Header Banner */}
        <div
          style={{
            position: 'relative',
            height: '140px',
            background: `linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%), url(${imageUrl}) center/cover no-repeat`,
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            color: '#FFFFFF',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <ShieldCheck size={16} color="#4ADE80" />
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#4ADE80', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Verified Authentic Ticket
            </span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', margin: 0, lineHeight: 1.2 }}>
            {title}
          </h2>
          <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.9)', margin: '4px 0 0' }}>
            {venue} {address ? `• ${address}` : ''}
          </p>
        </div>

        {/* Seat Indicators Matrix */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            borderBottom: '1px solid #E5E5E5',
            backgroundColor: '#F8F9FA',
            textAlign: 'center',
          }}
        >
          <div style={{ padding: '14px 8px', borderRight: '1px solid #E5E5E5' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#6B6B6B', letterSpacing: '0.05em' }}>
              SECTION
            </span>
            <p style={{ margin: '2px 0 0', fontSize: '20px', fontWeight: 800, color: '#1F1F1F' }}>
              {section}
            </p>
          </div>
          <div style={{ padding: '14px 8px', borderRight: '1px solid #E5E5E5' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#6B6B6B', letterSpacing: '0.05em' }}>
              ROW
            </span>
            <p style={{ margin: '2px 0 0', fontSize: '20px', fontWeight: 800, color: '#1F1F1F' }}>
              {row}
            </p>
          </div>
          <div style={{ padding: '14px 8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#6B6B6B', letterSpacing: '0.05em' }}>
              SEAT
            </span>
            <p style={{ margin: '2px 0 0', fontSize: '20px', fontWeight: 800, color: '#1F1F1F' }}>
              {seat}
            </p>
          </div>
        </div>

        {/* QR Code Presentation Container */}
        <div style={{ padding: '24px 20px 16px', textAlign: 'center', backgroundColor: '#FFFFFF' }}>
          <div
            style={{
              width: '210px',
              height: '210px',
              margin: '0 auto',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '2px solid #E5E5E5',
              padding: '12px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Animated Laser Barcode Scanner Beam */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                height: '3px',
                backgroundColor: '#026CDF',
                boxShadow: '0 0 10px #026CDF',
                animation: 'tmLaserScan 2s ease-in-out infinite alternate',
                zIndex: 3,
              }}
            />

            {ticket.qrCodeImage || ticket.qrDataUrl ? (
              <img
                src={ticket.qrCodeImage || ticket.qrDataUrl}
                alt="Ticket QR Code"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            ) : (
              <QrCode size={160} color="#1F1F1F" />
            )}
          </div>

          <p style={{ fontSize: '13px', fontWeight: 700, color: '#1F1F1F', marginTop: '14px', marginBottom: '2px' }}>
            Hold near reader at entrance
          </p>
          <p style={{ fontSize: '12px', fontFamily: 'monospace', color: '#6B6B6B', letterSpacing: '1px', margin: 0 }}>
            {ticketNumber}
          </p>

          <p style={{ fontSize: '11px', color: '#8C8C8C', marginTop: '6px' }}>
            {dateStr} • {timeStr}
          </p>
        </div>

        {/* Perforation Cut-outs */}
        <div style={{ position: 'relative', height: '16px', display: 'flex', alignItems: 'center' }}>
          <div className="ticket-notch-left" />
          <div
            style={{
              width: '100%',
              height: '1px',
              borderTop: '2px dashed #D1D5DB',
              margin: '0 16px',
            }}
          />
          <div className="ticket-notch-right" />
        </div>

        {/* Action Controls */}
        <div style={{ padding: '16px 20px 24px', backgroundColor: '#FAFAFA' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
            {canTransfer && onTransfer && (
              <button
                className="btn-secondary"
                style={{ padding: '12px 10px', borderRadius: '10px' }}
                onClick={() => onTransfer(ticket)}
              >
                <Send size={16} /> Transfer
              </button>
            )}

            {canResell && onResale && (
              <button
                className="btn-secondary"
                style={{ padding: '12px 10px', borderRadius: '10px', color: '#EA580C' }}
                onClick={() => onResale(ticket)}
              >
                <DollarSign size={16} /> Sell
              </button>
            )}
          </div>

          <button
            className="btn-primary"
            style={{ width: '100%', padding: '13px', borderRadius: '10px', fontSize: '14px' }}
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>

      <style>{`
        @keyframes tmLaserScan {
          0% { top: 12px; }
          100% { top: 196px; }
        }
      `}</style>
    </div>
  );
}
