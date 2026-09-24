import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout.jsx';
import TicketmasterSpinner from '../../components/ui/TicketmasterSpinner.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import api from '../../lib/axios.js';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Plus,
  Trash2,
  Upload,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Image as ImageIcon,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const CATEGORIES = ['Concerts', 'Sports', 'Arts & Theater', 'Family', 'Conference', 'Comedy', 'Festival'];

const STEPS = [
  { id: 0, label: 'Details', desc: 'Title & Venue' },
  { id: 1, label: 'Pricing', desc: 'Ticket Tiers' },
  { id: 2, label: 'Media', desc: 'Banner & Map' },
  { id: 3, label: 'Publish', desc: 'Review & Go Live' },
];

const defaultTicketType = () => ({
  _key: Math.random().toString(36).slice(2),
  name: 'General Admission',
  description: 'Standard event entry ticket',
  price: 50,
  quantity: 200,
  section: 'GA',
  row: 'GA',
  transferable: true,
  resellable: true,
});

export default function CreateEventPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Details
  const [form, setForm] = useState({
    title: '',
    category: 'Concerts',
    description: '',
    venue: '',
    address: '',
    entranceInfo: '',
    startDate: '',
    startTime: '19:30',
    doorsOpen: '17:30',
    timeAnnounced: true,
    multiDay: false,
    endDate: '',
    endTime: '',
    countdownEnabled: true,
    latitude: '',
    longitude: '',
  });

  // Step 2: Pricing / Ticket Tiers
  const [ticketTypes, setTicketTypes] = useState([defaultTicketType()]);

  // Step 3: Media
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [seatMapUrl, setSeatMapUrl] = useState('');
  const [uploadingCover, setUploadingCover] = useState(false);
  const coverFileRef = useRef();
  const seatMapFileRef = useRef();

  const isApproved = user?.status === 'APPROVED' || user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  const updateForm = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const updateTicketType = (index, key, val) => {
    setTicketTypes((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [key]: val };
      return copy;
    });
  };

  const addTicketType = () => {
    setTicketTypes((prev) => [
      ...prev,
      {
        _key: Math.random().toString(36).slice(2),
        name: 'VIP Experience',
        description: 'Priority entry and exclusive lounge access',
        price: 150,
        quantity: 50,
        section: 'VIP',
        row: 'A',
        transferable: true,
        resellable: true,
      },
    ]);
  };

  const removeTicketType = (index) => {
    if (ticketTypes.length <= 1) return;
    setTicketTypes((prev) => prev.filter((_, i) => i !== index));
  };

  // Image upload through server API
  const handleUploadImage = async (file, type) => {
    if (!file) return;
    if (type === 'cover') setUploadingCover(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await api.post('/upload/image', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const url = data.data?.url || data.url;
      if (type === 'cover') setCoverImageUrl(url);
      else setSeatMapUrl(url);
      toast.success('Image uploaded successfully!');
    } catch (err) {
      toast.error('Upload failed. You can provide a direct image URL or use fallback.');
    } finally {
      if (type === 'cover') setUploadingCover(false);
    }
  };

  // Step Validation
  const validateStep = () => {
    if (currentStep === 0) {
      if (!form.title.trim()) return 'Event title is required.';
      if (!form.venue.trim()) return 'Venue is required.';
      if (!form.startDate) return 'Start date is required.';
    }
    if (currentStep === 1) {
      if (ticketTypes.length === 0) return 'Add at least one ticket tier.';
      if (ticketTypes.some((t) => !t.name.trim())) return 'All ticket tiers require a name.';
      if (ticketTypes.some((t) => Number(t.quantity) <= 0)) return 'Quantity must be at least 1.';
    }
    return '';
  };

  const handleNext = () => {
    const err = validateStep();
    if (err) {
      setError(err);
      toast.error(err);
      return;
    }
    setError('');
    setCurrentStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const handleBack = () => {
    setError('');
    setCurrentStep((s) => Math.max(0, s - 1));
  };

  // Publish Event
  const handlePublish = async (status = 'PUBLISHED') => {
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        ...form,
        coverImageUrl: coverImageUrl || 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200&auto=format&fit=crop&q=80',
        seatMapUrl: seatMapUrl || null,
        ticketTypes: ticketTypes.map((t) => ({
          name: t.name,
          description: t.description,
          price: Number(t.price),
          quantity: Number(t.quantity),
          section: t.section,
          row: t.row,
          transferable: t.transferable,
          resellable: t.resellable,
        })),
        status: isApproved ? status : 'PENDING_APPROVAL',
      };

      await api.post('/events', payload);
      toast.success(isApproved ? 'Event published live!' : 'Event submitted for admin approval!');
      navigate('/my-events');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish event.');
      toast.error(err.response?.data?.message || 'Failed to publish event.');
    } finally {
      setSubmitting(false);
    }
  };

  const totalCapacity = ticketTypes.reduce((acc, t) => acc + (Number(t.quantity) || 0), 0);
  const potentialGross = ticketTypes.reduce((acc, t) => acc + (Number(t.quantity) || 0) * (Number(t.price) || 0), 0);

  return (
    <AppLayout>
      <div className="tm-container" style={{ padding: '32px 20px', maxWidth: '840px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1F1F1F', margin: '0 0 4px 0' }}>
              Create Event Manually
            </h1>
            <p style={{ fontSize: '13px', color: '#6B6B6B', margin: 0 }}>
              Step {currentStep + 1} of 4: {STEPS[currentStep].label} ({STEPS[currentStep].desc})
            </p>
          </div>
          <Link to="/for-you" className="btn-ghost" style={{ fontSize: '13px' }}>
            Exit Wizard
          </Link>
        </div>

        {/* Step Progress Bar */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            border: '1px solid #E5E5E5',
            padding: '16px 20px',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {STEPS.map((s, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;
            return (
              <React.Fragment key={s.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: isCompleted ? '#059669' : isCurrent ? '#026CDF' : '#E5E5E5',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      fontWeight: 700,
                    }}
                  >
                    {isCompleted ? <Check size={16} /> : idx + 1}
                  </div>
                  <div className="desktop-only">
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: isCurrent ? 700 : 500, color: isCurrent ? '#026CDF' : '#1F1F1F' }}>
                      {s.label}
                    </p>
                    <p style={{ margin: 0, fontSize: '11px', color: '#8C8C8C' }}>{s.desc}</p>
                  </div>
                </div>

                {idx < STEPS.length - 1 && (
                  <div
                    style={{
                      flex: 1,
                      height: '2px',
                      backgroundColor: isCompleted ? '#059669' : '#E5E5E5',
                      margin: '0 12px',
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Form Container */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E5E5', padding: '28px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
          {error && (
            <div style={{ marginBottom: '20px', padding: '12px 16px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', color: '#DC2626', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {/* STEP 1: EVENT DETAILS */}
          {currentStep === 0 && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <label className="input-label">Event Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Coldplay - Music of the Spheres Tour"
                  value={form.title}
                  onChange={(e) => updateForm('title', e.target.value)}
                  className="input"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label className="input-label">Entertainment Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => updateForm('category', e.target.value)}
                    className="input"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="input-label">Event Start Date *</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => updateForm('startDate', e.target.value)}
                    className="input"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label className="input-label">Start Time</label>
                  <input
                    type="time"
                    value={form.startTime}
                    onChange={(e) => updateForm('startTime', e.target.value)}
                    className="input"
                    disabled={!form.timeAnnounced}
                  />
                </div>

                <div>
                  <label className="input-label">Doors Open</label>
                  <input
                    type="time"
                    value={form.doorsOpen}
                    onChange={(e) => updateForm('doorsOpen', e.target.value)}
                    className="input"
                    disabled={!form.timeAnnounced}
                  />
                </div>
              </div>

              {/* Toggles */}
              <div style={{ backgroundColor: '#F8F9FA', borderRadius: '10px', padding: '16px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={!form.timeAnnounced}
                    onChange={() => updateForm('timeAnnounced', !form.timeAnnounced)}
                  />
                  <span>Time Not Announced (TBA) — Check if performance schedule is pending</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.multiDay}
                    onChange={() => updateForm('multiDay', !form.multiDay)}
                  />
                  <span>Multi-day Festival / Weekend Tournament</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.countdownEnabled}
                    onChange={() => updateForm('countdownEnabled', !form.countdownEnabled)}
                  />
                  <span>Display Live Ticket Countdown on Event Page</span>
                </label>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label className="input-label">Venue Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Wembley Stadium, Madison Square Garden"
                  value={form.venue}
                  onChange={(e) => updateForm('venue', e.target.value)}
                  className="input"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label className="input-label">Address / City</label>
                  <input
                    type="text"
                    placeholder="e.g. London, UK or Los Angeles, CA"
                    value={form.address}
                    onChange={(e) => updateForm('address', e.target.value)}
                    className="input"
                  />
                </div>

                <div>
                  <label className="input-label">Entrance / Gate Info</label>
                  <input
                    type="text"
                    placeholder="e.g. Gate 4, Olympic Way"
                    value={form.entranceInfo}
                    onChange={(e) => updateForm('entranceInfo', e.target.value)}
                    className="input"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label className="input-label">Event Description & Lineup</label>
                <textarea
                  rows={4}
                  placeholder="Describe your event, featured artists, special guest performers, and venue entry policies..."
                  value={form.description}
                  onChange={(e) => updateForm('description', e.target.value)}
                  className="input"
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>
          )}

          {/* STEP 2: PRICING & TICKET TIERS */}
          {currentStep === 1 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1F1F1F', margin: 0 }}>Configure Ticket Tiers</h3>
                  <p style={{ fontSize: '12px', color: '#6B6B6B', margin: 0 }}>Create reserved seating, VIP lounges, or General Admission</p>
                </div>
                <button
                  type="button"
                  onClick={addTicketType}
                  className="btn-outline"
                  style={{ padding: '6px 14px', fontSize: '13px' }}
                >
                  <Plus size={14} /> Add Tier
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                {ticketTypes.map((tt, idx) => (
                  <div
                    key={tt._key}
                    style={{
                      border: '1px solid #E5E5E5',
                      borderRadius: '12px',
                      padding: '16px',
                      backgroundColor: '#FAFAFA',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#026CDF' }}>
                        Tier #{idx + 1}
                      </span>
                      {ticketTypes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTicketType(idx)}
                          style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                      <div>
                        <label className="input-label">Tier Name *</label>
                        <input
                          type="text"
                          value={tt.name}
                          onChange={(e) => updateTicketType(idx, 'name', e.target.value)}
                          className="input"
                          placeholder="e.g. VIP Front Row"
                        />
                      </div>

                      <div>
                        <label className="input-label">Price ($) *</label>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={tt.price}
                          onChange={(e) => updateTicketType(idx, 'price', e.target.value)}
                          className="input"
                        />
                      </div>

                      <div>
                        <label className="input-label">Quantity Available *</label>
                        <input
                          type="number"
                          min="1"
                          value={tt.quantity}
                          onChange={(e) => updateTicketType(idx, 'quantity', e.target.value)}
                          className="input"
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label className="input-label">Section Tag</label>
                        <input
                          type="text"
                          value={tt.section}
                          onChange={(e) => updateTicketType(idx, 'section', e.target.value)}
                          className="input"
                          placeholder="GA, Sec 102, Floor"
                        />
                      </div>

                      <div>
                        <label className="input-label">Row Tag</label>
                        <input
                          type="text"
                          value={tt.row}
                          onChange={(e) => updateTicketType(idx, 'row', e.target.value)}
                          className="input"
                          placeholder="Row A, GA"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Calculation Card */}
              <div style={{ backgroundColor: '#F8F9FA', borderRadius: '12px', padding: '16px 20px', border: '1px solid #E5E5E5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase' }}>Total Capacity</span>
                  <p style={{ margin: '2px 0 0', fontSize: '18px', fontWeight: 800, color: '#1F1F1F' }}>{totalCapacity} Tickets</p>
                </div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase' }}>Est. Total Gross</span>
                  <p style={{ margin: '2px 0 0', fontSize: '18px', fontWeight: 800, color: '#026CDF' }}>${potentialGross.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: MEDIA & ARTWORK */}
          {currentStep === 2 && (
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1F1F1F', margin: '0 0 16px 0' }}>
                Upload Event Banner & Seat Map
              </h3>

              {/* Banner Upload Box */}
              <div style={{ marginBottom: '24px' }}>
                <label className="input-label">Event Billboard / Banner Artwork</label>
                <div
                  onClick={() => coverFileRef.current?.click()}
                  style={{
                    border: '2px dashed #026CDF',
                    borderRadius: '12px',
                    padding: '30px 20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: '#F0F6FE',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {coverImageUrl ? (
                    <div>
                      <img src={coverImageUrl} alt="Banner Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }} />
                      <p style={{ marginTop: '10px', fontSize: '12px', color: '#026CDF', fontWeight: 600 }}>Click to replace banner image</p>
                    </div>
                  ) : (
                    <div>
                      {uploadingCover ? (
                        <TicketmasterSpinner size="md" message="Uploading to Cloudinary..." />
                      ) : (
                        <>
                          <Upload size={32} color="#026CDF" style={{ marginBottom: '8px' }} />
                          <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 700, color: '#1F1F1F' }}>
                            Upload High-Resolution Artwork
                          </p>
                          <p style={{ margin: 0, fontSize: '12px', color: '#6B6B6B' }}>
                            Recommended 16:9 ratio (1200×675). JPG, PNG, WEBP.
                          </p>
                        </>
                      )}
                    </div>
                  )}

                  <input
                    ref={coverFileRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleUploadImage(e.target.files?.[0], 'cover')}
                  />
                </div>

                <div style={{ marginTop: '10px' }}>
                  <label className="input-label">Or Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={coverImageUrl}
                    onChange={(e) => setCoverImageUrl(e.target.value)}
                    className="input"
                  />
                </div>
              </div>

              {/* Optional Seat Map URL */}
              <div>
                <label className="input-label">Seat Map / Stadium Layout Diagram (Optional)</label>
                <input
                  type="url"
                  placeholder="https://.../seatmap.png"
                  value={seatMapUrl}
                  onChange={(e) => setSeatMapUrl(e.target.value)}
                  className="input"
                />
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & PUBLISH */}
          {currentStep === 3 && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1F1F1F', margin: '0 0 16px 0' }}>
                Review Event Summary
              </h3>

              {/* Preview Card */}
              <div style={{ borderRadius: '14px', border: '1px solid #E5E5E5', overflow: 'hidden', marginBottom: '24px' }}>
                <img
                  src={coverImageUrl || 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200&auto=format&fit=crop&q=80'}
                  alt=""
                  style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                />

                <div style={{ padding: '20px' }}>
                  <span style={{ backgroundColor: '#026CDF', color: '#FFFFFF', fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                    {form.category}
                  </span>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1F1F1F', margin: '8px 0 4px 0' }}>
                    {form.title}
                  </h2>
                  <p style={{ fontSize: '13px', color: '#6B6B6B', margin: '0 0 16px 0' }}>
                    📍 {form.venue} {form.address ? `• ${form.address}` : ''} | 📅 {form.startDate} at {form.startTime}
                  </p>

                  <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 8px 0' }}>Ticket Tiers:</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
                    {ticketTypes.map((t) => (
                      <div key={t._key} style={{ padding: '8px 12px', backgroundColor: '#F8F9FA', borderRadius: '8px', border: '1px solid #E5E5E5' }}>
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: 700 }}>{t.name}</p>
                        <p style={{ margin: 0, fontSize: '12px', color: '#026CDF', fontWeight: 600 }}>${t.price} ({t.quantity} tickets)</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {!isApproved && (
                <div style={{ marginBottom: '20px', padding: '14px 16px', backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <AlertCircle size={20} color="#D97706" style={{ flexShrink: 0 }} />
                  <p style={{ margin: 0, fontSize: '13px', color: '#92400E' }}>
                    Notice: Your account is currently <strong>Pending Approval</strong>. Submitting this event will send it for review by an administrator before it is published live.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Control Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #E5E5E5' }}>
            {currentStep > 0 ? (
              <button type="button" onClick={handleBack} className="btn-secondary" style={{ padding: '10px 20px' }}>
                <ChevronLeft size={16} /> Back
              </button>
            ) : (
              <div />
            )}

            {currentStep < STEPS.length - 1 ? (
              <button type="button" onClick={handleNext} className="btn-primary" style={{ padding: '10px 24px' }}>
                Next Step <ChevronRight size={16} />
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handlePublish('DRAFT')}
                  className="btn-secondary"
                  style={{ padding: '12px 20px' }}
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handlePublish('PUBLISHED')}
                  className="btn-primary"
                  style={{ padding: '12px 24px' }}
                >
                  {submitting ? (
                    <TicketmasterSpinner size="sm" color="#FFFFFF" message="Publishing..." />
                  ) : isApproved ? (
                    'Publish Event Live'
                  ) : (
                    'Submit for Approval'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
