import React from 'react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import BottomNav from './BottomNav.jsx';

export default function AppLayout({ children, hideFooter = false }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', backgroundColor: '#F5F5F5' }}>
      <Header />
      <main className="content-with-bottom-nav" style={{ flex: 1, width: '100%' }}>
        {children}
      </main>
      {!hideFooter && <Footer />}
      <BottomNav />
    </div>
  );
}
