import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, Ticket, Check } from 'lucide-react';
import api from '../../lib/axios.js';
import { useAuth } from '../../context/AuthContext.jsx';

function Field({ label, icon, type = 'text', value, onChange, placeholder, children }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        {icon && <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}>{icon}</div>}
        {children || (
          <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            style={{ width: '100%', padding: `13px 14px 13px ${icon ? '46px' : '14px'}`, background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '13px', color: '#e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            onFocus={e => e.target.style.borderColor = '#6366f1'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
          />
        )}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.password) {
      setError('All fields are required.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/register', form);
      // Auto-login after registration
      localStorage.setItem('tickapp_token', data.token);
      setSuccess(true);
      setTimeout(() => navigate('/home', { replace: true }), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '72px', height: '72px', background: 'rgba(16,185,129,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Check size={36} color="#10b981" />
          </div>
          <h2 style={{ color: '#e2e8f0', fontSize: '22px', fontWeight: 800, margin: '0 0 10px' }}>Account Created!</h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
            Welcome to TickApp! Your account is pending admin approval. You can browse events right now.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', padding: '48px 24px 32px', textAlign: 'center' }}>
        <div style={{ width: '56px', height: '56px', background: 'rgba(255,255,255,0.15)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
          <Ticket size={28} color="#fff" />
        </div>
        <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 900, margin: '0 0 4px' }}>Create Account</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', margin: 0 }}>Join TickApp and start exploring events</p>
      </div>

      <div style={{ flex: 1, padding: '28px 24px 48px', overflowY: 'auto' }}>
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', padding: '12px 14px', marginBottom: '18px', color: '#f87171', fontSize: '13px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '0' }}>
            <Field label="First Name" icon={<User size={17} color="#4b5563" />} value={form.firstName} onChange={e => setF('firstName', e.target.value)} placeholder="John" />
            <Field label="Last Name" value={form.lastName} onChange={e => setF('lastName', e.target.value)} placeholder="Doe" />
          </div>
          <Field label="Email Address" icon={<Mail size={17} color="#4b5563" />} type="email" value={form.email} onChange={e => setF('email', e.target.value)} placeholder="you@example.com" />
          <Field label="Phone Number" icon={<Phone size={17} color="#4b5563" />} type="tel" value={form.phone} onChange={e => setF('phone', e.target.value)} placeholder="+234 800 000 0000" />
          <Field label="Password" icon={<Lock size={17} color="#4b5563" />}>
            <div style={{ position: 'relative' }}>
              <Lock size={17} color="#4b5563" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={e => setF('password', e.target.value)}
                placeholder="Minimum 6 characters"
                style={{ width: '100%', padding: '13px 48px 13px 46px', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '13px', color: '#e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                {showPw ? <EyeOff size={17} color="#4b5563" /> : <Eye size={17} color="#4b5563" />}
              </button>
            </div>
          </Field>
          <Field label="Confirm Password" icon={<Lock size={17} color="#4b5563" />} type="password" value={form.confirmPassword} onChange={e => setF('confirmPassword', e.target.value)} placeholder="Repeat password" />

          <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '12px', padding: '12px 14px', marginBottom: '20px' }}>
            <p style={{ color: '#64748b', fontSize: '12px', margin: 0, lineHeight: '1.6' }}>
              ℹ️ New accounts start as <strong style={{ color: '#818cf8' }}>pending</strong>. An admin must approve your account before you can create events or transfer tickets. You can browse and get tickets immediately.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '15px', background: loading ? '#374151' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '14px', color: '#fff', fontWeight: 700, fontSize: '15px', cursor: loading ? 'wait' : 'pointer', marginBottom: '20px' }}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '14px', margin: 0 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
