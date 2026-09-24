import React from 'react';
import { CheckCircle, Clock, Ban, AlertCircle, Tag, ShieldCheck } from 'lucide-react';

const STATUS_CONFIG = {
  APPROVED: {
    label: 'Approved',
    icon: CheckCircle,
    color: '#059669',
    bg: '#ECFDF5',
    border: '#A7F3D0',
  },
  PENDING: {
    label: 'Pending Review',
    icon: Clock,
    color: '#D97706',
    bg: '#FFFBEB',
    border: '#FDE68A',
  },
  SUSPENDED: {
    label: 'Suspended',
    icon: Ban,
    color: '#DC2626',
    bg: '#FEF2F2',
    border: '#FECACA',
  },
  ACTIVE: {
    label: 'Active',
    icon: CheckCircle,
    color: '#059669',
    bg: '#ECFDF5',
    border: '#A7F3D0',
  },
  SOLD: {
    label: 'Valid / Active',
    icon: ShieldCheck,
    color: '#059669',
    bg: '#ECFDF5',
    border: '#A7F3D0',
  },
  CANCELLED: {
    label: 'Cancelled',
    icon: Ban,
    color: '#DC2626',
    bg: '#FEF2F2',
    border: '#FECACA',
  },
  USED: {
    label: 'Redeemed',
    icon: CheckCircle,
    color: '#6B7280',
    bg: '#F3F4F6',
    border: '#E5E7EB',
  },
  TRANSFERRED: {
    label: 'Transferred',
    icon: Tag,
    color: '#7C3AED',
    bg: '#F5F3FF',
    border: '#DDD6FE',
  },
  TRANSFER_PENDING: {
    label: 'Transfer Pending',
    icon: Clock,
    color: '#D97706',
    bg: '#FFFBEB',
    border: '#FDE68A',
  },
  LISTED: {
    label: 'Listed for Resale',
    icon: Tag,
    color: '#EA580C',
    bg: '#FFF7ED',
    border: '#FED7AA',
  },
  DRAFT: {
    label: 'Draft',
    icon: Clock,
    color: '#6B7280',
    bg: '#F3F4F6',
    border: '#E5E7EB',
  },
  PUBLISHED: {
    label: 'Published',
    icon: CheckCircle,
    color: '#026CDF',
    bg: '#EFF6FF',
    border: '#BFDBFE',
  },
};

export default function StatusBadge({ status, showIcon = true, className = '', style = {} }) {
  const config = STATUS_CONFIG[status?.toUpperCase()] ?? {
    label: status ?? 'Unknown',
    icon: Clock,
    color: '#6B7280',
    bg: '#F3F4F6',
    border: '#E5E7EB',
  };

  const Icon = config.icon;

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '3px 9px',
        borderRadius: '9999px',
        fontSize: '11px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        color: config.color,
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
        lineHeight: 1.2,
        ...style,
      }}
    >
      {showIcon && <Icon size={12} />}
      {config.label}
    </span>
  );
}
