import React from 'react';
import { Link } from 'react-router-dom';
import TicketmasterLogo from '../ui/TicketmasterLogo.jsx';
import { ShieldCheck, HelpCircle, Ticket, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#1F1F1F',
        color: '#FFFFFF',
        marginTop: 'auto',
        borderTop: '1px solid #333333',
        paddingTop: '48px',
        paddingBottom: '32px',
      }}
    >
      <div className="tm-container">
        {/* Top Feature Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
            paddingBottom: '36px',
            borderBottom: '1px solid #333333',
            marginBottom: '40px',
          }}
        >
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(2, 108, 223, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShieldCheck size={20} color="#026CDF" />
            </div>
            <div>
              <h4 style={{ color: '#FFFFFF', fontSize: '15px', margin: '0 0 4px 0' }}>100% Buyer Guarantee</h4>
              <p style={{ color: '#A0A0A0', fontSize: '13px', margin: 0, lineHeight: 1.4 }}>
                Authentic tickets with secure transfer and verified entry guaranteed.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(2, 108, 223, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Ticket size={20} color="#026CDF" />
            </div>
            <div>
              <h4 style={{ color: '#FFFFFF', fontSize: '15px', margin: '0 0 4px 0' }}>Official Ticketing</h4>
              <p style={{ color: '#A0A0A0', fontSize: '13px', margin: 0, lineHeight: 1.4 }}>
                Direct access to concert tours, sports matches, and theatrical shows.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(2, 108, 223, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <HelpCircle size={20} color="#026CDF" />
            </div>
            <div>
              <h4 style={{ color: '#FFFFFF', fontSize: '15px', margin: '0 0 4px 0' }}>Help Center & Support</h4>
              <p style={{ color: '#A0A0A0', fontSize: '13px', margin: 0, lineHeight: 1.4 }}>
                Order assistance, event updates, and ticket wallet management.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '32px',
            marginBottom: '40px',
          }}
        >
          <div>
            <h5 style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 700, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Explore
            </h5>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><Link to="/explore?category=Concerts" style={{ color: '#C0C0C0', fontSize: '13px', textDecoration: 'none' }}>Concerts</Link></li>
              <li><Link to="/explore?category=Sports" style={{ color: '#C0C0C0', fontSize: '13px', textDecoration: 'none' }}>Sports</Link></li>
              <li><Link to="/explore?category=Arts%20%26%20Theater" style={{ color: '#C0C0C0', fontSize: '13px', textDecoration: 'none' }}>Arts & Theater</Link></li>
              <li><Link to="/explore?category=Family" style={{ color: '#C0C0C0', fontSize: '13px', textDecoration: 'none' }}>Family & Kids</Link></li>
              <li><Link to="/explore" style={{ color: '#C0C0C0', fontSize: '13px', textDecoration: 'none' }}>All Events</Link></li>
            </ul>
          </div>

          <div>
            <h5 style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 700, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Buy & Sell
            </h5>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><Link to="/resale" style={{ color: '#C0C0C0', fontSize: '13px', textDecoration: 'none' }}>Sell Tickets</Link></li>
              <li><Link to="/tickets" style={{ color: '#C0C0C0', fontSize: '13px', textDecoration: 'none' }}>My Tickets</Link></li>
              <li><Link to="/transfers" style={{ color: '#C0C0C0', fontSize: '13px', textDecoration: 'none' }}>Ticket Transfer</Link></li>
              <li><Link to="/for-you" style={{ color: '#C0C0C0', fontSize: '13px', textDecoration: 'none' }}>For You Hub</Link></li>
              <li><Link to="/create" style={{ color: '#C0C0C0', fontSize: '13px', textDecoration: 'none' }}>Create an Event</Link></li>
            </ul>
          </div>

          <div>
            <h5 style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 700, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Account & Help
            </h5>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><Link to="/profile" style={{ color: '#C0C0C0', fontSize: '13px', textDecoration: 'none' }}>My Profile</Link></li>
              <li><Link to="/login" style={{ color: '#C0C0C0', fontSize: '13px', textDecoration: 'none' }}>Sign In</Link></li>
              <li><Link to="/register" style={{ color: '#C0C0C0', fontSize: '13px', textDecoration: 'none' }}>Create Account</Link></li>
              <li><Link to="/scan" style={{ color: '#C0C0C0', fontSize: '13px', textDecoration: 'none' }}>QR Check-in Scanner</Link></li>
              <li><Link to="/my-events" style={{ color: '#C0C0C0', fontSize: '13px', textDecoration: 'none' }}>Organizer Dashboard</Link></li>
            </ul>
          </div>

          {/* <div>
            <h5 style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 700, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Educational Project
            </h5>
            <p style={{ color: '#A0A0A0', fontSize: '12px', lineHeight: 1.5, margin: '0 0 10px 0' }}>
              This platform is a comprehensive educational full-stack implementation replicating Ticketmaster's user experience, design system, and ticketing architecture.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,255,255,0.08)', padding: '6px 12px', borderRadius: '20px', fontSize: '11px', color: '#D0D0D0' }}>
              Built with React + Node.js + MongoDB
            </div>
          </div> */}
        </div>

        {/* Bottom Copyright & Disclaimer Row */}
        <div
          style={{
            paddingTop: '24px',
            borderTop: '1px solid #333333',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            fontSize: '12px',
            color: '#808080',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <TicketmasterLogo color="#FFFFFF" height={20} />
            <span>© 2026 TickApp</span>
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <span style={{ color: '#A0A0A0' }}>Privacy Policy</span>
            <span style={{ color: '#A0A0A0' }}>Terms of Use</span>
            <span style={{ color: '#A0A0A0' }}>Purchase Policy</span>
            <span style={{ color: '#A0A0A0' }}>Cookie Settings</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
