import React from 'react';
import { CheckCircle, Clock, Ban } from 'lucide-react';

const STATUS_CONFIG = {
  APPROVED: {
    label: 'Approved',
    icon: CheckCircle,
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.3)',
  },
  PENDING: {
    label: 'Pending',
    icon: Clock,
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(245, 158, 11, 0.3)',
  },
  SUSPENDED: {
    label: 'Suspended',
    icon: Ban,
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.12)',
    border: 'rgba(239, 68, 68, 0.3)',
  },
  ACTIVE: {
    label: 'Active',
    icon: CheckCircle,
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.3)',
  },
  CANCELLED: {
    label: 'Cancelled',
    icon: Ban,
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.12)',
    border: 'rgba(239, 68, 68, 0.3)',
  },
  USED: {
    label: 'Used',
    icon: CheckCircle,
    color: '#64748b',
    bg: 'rgba(100, 116, 139, 0.12)',
    border: 'rgba(100, 116, 139, 0.3)',
  },
  DRAFT: {
    label: 'Draft',
    icon: Clock,
    color: '#94a3b8',
    bg: 'rgba(148, 163, 184, 0.1)',
    border: 'rgba(148, 163, 184, 0.2)',
  },
  PUBLISHED: {
    label: 'Published',
    icon: CheckCircle,
    color: '#6366f1',
    bg: 'rgba(99, 102, 241, 0.12)',
    border: 'rgba(99, 102, 241, 0.3)',
  },
};

/**
 * StatusBadge - displays a coloured badge for user/event/ticket status
 * @param {string} status - e.g. 'APPROVED' | 'PENDING' | 'SUSPENDED'
 * @param {boolean} showIcon - show icon (default true)
 * @param {string} className - extra class names
 */
export default function StatusBadge({ status, showIcon = true, className = '' }) {
  const config = STATUS_CONFIG[status?.toUpperCase()] ?? {
    label: status ?? 'Unknown',
    icon: Clock,
    color: '#94a3b8',
    bg: 'rgba(148, 163, 184, 0.1)',
    border: 'rgba(148, 163, 184, 0.2)',
  };

  const Icon = config.icon;

  return (
    <span
      className={`badge ${className}`}
      style={{
        color: config.color,
        background: config.bg,
        border: `1px solid ${config.border}`,
      }}
    >
      {showIcon && <Icon size={12} />}
      {config.label}
    </span>
  );
}
