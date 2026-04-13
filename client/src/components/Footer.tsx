import { Link } from 'react-router-dom'
import { Globe2, Share2 } from 'lucide-react'

const footerLinks = {
  product: [
    { label: '首页', to: '/' },
    { label: 'T恤', to: '/category/T-Shirt' },
    { label: '海报', to: '/category/Poster' },
    { label: '画布', to: '/category/Canvas' },
  ],
  artists: [
    { label: '艺术家入驻', to: '/join' },
    { label: '常见问题', to: '/faq' },
    { label: '版税说明', to: '/royalties' },
  ],
  company: [
    { label: '关于我们', to: '/about' },
    { label: '联系合作', to: '/contact' },
    { label: '隐私政策', to: '/privacy' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-ink text-paper/80">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                <rect x="2" y="2" width="10" height="10" fill="#fafaf8" />
                <rect x="16" y="2" width="10" height="10" fill="#c9382a" />
                <rect x="2" y="16" width="10" height="10" fill="#6b6b6b" />
                <rect x="16" y="16" width="10" height="10" fill="#fafaf8" />
              </svg>
              <span className="text-base font-semibold text-paper">Layers</span>
            </Link>
            <p className="text-sm text-paper/60 leading-relaxed">
              中国艺术家 · 全球版画平台<br />
              让原创艺术走进世界每个角落
            </p>
            <div className="flex gap-3 mt-5">
              <a href="#" aria-label="Instagram" className="text-paper/60 hover:text-paper transition-colors">
                <Globe2 size={18} />
              </a>
              <a href="#" aria-label="Twitter" className="text-paper/60 hover:text-paper transition-colors">
                <Share2 size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs uppercase tracking-wider text-paper/40 mb-4">产品</p>
            <ul className="space-y-2.5">
              {footerLinks.product.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-paper/70 hover:text-paper transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-paper/40 mb-4">艺术家</p>
            <ul className="space-y-2.5">
              {footerLinks.artists.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-paper/70 hover:text-paper transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-paper/40 mb-4">公司</p>
            <ul className="space-y-2.5">
              {footerLinks.company.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-paper/70 hover:text-paper transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-paper/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-paper/40">
            © 2026 Layers. 中国艺术家 · 全球版画平台
          </p>
          <p className="text-xs text-paper/30">
            layershop.store
          </p>
        </div>
      </div>
    </footer>
  )
}
