import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LayoutDashboard, Image, CreditCard, ExternalLink, LogOut, Menu, X } from 'lucide-react'
import CreatorOverview from './Overview'
import MyArtworks from './MyArtworks'
import Subscription from './Subscription'
import ExternalAccounts from './ExternalAccounts'

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'artworks', label: 'My Artworks', icon: Image },
  { id: 'subscription', label: 'Subscription', icon: CreditCard },
  { id: 'external', label: 'External', icon: ExternalLink },
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
    <div style={{ paddingTop: 64, minHeight: '100vh', background: '#f6f5f4' }}>
      {/* Creator top nav */}
      <div
        style={{
          position: 'sticky',
          top: 64,
          zIndex: 40,
          background: '#ffffff',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            padding: '0 24px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              height: 52,
              gap: 4,
              overflowX: 'auto',
            }}
          >
            <button
              onClick={() => setSidebarOpen(v => !v)}
              style={{
                display: 'none',
                padding: 6,
                borderRadius: 4,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                marginRight: 4,
              }}
              className="md:hidden"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 4,
                  border: 'none',
                  fontSize: 14,
                  fontWeight: active === tab.id ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                  background: active === tab.id ? 'rgba(0,0,0,0.06)' : 'transparent',
                  color: active === tab.id ? 'rgba(0,0,0,0.95)' : '#615d59',
                }}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}

            {/* Right actions */}
            <div
              style={{
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                flexShrink: 0,
              }}
            >
              <Link
                to="/"
                style={{
                  fontSize: 13,
                  color: '#615d59',
                  textDecoration: 'none',
                  padding: '4px 8px',
                  borderRadius: 4,
                  transition: 'color 0.15s',
                }}
              >
                ← Shop
              </Link>
              <button
                style={{
                  fontSize: 13,
                  color: '#615d59',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <LogOut size={13} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            background: 'rgba(0,0,0,0.3)',
          }}
          onClick={() => setSidebarOpen(false)}
          className="md:hidden"
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 220,
              background: '#ffffff',
              padding: '16px 12px',
              boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActive(tab.id); setSidebarOpen(false) }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 6,
                  border: 'none',
                  background: active === tab.id ? 'rgba(0,0,0,0.06)' : 'transparent',
                  color: active === tab.id ? 'rgba(0,0,0,0.95)' : '#615d59',
                  fontSize: 14,
                  fontWeight: active === tab.id ? 600 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  marginBottom: 2,
                }}
              >
                <tab.icon size={15} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        {renderContent()}
      </div>
    </div>
  )
}
