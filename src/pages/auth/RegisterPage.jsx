import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import api from '../../lib/axios.js';
import TicketmasterLogo from '../../components/ui/TicketmasterLogo.jsx';

function Field({ label, icon, type = 'text', value, onChange, placeholder, children }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={{ display: 'block', color: '#1F1F1F', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        {icon && <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>{icon}</div>}
        {children || (
          <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            style={{ width: '100%', padding: `12px 12px 12px ${icon ? '40px' : '12px'}`, background: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: '6px', color: '#1F1F1F', fontSize: '14px', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
            onFocus={e => e.target.style.borderColor = '#026CDF'}
            onBlur={e => e.target.style.borderColor = '#E5E5E5'}
          />
        )}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.password) {
      setError('All fields are required.'); return;
    }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true); setError('');
    try {
      const { data } = await api.post('/auth/register', form);
      localStorage.setItem('tickapp_token', data.token);
      setSuccess(true);
      setTimeout(() => navigate('/home', { replace: true }), 2200);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', background: '#F0FDF4', border: '2px solid #BBF7D0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle size={40} color="#16A34A" />
          </div>
          <h2 style={{ color: '#1F1F1F', fontSize: '24px', fontWeight: 800, margin: '0 0 10px' }}>Account Created!</h2>
          <p style={{ color: '#6B6B6B', fontSize: '14px', lineHeight: '1.6', margin: 0, maxWidth: '300px' }}>
            Welcome to TickApp! Your account is pending admin approval. You can browse events right away.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>

      <div style={{ width: '100%', maxWidth: '440px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E5E5', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', overflow: 'hidden' }}>

        {/* Blue brand header */}
        <div style={{ background: '#026CDF', padding: '28px 32px 24px', textAlign: 'center' }}>
          <div>
            <TicketmasterLogo height={36} color="#ffffff" />
          </div>
          <h1 style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: 900, margin: '0 0 2px' }}>Create Account</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', margin: 0 }}>Join TickApp and start exploring events</p>
        </div>

        <div style={{ padding: '28px 28px 32px', overflowY: 'auto' }}>
          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px 14px', marginBottom: '18px', color: '#DC2626', fontSize: '13px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Name row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Field label="First Name" icon={<User size={16} color="#6B6B6B" />} value={form.firstName} onChange={e => setF('firstName', e.target.value)} placeholder="John" />
              <Field label="Last Name" value={form.lastName} onChange={e => setF('lastName', e.target.value)} placeholder="Doe" />
            </div>

            <Field label="Email Address" icon={<Mail size={16} color="#6B6B6B" />} type="email" value={form.email} onChange={e => setF('email', e.target.value)} placeholder="you@example.com" />
            <Field label="Phone Number" icon={<Phone size={16} color="#6B6B6B" />} type="tel" value={form.phone} onChange={e => setF('phone', e.target.value)} placeholder="+234 800 000 0000" />

            {/* Password */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', color: '#1F1F1F', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#6B6B6B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setF('password', e.target.value)}
                  placeholder="Minimum 6 characters"
                  style={{ width: '100%', padding: '12px 44px 12px 40px', background: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: '6px', color: '#1F1F1F', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#026CDF'}
                  onBlur={e => e.target.style.borderColor = '#E5E5E5'}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#6B6B6B' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Field label="Confirm Password" icon={<Lock size={16} color="#6B6B6B" />} type="password" value={form.confirmPassword} onChange={e => setF('confirmPassword', e.target.value)} placeholder="Repeat password" />

            {/* Pending notice */}
            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '8px', padding: '12px 14px', marginBottom: '20px' }}>
              <p style={{ color: '#1E40AF', fontSize: '12px', margin: 0, lineHeight: '1.6' }}>
                ℹ️ New accounts start as <strong>pending</strong>. An admin must approve your account before you can create events or transfer tickets. You can browse events immediately.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '13px', background: loading ? '#93C5FD' : '#026CDF', border: 'none', borderRadius: '6px', color: '#FFFFFF', fontWeight: 700, fontSize: '15px', cursor: loading ? 'wait' : 'pointer', marginBottom: '16px' }}
            >
              {loading ? 'Creating Account…' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: '#6B6B6B', fontSize: '14px', margin: 0 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#026CDF', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
