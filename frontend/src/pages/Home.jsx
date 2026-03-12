import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const CONDITIONS = ['All', 'New', 'Like New', 'Good', 'Fair']

const conditionStyle = {
  'New':      { background: '#d1fae5', color: '#065f46' },
  'Like New': { background: '#dbeafe', color: '#1e40af' },
  'Good':     { background: '#fef9c3', color: '#854d0e' },
  'Fair':     { background: '#ffedd5', color: '#9a3412' },
}

function ListingCard({ listing }) {
  const cStyle = conditionStyle[listing.condition] || { background: '#f1f5f9', color: '#475569' }
  return (
    <Link
      to={`/listings/${listing._id}`}
      style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden', transition: 'box-shadow .2s, transform .2s' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.1)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}
    >
      {/* Image */}
      <div style={{ aspectRatio: '4/3', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {listing.images?.[0] ? (
          <img src={listing.images[0]} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: '#94a3b8' }}>
            <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span style={{ fontSize: 12 }}>No image</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', lineHeight: 1.4, flex: 1,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {listing.title}
          </span>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#4f46e5', whiteSpace: 'nowrap' }}>
            ${listing.price}
          </span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 'auto' }}>
          <span style={{ fontSize: 12, padding: '2px 10px', borderRadius: 999, fontWeight: 500, ...cStyle }}>
            {listing.condition}
          </span>
          {listing.course && (
            <span style={{ fontSize: 12, padding: '2px 10px', borderRadius: 999, fontWeight: 500, background: '#f1f5f9', color: '#64748b' }}>
              {listing.course}
            </span>
          )}
        </div>
        <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
          <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          {listing.seller?.username}
        </p>
      </div>
    </Link>
  )
}

export default function Home() {
  const { user } = useAuth()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ keyword: '', course: '', subject: '', condition: '', minPrice: '', maxPrice: '' })

  const fetchListings = async (params = {}) => {
    setLoading(true)
    try {
      const query = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v !== 'All'))
      const { data } = await api.get('/listings', { params: query })
      setListings(data)
    } catch { setListings([]) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchListings() }, [])

  const handleReset = () => {
    const reset = { keyword: '', course: '', subject: '', condition: '', minPrice: '', maxPrice: '' }
    setFilters(reset)
    fetchListings({})
  }

  const inputStyle = {
    width: '100%', padding: '9px 14px', border: '1px solid #e2e8f0', borderRadius: 10,
    fontSize: 14, color: '#374151', outline: 'none', boxSizing: 'border-box',
    backgroundColor: '#fff'
  }
  const labelStyle = { display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#f8fafc' }}>

      {/* ── Hero ── */}
      <div style={{ width: '100%', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', padding: '56px 32px' }}>
        <div style={{ textAlign: 'center' }}>
          <span style={{
            display: 'inline-block', background: 'rgba(255,255,255,0.2)', color: '#fff',
            fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.3)', marginBottom: 18, letterSpacing: '0.05em'
          }}>
            🎓 Student Book Marketplace
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, color: '#fff', margin: '0 0 12px', lineHeight: 1.2 }}>
            Find Your Next Textbook
          </h1>
          <p style={{ fontSize: 'clamp(14px, 2vw, 18px)', color: 'rgba(255,255,255,0.85)', maxWidth: 520, margin: '0 auto' }}>
            Buy, sell, or exchange textbooks directly with fellow students and save money every semester.
          </p>
        </div>
      </div>

      {/* ── Search + Filter Card ── */}
      <div style={{ padding: '0 32px' }}>
        <div style={{
          background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '24px 28px',
          marginTop: -32, position: 'relative', zIndex: 10
        }}>
          {/* Search row */}
          <form onSubmit={e => { e.preventDefault(); fetchListings(filters) }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <div style={{
                flex: 1, display: 'flex', alignItems: 'center', gap: 10,
                border: '1.5px solid #e2e8f0', borderRadius: 12, padding: '10px 16px',
                backgroundColor: '#f8fafc'
              }}>
                <svg width="16" height="16" fill="none" stroke="#94a3b8" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by title, author or keyword..."
                  value={filters.keyword}
                  onChange={e => setFilters({ ...filters, keyword: e.target.value })}
                  style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, color: '#374151', backgroundColor: 'transparent' }}
                />
              </div>
              <button type="submit" style={{
                padding: '10px 28px', backgroundColor: '#4f46e5', color: '#fff',
                border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 600,
                cursor: 'pointer', whiteSpace: 'nowrap'
              }}>
                Search
              </button>
            </div>

            {/* Filters row */}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 20, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              <div>
                <label style={labelStyle}>Course</label>
                <input type="text" placeholder="e.g. CS101" value={filters.course}
                  onChange={e => setFilters({ ...filters, course: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Subject</label>
                <input type="text" placeholder="e.g. Mathematics" value={filters.subject}
                  onChange={e => setFilters({ ...filters, subject: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Condition</label>
                <select value={filters.condition} onChange={e => setFilters({ ...filters, condition: e.target.value })}
                  style={{ ...inputStyle, cursor: 'pointer' }}>
                  {CONDITIONS.map(c => <option key={c} value={c === 'All' ? '' : c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Price Range</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="number" min="0" placeholder="Min" value={filters.minPrice}
                    onChange={e => setFilters({ ...filters, minPrice: e.target.value })}
                    style={{ ...inputStyle, width: '50%' }} />
                  <span style={{ color: '#cbd5e1', fontSize: 16, flexShrink: 0 }}>—</span>
                  <input type="number" min="0" placeholder="Max" value={filters.maxPrice}
                    onChange={e => setFilters({ ...filters, maxPrice: e.target.value })}
                    style={{ ...inputStyle, width: '50%' }} />
                </div>
              </div>
            </div>

            {/* Action row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
              <button type="button" onClick={handleReset} style={{ fontSize: 13, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
                ↺ Reset filters
              </button>
              <button type="submit" style={{
                padding: '9px 22px', backgroundColor: '#1e293b', color: '#fff',
                border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer'
              }}>
                Apply Filters
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ── Listings Section ── */}
      <div style={{ padding: '32px 32px 48px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <p style={{ fontSize: 15, color: '#64748b' }}>
            {loading ? 'Loading...' : (
              <><strong style={{ color: '#1e293b', fontSize: 17 }}>{listings.length}</strong> {listings.length === 1 ? 'book' : 'books'} available</>
            )}
          </p>
          <Link
            to={user ? '/listings/create' : '/register'}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '9px 20px', backgroundColor: '#4f46e5', color: '#fff',
              borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none'
            }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            List a Book
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ aspectRatio: '4/3', background: '#f1f5f9' }} />
                <div style={{ padding: 16 }}>
                  <div style={{ height: 14, background: '#f1f5f9', borderRadius: 8, width: '75%', marginBottom: 10 }} />
                  <div style={{ height: 12, background: '#f1f5f9', borderRadius: 8, width: '50%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0' }}>
            <div style={{ width: 64, height: 64, background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="28" height="28" fill="none" stroke="#94a3b8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p style={{ fontWeight: 600, color: '#374151', marginBottom: 6 }}>No books found</p>
            <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 16 }}>Try adjusting your search or filters.</p>
            <button onClick={handleReset} style={{ fontSize: 14, color: '#4f46e5', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              Clear all filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
            {listings.map(listing => <ListingCard key={listing._id} listing={listing} />)}
          </div>
        )}
      </div>
    </div>
  )
}
