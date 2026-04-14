import { useState, useEffect } from 'react'
import { Check, X, RefreshCw, Loader2 } from 'lucide-react'
import api from '../../services/api'

interface Artwork {
  id: number
  title: string
  artist_name: string
  username: string
  original_image_url: string
  mockup_url: string
  status: string
  created_at: string
}

interface DashboardStats {
  total_artworks: number
  pending_count: number
  total_creators: number
  total_orders: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [pending, setPending] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const [actioning, setActioning] = useState<number | null>(null)

  const load = () => {
    setLoading(true)
    Promise.all([
      api.getAdminDashboard(),
      api.getAdminArtworks({ status: 'pending' }),
    ])
      .then(([dashData, artData]: [unknown, unknown]) => {
        setStats(dashData as DashboardStats)
        setPending((artData as { items: Artwork[] }).items || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleApprove = async (id: number) => {
    setActioning(id)
    try {
      await api.approveArtwork(id)
      setPending(prev => prev.filter(a => a.id !== id))
      // Refresh stats
      api.getAdminDashboard().then((d: unknown) => setStats(d as DashboardStats)).catch(() => {})
    } catch {}
    setActioning(null)
  }

  const handleReject = async (id: number) => {
    setActioning(id)
    try {
      await api.rejectArtwork(id)
      setPending(prev => prev.filter(a => a.id !== id))
    } catch {}
    setActioning(null)
  }

  const handleSync = async () => {
    setActioning(-1)
    try {
      await api.syncPrintifyAll()
    } catch {}
    setActioning(null)
  }

  const statCards = [
    { label: 'Total Artworks', value: stats?.total_artworks ?? '-', accent: '#0075de' },
    { label: 'Pending Review', value: stats?.pending_count ?? '-', accent: '#dd5b00' },
    { label: 'Total Creators', value: stats?.total_creators ?? '-', accent: '#2a9d99' },
    { label: 'Total Orders', value: stats?.total_orders ?? '-', accent: '#1aae39' },
  ]

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh', background: '#f6f5f4' }}>
      {/* Admin header */}
      <div
        style={{
          background: 'rgba(0,0,0,0.95)',
          padding: '32px 0 28px',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <h1
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: '#ffffff',
                  letterSpacing: '-0.3px',
                }}
              >
                Admin Dashboard
              </h1>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginTop: 3 }}>
                Manage artworks, creators and platform operations
              </p>
            </div>
            <button
              onClick={handleSync}
              disabled={actioning === -1}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 4,
                fontSize: 13,
                fontWeight: 500,
                cursor: actioning === -1 ? 'not-allowed' : 'pointer',
                opacity: actioning === -1 ? 0.6 : 1,
              }}
            >
              <RefreshCw size={13} className={actioning === -1 ? 'animate-spin' : ''} />
              Sync Printify
            </button>
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
            {statCards.map((s) => (
              <div
                key={s.label}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 8,
                  padding: '14px 16px',
                }}
              >
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>{s.label}</p>
                <p
                  style={{
                    fontSize: 26,
                    fontWeight: 700,
                    color: '#fff',
                    letterSpacing: '-0.5px',
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px' }}>
        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            gap: 2,
            background: '#ffffff',
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: 8,
            padding: 4,
            width: 'fit-content',
            marginBottom: 20,
          }}
        >
          {[
            { key: 'pending', label: 'Pending Review', count: pending.length },
            { key: 'approved', label: 'Approved', count: null },
            { key: 'rejected', label: 'Rejected', count: null },
          ].map((t_) => (
            <button
              key={t_.key}
              onClick={() => setTab(t_.key as typeof tab)}
              style={{
                padding: '6px 14px',
                borderRadius: 5,
                border: 'none',
                fontSize: 13,
                fontWeight: tab === t_.key ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.12s',
                background: tab === t_.key ? 'rgba(0,0,0,0.06)' : 'transparent',
                color: tab === t_.key ? 'rgba(0,0,0,0.9)' : '#615d59',
              }}
            >
              {t_.label}
              {t_.count !== null && t_.count > 0 && (
                <span
                  style={{
                    marginLeft: 6,
                    padding: '1px 6px',
                    background: '#dd5b00',
                    color: '#fff',
                    borderRadius: 10,
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {t_.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Artwork list */}
        {tab === 'pending' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#615d59' }}>
                <Loader2 size={20} className="animate-spin" style={{ margin: '0 auto 8px' }} />
                <p style={{ fontSize: 14 }}>Loading...</p>
              </div>
            ) : pending.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '60px 0',
                  background: '#ffffff',
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: 12,
                }}
              >
                <p style={{ fontSize: 15, color: '#615d59' }}>No artworks pending review</p>
                <p style={{ fontSize: 13, color: '#a39e98', marginTop: 4 }}>Check back later for new submissions</p>
              </div>
            ) : (
              pending.map((artwork) => (
                <div
                  key={artwork.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: 10,
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    boxShadow: 'var(--shadow-card)',
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 8,
                      overflow: 'hidden',
                      flexShrink: 0,
                      background: '#f6f5f4',
                    }}
                  >
                    {(artwork.mockup_url || artwork.original_image_url) ? (
                      <img
                        src={artwork.mockup_url || artwork.original_image_url}
                        alt={artwork.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%' }} />
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: 'rgba(0,0,0,0.9)',
                        marginBottom: 2,
                      }}
                    >
                      {artwork.title}
                    </p>
                    <p style={{ fontSize: 13, color: '#615d59' }}>
                      by {artwork.artist_name || artwork.username}
                    </p>
                    <p style={{ fontSize: 12, color: '#a39e98', marginTop: 1 }}>
                      {new Date(artwork.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                    <button
                      onClick={() => handleApprove(artwork.id)}
                      disabled={actioning === artwork.id}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '7px 12px',
                        background: actioning === artwork.id ? '#1aae39aa' : '#1aae39',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 4,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: actioning === artwork.id ? 'not-allowed' : 'pointer',
                        opacity: actioning === artwork.id ? 0.7 : 1,
                      }}
                    >
                      {actioning === artwork.id ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(artwork.id)}
                      disabled={actioning === artwork.id}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '7px 12px',
                        background: 'rgba(0,0,0,0.04)',
                        color: '#615d59',
                        border: '1px solid rgba(0,0,0,0.1)',
                        borderRadius: 4,
                        fontSize: 13,
                        fontWeight: 500,
                        cursor: actioning === artwork.id ? 'not-allowed' : 'pointer',
                      }}
                    >
                      <X size={13} />
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'approved' && (
          <div style={{ textAlign: 'center', padding: '60px 0', background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 12 }}>
            <p style={{ fontSize: 15, color: '#615d59' }}>Approved artworks</p>
            <p style={{ fontSize: 13, color: '#a39e98', marginTop: 4 }}>View in storefront</p>
          </div>
        )}

        {tab === 'rejected' && (
          <div style={{ textAlign: 'center', padding: '60px 0', background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 12 }}>
            <p style={{ fontSize: 15, color: '#615d59' }}>Rejected artworks</p>
            <p style={{ fontSize: 13, color: '#a39e98', marginTop: 4 }}>None</p>
          </div>
        )}
      </div>
    </div>
  )
}
