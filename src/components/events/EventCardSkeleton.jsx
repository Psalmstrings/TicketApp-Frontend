import React from 'react';

export default function EventCardSkeleton() {
  return (
    <div
      style={{
        borderRadius: '12px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E5E5',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Artwork placeholder */}
      <div
        className="tm-skeleton"
        style={{
          width: '100%',
          paddingTop: '56.25%',
          position: 'relative',
        }}
      />

      {/* Info Body */}
      <div style={{ padding: '16px', display: 'flex', gap: '14px', flex: 1 }}>
        {/* Date badge */}
        <div
          className="tm-skeleton"
          style={{ width: 48, height: 52, borderRadius: '8px', flexShrink: 0 }}
        />

        {/* Lines */}
        <div style={{ flex: 1 }}>
          <div className="tm-skeleton" style={{ width: '85%', height: '16px', marginBottom: '8px' }} />
          <div className="tm-skeleton" style={{ width: '60%', height: '14px', marginBottom: '6px' }} />
          <div className="tm-skeleton" style={{ width: '45%', height: '12px' }} />
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid #F0F0F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div className="tm-skeleton" style={{ width: '50px', height: '16px' }} />
        <div className="tm-skeleton" style={{ width: '90px', height: '28px', borderRadius: '6px' }} />
      </div>
    </div>
  );
}
