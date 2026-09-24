import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, X, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import TicketmasterLogo from '../../components/ui/TicketmasterLogo.jsx';
import api from '../../lib/axios.js';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true); setError('');
    try { await login(form.email, form.password); navigate('/home', { replace: true }); }
    catch (err) { setError(err.response?.data?.message || 'Login failed. Check your credentials.'); }
    finally { setLoading(false); }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotLoading(true);
    try { await api.post('/auth/forgot-password', { email: forgotEmail }); }
    catch (err) { /* show success for security */ }
    finally { setForgotSent(true); setForgotLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>

      {/* Card */}
      <div style={{ width: '100%', maxWidth: '420px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E5E5', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', overflow: 'hidden' }}>

        {/* Blue brand header */}
        <div style={{ background: '#026CDF', padding: '32px 32px 28px', textAlign: 'center' }}>
          <div>
            <TicketmasterLogo height={36} color="#ffffff" />
          </div>
          {/* <h1 style={{ color: '#FFFFFF', fontSize: '24px', fontWeight: 900, margin: '0 0 4px', letterSpacing: '-0.3px' }}>TickApp</h1> */}
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', margin: 0 }}>Your events, your tickets</p>
        </div>

        {/* Form body */}
        <div style={{ padding: '32px' }}>
          <h2 style={{ color: '#1F1F1F', fontSize: '20px', fontWeight: 700, margin: '0 0 4px' }}>Welcome back</h2>
          <p style={{ color: '#6B6B6B', fontSize: '14px', margin: '0 0 24px' }}>Sign in to continue to TickApp</p>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px 14px', marginBottom: '18px', color: '#DC2626', fontSize: '13px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: '#1F1F1F', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#6B6B6B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="you@example.com"
                  autoComplete="email"
                  style={{ width: '100%', padding: '12px 12px 12px 40px', background: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: '6px', color: '#1F1F1F', fontSize: '14px', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
                  onFocus={e => e.target.style.borderColor = '#026CDF'}
                  onBlur={e => e.target.style.borderColor = '#E5E5E5'}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '8px' }}>
              <label style={{ display: 'block', color: '#1F1F1F', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#6B6B6B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="Your password"
                  autoComplete="current-password"
                  style={{ width: '100%', padding: '12px 44px 12px 40px', background: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: '6px', color: '#1F1F1F', fontSize: '14px', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
                  onFocus={e => e.target.style.borderColor = '#026CDF'}
                  onBlur={e => e.target.style.borderColor = '#E5E5E5'}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#6B6B6B' }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div style={{ textAlign: 'right', marginBottom: '24px' }}>
              <button type="button" onClick={() => { setShowForgot(true); setForgotSent(false); setForgotEmail(''); }} style={{ background: 'none', border: 'none', color: '#026CDF', fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: 0 }}>
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '13px', background: loading ? '#93C5FD' : '#026CDF', border: 'none', borderRadius: '6px', color: '#FFFFFF', fontWeight: 700, fontSize: '15px', cursor: loading ? 'wait' : 'pointer', transition: 'background 0.15s' }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: '#6B6B6B', fontSize: '14px', margin: '20px 0 0' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#026CDF', fontWeight: 600, textDecoration: 'none' }}>Create Account</Link>
          </p>

          {/* Demo hint */}
          {/* <div style={{ marginTop: '20px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '8px', padding: '12px 14px', textAlign: 'center' }}>
            <p style={{ color: '#1E40AF', fontSize: '12px', margin: '0 0 2px', fontWeight: 600 }}>Admin Demo Account</p>
            <p style={{ color: '#1E40AF', fontSize: '11px', margin: 0, fontFamily: 'monospace' }}>admin@tickapp.com / Admin@1234</p>
          </div> */}
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }} onClick={() => setShowForgot(false)}>
          <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '28px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ color: '#1F1F1F', fontSize: '18px', fontWeight: 700, margin: 0 }}>Reset Password</h3>
              <button onClick={() => setShowForgot(false)} style={{ background: '#F5F5F5', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} color="#6B6B6B" />
              </button>
            </div>

            {forgotSent ? (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <CheckCircle size={48} color="#16A34A" style={{ marginBottom: '12px' }} />
                <p style={{ color: '#1F1F1F', fontWeight: 600, fontSize: '15px', margin: '0 0 6px' }}>Check your email</p>
                <p style={{ color: '#6B6B6B', fontSize: '13px', margin: '0 0 20px', lineHeight: '1.5' }}>
                  If an account exists for <strong>{forgotEmail}</strong>, a reset link has been sent.
                </p>
                <button onClick={() => setShowForgot(false)} style={{ padding: '11px 24px', background: '#026CDF', border: 'none', borderRadius: '6px', color: '#FFFFFF', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword}>
                <p style={{ color: '#6B6B6B', fontSize: '13px', margin: '0 0 16px', lineHeight: '1.5' }}>
                  Enter your email and we'll send you a link to reset your password.
                </p>
                <label style={{ display: 'block', color: '#1F1F1F', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Email Address</label>
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                  <Mail size={16} color="#6B6B6B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    style={{ width: '100%', padding: '12px 12px 12px 40px', background: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: '6px', color: '#1F1F1F', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = '#026CDF'}
                    onBlur={e => e.target.style.borderColor = '#E5E5E5'}
                  />
                </div>
                <button type="submit" disabled={forgotLoading} style={{ width: '100%', padding: '12px', background: '#026CDF', border: 'none', borderRadius: '6px', color: '#FFFFFF', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
                  {forgotLoading ? 'Sending…' : 'Send Reset Email'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
