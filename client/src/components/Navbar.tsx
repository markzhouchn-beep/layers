import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'
import LangSwitcher from './LangSwitcher'

const categories = [
  { name: 'T-Shirt', label: 'T-Shirt' },
  { name: 'Poster', label: 'Poster' },
  { name: 'Canvas', label: 'Canvas Print' },
  { name: 'Mug', label: 'Mug' },
  { name: 'Bag', label: 'Tote Bag' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-paper/95 backdrop-blur-sm border-b border-light-ink shadow-sm' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="2" y="2" width="10" height="10" fill="#1a1a1a" />
            <rect x="16" y="2" width="10" height="10" fill="#c9382a" />
            <rect x="2" y="16" width="10" height="10" fill="#e8e7e3" />
            <rect x="16" y="16" width="10" height="10" fill="#1a1a1a" />
          </svg>
          <span className="text-lg font-semibold tracking-tight text-ink">Layers</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-ink hover:text-vermilion transition-colors">
            Shop
          </Link>
          <div className="relative group">
            <button className="flex items-center gap-1 text-sm font-medium text-ink hover:text-vermilion transition-colors">
              Products <ChevronDown size={14} />
            </button>
            <div className="absolute top-full left-0 mt-2 bg-paper border border-light-ink rounded-xl shadow-lg py-2 min-w-[140px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              {categories.map((c) => (
                <Link key={c.name} to="/" className="block px-4 py-2 text-sm text-smoke hover:text-ink hover:bg-warm-gray transition-colors">
                  {c.label}
                </Link>
              ))}
            </div>
          </div>
          <Link to="/join" className="text-sm font-medium text-ink hover:text-vermilion transition-colors">
            For Artists
          </Link>
        </div>

        {/* Right */}
        <div className="hidden md:flex items-center gap-4">
          <LangSwitcher />
          <Link to="/creator" className="text-sm text-smoke hover:text-ink transition-colors">Creator</Link>
          <Link to="/admin" className="text-sm text-smoke hover:text-ink transition-colors">Admin</Link>
          <Link to="/join" className="px-5 py-2 bg-ink text-paper text-sm font-medium rounded-lg hover:bg-ink/80 transition-colors">
            Start Creating
          </Link>
        </div>

        {/* Mobile */}
        <button className="md:hidden p-2 text-ink" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden bg-paper border-t border-light-ink">
          <div className="px-6 py-4 flex flex-col gap-4">
            <LangSwitcher />
            <Link to="/" className="text-sm font-medium text-ink">Shop</Link>
            <Link to="/join" className="text-sm font-medium text-ink">For Artists</Link>
            <Link to="/creator" className="text-sm font-medium text-ink">Creator</Link>
            <Link to="/admin" className="text-sm font-medium text-ink">Admin</Link>
            <Link to="/join" className="px-5 py-2.5 bg-ink text-paper text-sm font-medium rounded-lg text-center">
              Start Creating
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
