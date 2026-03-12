import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const isActive = (path) => location.pathname === path

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive(to)
          ? 'bg-indigo-50 text-indigo-600'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      {label}
    </Link>
  )

  return (
    <nav style={{ width: '100%', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px', padding: '0 32px' }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            width: 34, height: 34, backgroundColor: '#4f46e5', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 16
          }}>B</div>
          <span style={{ fontWeight: 700, fontSize: 18, color: '#1e293b' }}>BookSwap</span>
        </Link>

        {/* Center Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {navLink('/', 'Browse')}
          {user && navLink('/listings/create', 'Sell a Book')}
          {user && navLink('/messages', 'Messages')}
          {user && navLink('/transactions', 'Transactions')}
        </div>

        {/* Right: Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          {user ? (
            <>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 12px', backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0', borderRadius: 8
              }}>
                <div style={{
                  width: 26, height: 26, backgroundColor: '#4f46e5', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 12, fontWeight: 700
                }}>
                  {user.username?.[0]?.toUpperCase()}
                </div>
                <span style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>{user.username}</span>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  padding: '8px 16px', fontSize: 14, fontWeight: 500,
                  color: '#64748b', backgroundColor: 'transparent',
                  border: '1px solid #e2e8f0', borderRadius: 8, cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ fontSize: 14, fontWeight: 500, color: '#64748b', textDecoration: 'none' }}>
                Log in
              </Link>
              <Link to="/register" style={{
                padding: '8px 18px', fontSize: 14, fontWeight: 600,
                color: '#fff', backgroundColor: '#4f46e5',
                borderRadius: 8, textDecoration: 'none', whiteSpace: 'nowrap'
              }}>
                Sign up free
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ borderTop: '1px solid #f1f5f9', padding: '12px 24px', backgroundColor: '#fff' }}>
          <Link to="/" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '10px 16px', fontSize: 14, color: '#374151', textDecoration: 'none' }}>Browse</Link>
          {user ? (
            <>
              <Link to="/listings/create" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '10px 16px', fontSize: 14, color: '#374151', textDecoration: 'none' }}>Sell a Book</Link>
              <Link to="/messages" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '10px 16px', fontSize: 14, color: '#374151', textDecoration: 'none' }}>Messages</Link>
              <Link to="/transactions" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '10px 16px', fontSize: 14, color: '#374151', textDecoration: 'none' }}>Transactions</Link>
              <button onClick={handleLogout} style={{ display: 'block', padding: '10px 16px', fontSize: 14, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '10px 16px', fontSize: 14, color: '#374151', textDecoration: 'none' }}>Log in</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '10px 16px', fontSize: 14, color: '#4f46e5', textDecoration: 'none' }}>Sign up free</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
