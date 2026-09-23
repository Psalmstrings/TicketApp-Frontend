import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Check, Plus, Minus, Trash2,
  Upload, Image as ImageIcon, Calendar, MapPin, Tag,
  ChevronDown, Loader
} from 'lucide-react';
import api from '../../lib/axios.js';
import AppLayout from '../../components/layout/AppLayout.jsx';

const CATEGORIES = ['Music', 'Sports', 'Conference', 'Arts', 'Food', 'Comedy', 'Tech', 'Other'];

const STEPS = ['Event Details', 'Ticket Types', 'Media', 'Publish'];

function StepIndicator({ current }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', background: '#1a1a2e', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      {STEPS.map((label, i) => (
        <React.Fragment key={i}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: i < STEPS.length - 1 ? 'none' : '1' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 700,
              background: i < current ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : i === current ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.08)',
              color: i <= current ? '#fff' : '#64748b',
              border: i === current ? '2px solid rgba(99,102,241,0.5)' : '2px solid transparent',
              boxSizing: 'border-box',
            }}>
              {i < current ? <Check size={13} /> : i + 1}
            </div>
            <span style={{ fontSize: '9px', color: i === current ? '#6366f1' : '#475569', marginTop: '4px', whiteSpace: 'nowrap', fontWeight: i === current ? 600 : 400 }}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{ flex: 1, height: '2px', background: i < current ? 'linear-gradient(90deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.08)', margin: '0 4px 16px' }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function InputField({ label, required, ...props }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      <input
        {...props}
        style={{
          width: '100%',
          padding: '12px 14px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          color: '#e2e8f0',
          fontSize: '14px',
          outline: 'none',
          boxSizing: 'border-box',
          fontFamily: 'Inter, sans-serif',
          ...props.style,
        }}
      />
    </div>
  );
}

function Toggle({ label, checked, onChange, description }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div>
        <p style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 500, margin: '0 0 2px' }}>{label}</p>
        {description && <p style={{ color: '#64748b', fontSize: '12px', margin: 0 }}>{description}</p>}
      </div>
      <div
        onClick={onChange}
        style={{
          width: '44px',
          height: '24px',
          borderRadius: '12px',
          background: checked ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.1)',
          cursor: 'pointer',
          position: 'relative',
          transition: 'background 0.2s',
          flexShrink: 0,
        }}
      >
        <div style={{
          position: 'absolute',
          top: '3px',
          left: checked ? '23px' : '3px',
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          background: '#fff',
          transition: 'left 0.2s',
        }} />
      </div>
    </div>
  );
}

const defaultTicketType = () => ({
  _key: Math.random().toString(36).slice(2),
  name: '',
  description: '',
  price: 0,
  quantity: 100,
  section: 'General',
  row: '',
  transferable: true,
  resellable: true,
});

export default function CreateEventPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    category: 'Music',
    description: '',
    venue: '',
    entranceInfo: '',
    startDate: '',
    startTime: '19:00',
    endDate: '',
    doorsOpen: '',
    timeAnnounced: true,
    multiDay: false,
    countdownEnabled: true,
  });

  const [ticketTypes, setTicketTypes] = useState([defaultTicketType()]);
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const setF = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const setTT = (idx, key, val) => setTicketTypes(prev => {
    const updated = [...prev];
    updated[idx] = { ...updated[idx], [key]: val };
    return updated;
  });

  const handleImageUpload = async (file) => {
    if (!file) return;
    setCoverPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await api.post('/upload/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setCoverImage(data.data);
    } catch (err) {
      setError('Image upload failed. Continuing with local preview.');
    } finally {
      setUploading(false);
    }
  };

  const validateStep = () => {
    if (step === 0) {
      if (!form.title.trim()) return 'Event name is required.';
      if (!form.venue.trim()) return 'Venue is required.';
      if (!form.startDate) return 'Start date is required.';
    }
    if (step === 1) {
      if (ticketTypes.some(tt => !tt.name.trim())) return 'All ticket types need a name.';
      if (ticketTypes.some(tt => !tt.quantity || tt.quantity < 1)) return 'Quantity must be at least 1.';
    }
    return '';
  };

  const next = () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError('');
    setStep(s => s + 1);
  };

  const handlePublish = async () => {
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        ...form,
        ticketTypes: ticketTypes.map(tt => ({
          name: tt.name,
          description: tt.description,
          price: 0,
          quantity: Number(tt.quantity),
          availableQuantity: Number(tt.quantity),
          section: tt.section || 'General',
          row: tt.row || '',
          transferable: tt.transferable,
          resellable: tt.resellable,
        })),
        coverImage: coverImage || null,
      };
      await api.post('/events', payload);
      navigate('/my-events');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish event');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a' }}>
      {/* Top Header */}
      <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #2d1b69)', padding: '48px 16px 0' }}>
        <button onClick={() => step > 0 ? setStep(s => s - 1) : navigate(-1)}
          style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginBottom: '12px' }}>
          <ArrowLeft size={20} color="#fff" />
        </button>
        <h1 style={{ color: '#fff', fontSize: '20px', fontWeight: 800, margin: '0 0 16px' }}>
          Create Ticket Manually
        </h1>
      </div>

      <StepIndicator current={step} />

      <div style={{ padding: '20px 16px', paddingBottom: '100px' }}>
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', padding: '12px 14px', marginBottom: '16px', color: '#f87171', fontSize: '13px' }}>
            {error}
          </div>
        )}

        {/* Step 0: Event Details */}
        {step === 0 && (
          <>
            <InputField label="Event Name" required value={form.title} onChange={e => setF('title', e.target.value)} placeholder="e.g. Summer Music Festival" />

            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Category <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                value={form.category}
                onChange={e => setF('category', e.target.value)}
                style={{ width: '100%', padding: '12px 14px', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <InputField label="Date & Start Time" required type="datetime-local" value={`${form.startDate}T${form.startTime}`}
              onChange={e => {
                const [d, t] = e.target.value.split('T');
                setF('startDate', d);
                setF('startTime', t || '19:00');
              }} />

            <InputField label="Doors Open" type="time" value={form.doorsOpen} onChange={e => setF('doorsOpen', e.target.value)} />

            <div style={{ background: '#1a1a2e', borderRadius: '16px', padding: '16px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Toggle label="Time TBA" description="Announce time later" checked={!form.timeAnnounced} onChange={() => setF('timeAnnounced', !form.timeAnnounced)} />
              <Toggle label="Multi-day Event" description="Event spans multiple days" checked={form.multiDay} onChange={() => setF('multiDay', !form.multiDay)} />
              <Toggle label="Show Countdown" description="Display countdown timer" checked={form.countdownEnabled} onChange={() => setF('countdownEnabled', !form.countdownEnabled)} />
            </div>

            {form.multiDay && (
              <InputField label="End Date" type="date" value={form.endDate} onChange={e => setF('endDate', e.target.value)} />
            )}

            <InputField label="Venue" required value={form.venue} onChange={e => setF('venue', e.target.value)} placeholder="e.g. Eko Hotel, Lagos" />
            <InputField label="Entrance Info" value={form.entranceInfo} onChange={e => setF('entranceInfo', e.target.value)} placeholder="e.g. Gate 3, Main Entrance" />

            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Description
              </label>
              <textarea
                value={form.description}
                onChange={e => setF('description', e.target.value)}
                placeholder="Tell people what to expect at your event..."
                rows={4}
                style={{ width: '100%', padding: '12px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'Inter, sans-serif' }}
              />
            </div>
          </>
        )}

        {/* Step 1: Ticket Types */}
        {step === 1 && (
          <>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '16px', margin: '0 0 16px' }}>
              All tickets are free. Define ticket categories for your event.
            </p>
            {ticketTypes.map((tt, idx) => (
              <div key={tt._key} style={{ background: '#1a1a2e', borderRadius: '16px', padding: '16px', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h4 style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 600, margin: 0 }}>
                    Ticket Type {idx + 1}
                  </h4>
                  {ticketTypes.length > 1 && (
                    <button
                      onClick={() => setTicketTypes(prev => prev.filter((_, i) => i !== idx))}
                      style={{ background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer' }}>
                      <Trash2 size={14} color="#ef4444" />
                    </button>
                  )}
                </div>
                <InputField label="Name" required value={tt.name} onChange={e => setTT(idx, 'name', e.target.value)} placeholder="e.g. VIP, General, Early Bird" />
                <InputField label="Description" value={tt.description} onChange={e => setTT(idx, 'description', e.target.value)} placeholder="Brief description..." />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Price
                    </label>
                    <div style={{ padding: '12px 14px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px', color: '#10b981', fontWeight: 600, fontSize: '14px' }}>
                      FREE
                    </div>
                  </div>
                  <InputField label="Quantity" type="number" min="1" value={tt.quantity} onChange={e => setTT(idx, 'quantity', e.target.value)} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <InputField label="Section" value={tt.section} onChange={e => setTT(idx, 'section', e.target.value)} placeholder="General" />
                  <InputField label="Row (optional)" value={tt.row} onChange={e => setTT(idx, 'row', e.target.value)} placeholder="GA" />
                </div>

                <Toggle label="Transferable" checked={tt.transferable} onChange={() => setTT(idx, 'transferable', !tt.transferable)} />
                <Toggle label="Resellable" checked={tt.resellable} onChange={() => setTT(idx, 'resellable', !tt.resellable)} />
              </div>
            ))}
            <button
              onClick={() => setTicketTypes(prev => [...prev, defaultTicketType()])}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '14px', background: 'rgba(99,102,241,0.08)', border: '1px dashed rgba(99,102,241,0.4)', borderRadius: '14px', color: '#6366f1', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
              <Plus size={18} />
              Add Ticket Type
            </button>
          </>
        )}

        {/* Step 2: Media */}
        {step === 2 && (
          <>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '20px' }}>
              Add a cover image for your event (recommended: 1200×628px)
            </p>
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                border: '2px dashed rgba(99,102,241,0.4)',
                borderRadius: '20px',
                padding: '40px 20px',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'rgba(99,102,241,0.04)',
                marginBottom: '16px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {coverPreview ? (
                <img src={coverPreview} alt="Cover preview" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px' }} />
              ) : (
                <>
                  <div style={{ width: '56px', height: '56px', background: 'rgba(99,102,241,0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                    {uploading ? <Loader size={24} color="#6366f1" style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={24} color="#6366f1" />}
                  </div>
                  <p style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '15px', margin: '0 0 6px' }}>
                    {uploading ? 'Uploading...' : 'Upload Cover Image'}
                  </p>
                  <p style={{ color: '#64748b', fontSize: '12px', margin: 0 }}>
                    JPG, PNG or WEBP · Max 10MB
                  </p>
                </>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => handleImageUpload(e.target.files?.[0])}
              />
            </div>
            {coverPreview && (
              <button
                onClick={() => { setCoverPreview(''); setCoverImage(null); }}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '13px', padding: '0 0 16px' }}>
                <Trash2 size={14} />
                Remove image
              </button>
            )}
            <p style={{ color: '#475569', fontSize: '12px', margin: 0 }}>
              You can skip this step — a gradient placeholder will be used.
            </p>
          </>
        )}

        {/* Step 3: Publish */}
        {step === 3 && (
          <>
            <h3 style={{ color: '#e2e8f0', fontSize: '16px', fontWeight: 700, margin: '0 0 16px' }}>Event Summary</h3>

            {coverPreview && (
              <img src={coverPreview} alt="Cover" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '16px', marginBottom: '16px' }} />
            )}

            <div style={{ background: '#1a1a2e', borderRadius: '16px', padding: '16px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
              {[
                { label: 'Event Name', value: form.title },
                { label: 'Category', value: form.category },
                { label: 'Date', value: form.startDate },
                { label: 'Time', value: form.startTime },
                { label: 'Venue', value: form.venue },
                { label: 'Entrance', value: form.entranceInfo || '—' },
              ].map((item, i, arr) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <span style={{ color: '#64748b', fontSize: '13px' }}>{item.label}</span>
                  <span style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 500, maxWidth: '200px', textAlign: 'right' }}>{item.value}</span>
                </div>
              ))}
            </div>

            <h4 style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 600, margin: '0 0 10px' }}>
              Ticket Types ({ticketTypes.length})
            </h4>
            {ticketTypes.map((tt, i) => (
              <div key={tt._key} style={{ background: '#1a1a2e', borderRadius: '12px', padding: '12px 14px', marginBottom: '8px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#e2e8f0', fontWeight: 500, fontSize: '13px' }}>{tt.name || `Type ${i+1}`}</span>
                <span style={{ color: '#10b981', fontWeight: 600, fontSize: '13px' }}>FREE · {tt.quantity} seats</span>
              </div>
            ))}

            <button
              onClick={handlePublish}
              disabled={submitting}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '16px', background: submitting ? '#374151' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '14px', color: '#fff', fontWeight: 700, fontSize: '16px', cursor: submitting ? 'wait' : 'pointer', marginTop: '20px' }}
            >
              {submitting ? <><Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> Publishing...</> : <><Check size={18} /> Publish Event</>}
            </button>
          </>
        )}
      </div>

      {/* Bottom Nav */}
      {step < 3 && (
        <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '430px', background: '#1a1a2e', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '12px 16px', display: 'flex', gap: '10px', boxSizing: 'border-box' }}>
          {step > 0 && (
            <button
              onClick={() => { setStep(s => s - 1); setError(''); }}
              style={{ flex: 1, padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', color: '#e2e8f0', fontWeight: 600, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <ArrowLeft size={16} />
              Back
            </button>
          )}
          <button
            onClick={next}
            style={{ flex: 2, padding: '14px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: '14px', color: '#fff', fontWeight: 600, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            Next
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
