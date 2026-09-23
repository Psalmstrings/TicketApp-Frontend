import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

/* =========================================================
   Toast Context & Provider
   ========================================================= */
const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const COLORS = {
  success: { border: '#10b981', icon: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  error:   { border: '#ef4444', icon: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  info:    { border: '#6366f1', icon: '#818cf8', bg: 'rgba(99,102,241,0.12)' },
  warning: { border: '#f59e0b', icon: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
};

let _id = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    clearTimeout(timers.current[id]);
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const show = useCallback((message, type = 'info', duration = 3000) => {
    const id = ++_id;
    setToasts(prev => [...prev, { id, message, type }]);
    timers.current[id] = setTimeout(() => dismiss(id), duration);
    return id;
  }, [dismiss]);

  const toast = {
    success: (msg, dur) => show(msg, 'success', dur),
    error:   (msg, dur) => show(msg, 'error', dur),
    info:    (msg, dur) => show(msg, 'info', dur),
    warning: (msg, dur) => show(msg, 'warning', dur),
    dismiss,
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

/* =========================================================
   Toast Container & Item
   ========================================================= */
function ToastContainer({ toasts, onDismiss }) {
  if (!toasts.length) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        width: '90%',
        maxWidth: 400,
        pointerEvents: 'none',
      }}
    >
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }) {
  const { id, message, type } = toast;
  const colors = COLORS[type] ?? COLORS.info;
  const Icon = ICONS[type] ?? Info;

  return (
    <div
      style={{
        pointerEvents: 'all',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        background: '#1e1e3a',
        border: `1px solid ${colors.border}`,
        borderLeft: `3px solid ${colors.border}`,
        borderRadius: 12,
        padding: '12px 14px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        animation: 'slideDown 0.25s ease',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Icon size={18} style={{ color: colors.icon, flexShrink: 0, marginTop: 1 }} />
      <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: '#e2e8f0', lineHeight: 1.4 }}>
        {message}
      </span>
      <button
        onClick={() => onDismiss(id)}
        style={{
          background: 'none',
          border: 'none',
          color: '#64748b',
          cursor: 'pointer',
          padding: '2px',
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
        }}
        aria-label="Dismiss"
      >
        <X size={16} />
      </button>
    </div>
  );
}
