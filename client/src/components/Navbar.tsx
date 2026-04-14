import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import LangSwitcher from './LangSwitcher'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled
            ? 'bg-white border-b border-[rgba(0,0,0,0.08)] shadow-sm'
            : 'bg-white'
        }`}
      >
        <div className="container mx-auto px-6 h-[60px] flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
              <rect x="1" y="1" width="10" height="10" fill="rgba(0,0,0,0.9)" />
              <rect x="15" y="1" width="10" height="10" fill="#0075de" />
              <rect x="1" y="15" width="10" height="10" fill="rgba(0,0,0,0.08)" />
              <rect x="15" y="15" width="10" height="10" fill="rgba(0,0,0,0.9)" />
            </svg>
            <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.3px', color: 'rgba(0,0,0,0.95)' }}>
              Layers
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
              Shop
            </Link>
            <Link to="/?category=tshirt" className="nav-link">
              T-Shirts
            </Link>
            <Link to="/?category=poster" className="nav-link">
              Posters
            </Link>
            <Link to="/?category=canvas" className="nav-link">
              Canvas
            </Link>
            <Link to="/join" className="nav-link">
              For Artists
            </Link>
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-5">
            <LangSwitcher />
            <Link to="/creator" className="nav-link text-sm">
              Creator
            </Link>
            <Link to="/admin" className="nav-link text-sm">
              Admin
            </Link>
            <Link
              to="/join"
              className="btn-primary"
              style={{ padding: '6px 14px', fontSize: 14 }}
            >
              Start Creating
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-1.5 rounded-md hover:bg-[rgba(0,0,0,0.05)] transition-colors"
            onClick={() => setMenuOpen(v => !v)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 top-[60px] bg-white z-40 md:hidden">
          <nav className="container mx-auto px-6 py-6 flex flex-col gap-1">
            <Link to="/" className="py-3 text-[15px] font-medium text-[rgba(0,0,0,0.9)] border-b border-[rgba(0,0,0,0.06)]">
              Shop
            </Link>
            <Link to="/?category=tshirt" className="py-3 text-[15px] font-medium text-[rgba(0,0,0,0.75)] border-b border-[rgba(0,0,0,0.06)]">
              T-Shirts
            </Link>
            <Link to="/?category=poster" className="py-3 text-[15px] font-medium text-[rgba(0,0,0,0.75)] border-b border-[rgba(0,0,0,0.06)]">
              Posters
            </Link>
            <Link to="/?category=canvas" className="py-3 text-[15px] font-medium text-[rgba(0,0,0,0.75)] border-b border-[rgba(0,0,0,0.06)]">
              Canvas
            </Link>
            <Link to="/join" className="py-3 text-[15px] font-medium text-[rgba(0,0,0,0.9)] border-b border-[rgba(0,0,0,0.06)]">
              For Artists
            </Link>
            <div className="pt-4 flex flex-col gap-3">
              <Link to="/creator" className="btn-secondary justify-center">Creator Login</Link>
              <Link to="/join" className="btn-primary justify-center">Start Creating</Link>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
