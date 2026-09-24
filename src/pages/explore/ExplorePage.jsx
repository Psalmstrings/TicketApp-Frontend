import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout.jsx';
import EventCard from '../../components/events/EventCard.jsx';
import EventCardSkeleton from '../../components/events/EventCardSkeleton.jsx';
import api from '../../lib/axios.js';
import { Search, MapPin, Calendar, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';

const CATEGORIES = ['All', 'Concerts', 'Sports', 'Arts & Theater', 'Family'];
const CITIES = ['All Cities', 'New York', 'Los Angeles', 'London', 'Lagos', 'Chicago', 'Houston', 'Atlanta'];
const DATES = [
  { label: 'All Dates', value: '' },
  { label: 'Today', value: 'today' },
  { label: 'This Weekend', value: 'this_weekend' },
  { label: 'This Month', value: 'this_month' },
];

export default function ExplorePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [city, setCity] = useState('All Cities');
  const [date, setDate] = useState('');
  const [sort, setSort] = useState('date_asc');

  // Parse query params on load or change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('search') || '';
    const cat = params.get('category') || 'All';
    const c = params.get('city') || 'All Cities';
    const d = params.get('date') || '';

    setSearch(q);
    setCategory(cat);
    setCity(c);
    setDate(d);

    fetchFilteredEvents(q, cat, c, d, sort);
  }, [location.search, sort]);

  const fetchFilteredEvents = async (q, cat, c, d, s) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.append('search', q.trim());
      if (cat && cat !== 'All') params.append('category', cat);
      if (c && c !== 'All Cities') params.append('city', c);
      if (d) params.append('date', d);
      if (s === 'date_desc') params.append('sort', 'date_desc');

      const { data } = await api.get(`/events?${params.toString()}`);
      const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      setEvents(list);
    } catch (err) {
      console.error(err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilter = (newCategory, newCity, newDate) => {
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (newCategory && newCategory !== 'All') params.set('category', newCategory);
    if (newCity && newCity !== 'All Cities') params.set('city', newCity);
    if (newDate) params.set('date', newDate);
    navigate(`/explore?${params.toString()}`);
  };

  const clearAllFilters = () => {
    setSearch('');
    setCategory('All');
    setCity('All Cities');
    setDate('');
    navigate('/explore');
  };

  const hasActiveFilters = search || (category && category !== 'All') || (city && city !== 'All Cities') || date;

  return (
    <AppLayout>
      {/* Header Search & Filter Bar */}
      <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E5E5', padding: '24px 0 16px' }}>
        <div className="tm-container">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1F1F1F', margin: 0 }}>
                {category !== 'All' ? `${category} Tickets` : 'Discover Live Events'}
              </h1>
              <p style={{ fontSize: '13px', color: '#6B6B6B', margin: '4px 0 0 0' }}>
                {city !== 'All Cities' ? `Showing tickets in ${city}` : 'Find concerts, sports games, and Broadway theatre'}
              </p>
            </div>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', color: '#6B6B6B' }}>Sort:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="input"
                style={{ width: 'auto', padding: '8px 30px 8px 12px', fontSize: '13px' }}
              >
                <option value="date_asc">Date: Upcoming First</option>
                <option value="date_desc">Date: Furthest Out</option>
              </select>
            </div>
          </div>

          {/* Filter Controls Row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', minWidth: '240px', flex: 1 }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#8C8C8C' }} />
              <input
                type="text"
                placeholder="Search event, artist or venue"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleApplyFilter(category, city, date);
                }}
                className="input"
                style={{ paddingLeft: '36px', paddingRight: '12px' }}
              />
            </div>

            {/* City Dropdown */}
            <div style={{ minWidth: '150px' }}>
              <select
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  handleApplyFilter(category, e.target.value, date);
                }}
                className="input"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Dropdown */}
            <div style={{ minWidth: '140px' }}>
              <select
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  handleApplyFilter(category, city, e.target.value);
                }}
                className="input"
              >
                {DATES.map((d) => (
                  <option key={d.label} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="btn-ghost"
                style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#DC2626' }}
              >
                <X size={14} /> Clear Filters
              </button>
            )}
          </div>

          {/* Category Chips Bar */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingTop: '16px', scrollbarWidth: 'none' }}>
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setCategory(cat);
                    handleApplyFilter(cat, city, date);
                  }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    border: isSelected ? '1.5px solid #026CDF' : '1px solid #E5E5E5',
                    backgroundColor: isSelected ? '#EBF3FD' : '#FFFFFF',
                    color: isSelected ? '#026CDF' : '#4B4B4B',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Content Area */}
      <div className="tm-container" style={{ padding: '32px 20px' }}>
        {/* Results Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#6B6B6B', margin: 0 }}>
            {loading ? 'Searching events...' : `${events.length} event${events.length === 1 ? '' : 's'} found`}
          </p>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <EventCardSkeleton key={n} />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E5E5E5',
              maxWidth: '500px',
              margin: '0 auto',
            }}
          >
            <Search size={44} color="#D1D5DB" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1F1F1F', margin: '0 0 6px 0' }}>
              No matching events found
            </h3>
            <p style={{ fontSize: '13px', color: '#6B6B6B', margin: '0 0 20px 0', lineHeight: 1.5 }}>
              We couldn't find any events matching your selected filters. Try broadening your location or selecting "All Dates".
            </p>
            <button className="btn-primary" onClick={clearAllFilters}>
              Reset Search Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {events.map((ev) => (
              <EventCard key={ev._id || ev.id} event={ev} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
