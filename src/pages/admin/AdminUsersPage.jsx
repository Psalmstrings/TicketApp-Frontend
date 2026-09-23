import React, { useState, useEffect } from 'react';
import { Search, Check, AlertTriangle, Trash2, X, ChevronDown } from 'lucide-react';
import api from '../../lib/axios.js';

const STATUS_BADGE = {
  PENDING: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', label: 'Pending' },
  APPROVED: { bg: 'rgba(16,185,129,0.15)', color: '#10b981', label: 'Approved' },
  SUSPENDED: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444', label: 'Suspended' },
  DELETED: { bg: 'rgba(107,114,128,0.15)', color: '#6b7280', label: 'Deleted' },
};

function SuspendModal({ user, onClose, onConfirm }) {
  const [reason, setReason] = useState('');
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'flex-end', zIndex: 1000 }} onClick={onClose}>
      <div style={{ background: '#1e1e3a', borderRadius: '24px 24px 0 0', padding: '24px 20px 48px', width: '100%' }} onClick={e => e.stopPropagation()}>
        <h3 style={{ color: '#e2e8f0', fontSize: '18px', fontWeight: 700, margin: '0 0 6px' }}>Suspend User</h3>
        <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 16px' }}>Suspending: {user.firstName} {user.lastName}</p>
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="Reason for suspension..."
          rows={3}
          style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box', marginBottom: '16px', resize: 'vertical' }}
        />
        <button onClick={() => onConfirm(reason)} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #ef4444, #dc2626)', border: 'none', borderRadius: '14px', color: '#fff', fontWeight: 600, fontSize: '15px', cursor: 'pointer' }}>
          Suspend User
        </button>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [suspendTarget, setSuspendTarget] = useState(null);
  const [actionMsg, setActionMsg] = useState('');

  const STATUS_FILTERS = ['All', 'PENDING', 'APPROVED', 'SUSPENDED'];

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/users');
      const list = Array.isArray(data?.data) ? data.data : Array.isArray(data?.users) ? data.users : Array.isArray(data) ? data : [];
      setUsers(list);
    } catch (err) { console.error(err); setUsers([]); }
    finally { setLoading(false); }
  };

  const handleApprove = async (userId) => {
    try {
      await api.patch(`/admin/users/${userId}/approve`);
      setActionMsg('User approved!');
      fetchUsers();
    } catch (err) { setActionMsg(err.response?.data?.message || 'Failed'); }
  };

  const handleSuspend = async (userId, reason) => {
    try {
      await api.patch(`/admin/users/${userId}/suspend`, { reason });
      setActionMsg('User suspended.');
      setSuspendTarget(null);
      fetchUsers();
    } catch (err) { setActionMsg(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setActionMsg('User deleted.');
      fetchUsers();
    } catch (err) { setActionMsg(err.response?.data?.message || 'Failed'); }
  };

  const filtered = (Array.isArray(users) ? users : []).filter(u => {
    const matchSearch = !search || `${u.firstName} ${u.lastName} ${u.email} ${u.phone}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || u.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

  return (
    <div style={{ padding: '16px' }}>
      {actionMsg && (
        <div style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '12px', padding: '12px', marginBottom: '14px', color: '#818cf8', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {actionMsg}
          <button onClick={() => setActionMsg('')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={14} color="#818cf8" /></button>
        </div>
      )}

      {/* Search */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', background: '#1a1a2e', borderRadius: '12px', padding: '10px 14px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '12px' }}>
        <Search size={16} color="#64748b" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." style={{ background: 'transparent', border: 'none', outline: 'none', color: '#e2e8f0', fontSize: '14px', flex: 1 }} />
      </div>

      {/* Status Filter */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {STATUS_FILTERS.map(f => (
          <button key={f} onClick={() => setStatusFilter(f)}
            style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid', borderColor: statusFilter === f ? '#6366f1' : 'rgba(255,255,255,0.1)', background: statusFilter === f ? 'rgba(99,102,241,0.2)' : 'transparent', color: statusFilter === f ? '#818cf8' : '#64748b', fontSize: '12px', fontWeight: statusFilter === f ? 600 : 400, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {f}
          </button>
        ))}
      </div>

      <p style={{ color: '#475569', fontSize: '12px', margin: '0 0 12px' }}>{filtered.length} user{filtered.length !== 1 ? 's' : ''}</p>

      {loading ? (
        [1,2,3].map(i => <div key={i} style={{ height: '90px', background: '#1a1a2e', borderRadius: '14px', marginBottom: '10px' }} />)
      ) : filtered.map(user => {
        const badge = STATUS_BADGE[user.status] || { bg: 'rgba(107,114,128,0.15)', color: '#6b7280', label: user.status };
        return (
          <div key={user._id} style={{ background: '#1a1a2e', borderRadius: '16px', padding: '14px', marginBottom: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {user.avatar?.url ? <img src={user.avatar.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: '#fff', fontWeight: 700, fontSize: '14px' }}>{user.firstName?.[0]}{user.lastName?.[0]}</span>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '14px', margin: '0 0 2px' }}>{user.firstName} {user.lastName}</p>
                    <p style={{ color: '#64748b', fontSize: '12px', margin: '0 0 1px' }}>{user.email}</p>
                    <p style={{ color: '#475569', fontSize: '11px', margin: 0 }}>{user.phone} · Joined {formatDate(user.createdAt)}</p>
                  </div>
                  <span style={{ background: badge.bg, color: badge.color, padding: '3px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 600, flexShrink: 0 }}>{badge.label}</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {user.status === 'PENDING' && (
                <button onClick={() => handleApprove(user._id)}
                  style={{ flex: 1, padding: '9px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '10px', color: '#10b981', fontWeight: 600, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <Check size={14} /> Approve
                </button>
              )}
              {user.status === 'APPROVED' && (
                <button onClick={() => setSuspendTarget(user)}
                  style={{ flex: 1, padding: '9px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '10px', color: '#f59e0b', fontWeight: 600, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <AlertTriangle size={14} /> Suspend
                </button>
              )}
              <button onClick={() => handleDelete(user._id)}
                style={{ flex: 1, padding: '9px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', color: '#ef4444', fontWeight: 600, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        );
      })}

      {suspendTarget && (
        <SuspendModal user={suspendTarget} onClose={() => setSuspendTarget(null)} onConfirm={(reason) => handleSuspend(suspendTarget._id, reason)} />
      )}
    </div>
  );
}
