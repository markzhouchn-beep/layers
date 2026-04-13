import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'

const categories = [
  { name: 'T-Shirt', label: 'T恤' },
  { name: 'Poster', label: '海报' },
  { name: 'Canvas', label: '画布' },
  { name: 'Mug', label: '马克杯' },
  { name: 'Bag', label: '帆布包' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(false)
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
        scrolled
          ? 'bg-paper/95 backdrop-blur-sm border-b border-light-ink shadow-sm'
          : 'bg-transparent'
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
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-ink hover:text-vermilion transition-colors">
            首页
          </Link>
          <div
            className="relative"
            onMouseEnter={() => setCategoryOpen(true)}
            onMouseLeave={() => setCategoryOpen(false)}
          >
            <button className="flex items-center gap-1 text-sm font-medium text-ink hover:text-vermilion transition-colors">
              产品分类 <ChevronDown size={14} />
            </button>
            {categoryOpen && (
              <div className="absolute top-full left-0 mt-2 bg-paper border border-light-ink rounded-xl shadow-lg py-2 min-w-[140px]">
                {categories.map((c) => (
                  <Link
                    key={c.name}
                    to={`/category/${c.name}`}
                    className="block px-4 py-2 text-sm text-smoke hover:text-ink hover:bg-warm-gray transition-colors"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link to="/join" className="text-sm font-medium text-ink hover:text-vermilion transition-colors">
            艺术家入驻
          </Link>
        </div>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/join"
            className="px-5 py-2 bg-ink text-paper text-sm font-medium rounded-lg hover:bg-ink/80 transition-colors"
          >
            开始创作
          </Link>
        </div>

        {/* Mobile menu */}
        <button
          className="md:hidden p-2 text-ink"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="菜单"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden bg-paper border-t border-light-ink">
          <div className="px-6 py-4 flex flex-col gap-4">
            <Link to="/" className="text-sm font-medium text-ink">首页</Link>
            <div className="flex flex-col gap-2">
              <p className="text-xs text-smoke uppercase tracking-wider">产品分类</p>
              {categories.map((c) => (
                <Link
                  key={c.name}
                  to={`/category/${c.name}`}
                  className="text-sm text-smoke pl-2"
                >
                  {c.label}
                </Link>
              ))}
            </div>
            <Link to="/join" className="text-sm font-medium text-ink">艺术家入驻</Link>
            <Link
              to="/join"
              className="mt-2 px-5 py-2.5 bg-ink text-paper text-sm font-medium rounded-lg text-center"
            >
              开始创作
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
