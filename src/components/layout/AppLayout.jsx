import React from 'react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import BottomNav from './BottomNav.jsx';

export default function AppLayout({
  children,
  hideHeader = false,
  hideFooter = false,
  hideBottomNav = false,
  bgColor = '#F5F5F5',
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', backgroundColor: bgColor }}>
      {!hideHeader && <Header />}
      <main className={hideBottomNav ? '' : 'content-with-bottom-nav'} style={{ flex: 1, width: '100%' }}>
        {children}
      </main>
      {!hideFooter && <Footer />}
      {!hideBottomNav && <BottomNav />}
    </div>
  );
}
