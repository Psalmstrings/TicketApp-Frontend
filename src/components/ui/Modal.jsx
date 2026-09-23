import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

/**
 * Full-screen mobile modal with slide-up animation and backdrop blur.
 *
 * @param {boolean} isOpen - controls visibility
 * @param {Function} onClose - called when backdrop or close button is clicked
 * @param {string} title - modal title
 * @param {React.ReactNode} children - modal body
 * @param {boolean} hideClose - hides the close button (default false)
 * @param {string} height - CSS height of the modal sheet (default '80vh')
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  hideClose = false,
  height = '80vh',
}) {
  // Close on Escape
  const handleKey = useCallback(
    (e) => { if (e.key === 'Escape' && onClose) onClose(); },
    [onClose]
  );
  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKey]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Sheet */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '430px',
          height: height,
          background: '#1a1a2e',
          borderRadius: '24px 24px 0 0',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.5)',
          animation: 'slideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Handle bar */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '12px', paddingBottom: '4px' }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.15)' }} />
        </div>

        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 20px 16px',
            borderBottom: title ? '1px solid rgba(255,255,255,0.06)' : 'none',
          }}
        >
          {title && (
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#f1f5f9' }}>
              {title}
            </h3>
          )}
          {!hideClose && (
            <button
              onClick={onClose}
              style={{
                marginLeft: 'auto',
                background: 'rgba(255,255,255,0.06)',
                border: 'none',
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#94a3b8',
                transition: 'background 0.15s',
                flexShrink: 0,
              }}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 24px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
