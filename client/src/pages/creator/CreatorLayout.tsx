import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LayoutDashboard, Image, CreditCard, ExternalLink, Settings, LogOut, Menu, X} from 'lucide-react'
import CreatorOverview from './Overview'
import MyArtworks from './MyArtworks'
import Subscription from './Subscription'
import ExternalAccounts from './ExternalAccounts'

const nav = [
  { id: 'overview', label: '数据概览', icon: LayoutDashboard },
  { id: 'artworks', label: '我的作品', icon: Image },
  { id: 'subscription', label: '订阅方案', icon: CreditCard },
  { id: 'external', label: '外部平台', icon: ExternalLink },
]

export default function CreatorLayout() {
  const [active, setActive] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderContent = () => {
    switch (active) {
      case 'overview': return <CreatorOverview />
      case 'artworks': return <MyArtworks />
      case 'subscription': return <Subscription />
      case 'external': return <ExternalAccounts />
      default: return <CreatorOverview />
    }
  }

  return (
    <div className="pt-16 min-h-screen bg-warm-gray">
      {/* Top nav bar */}
      <div className="bg-paper border-b border-light-ink sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center h-14 gap-6">
            <button
              className="md:hidden text-smoke hover:text-ink"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex gap-1 overflow-x-auto">
              {nav.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActive(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    active === item.id
                      ? 'bg-ink text-paper'
                      : 'text-smoke hover:text-ink hover:bg-warm-gray'
                  }`}
                >
                  <item.icon size={15} />
                  {item.label}
                </button>
              ))}
            </div>
            <div className="ml-auto hidden md:flex items-center gap-4">
              <Link to="/" className="text-xs text-smoke hover:text-ink">← 返回商店</Link>
              <button className="flex items-center gap-1.5 text-sm text-smoke hover:text-ink">
                <Settings size={15} /> 设置
              </button>
              <button className="flex items-center gap-1.5 text-sm text-smoke hover:text-ink">
                <LogOut size={15} /> 退出
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-ink/50" onClick={() => setSidebarOpen(false)}>
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-paper shadow-lg" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-light-ink">
              <p className="text-sm font-semibold text-ink">创作者后台</p>
            </div>
            <div className="p-2">
              {nav.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActive(item.id); setSidebarOpen(false) }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                    active === item.id ? 'bg-ink text-paper' : 'text-smoke hover:bg-warm-gray'
                  }`}
                >
                  <item.icon size={16} /> {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {renderContent()}
      </div>
    </div>
  )
}
