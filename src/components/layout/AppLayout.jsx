import React from 'react';
import BottomNav from './BottomNav.jsx';

export default function AppLayout({ children }) {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <main style={{ minHeight: '100vh' }}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
