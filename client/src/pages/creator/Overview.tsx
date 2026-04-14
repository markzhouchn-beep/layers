import { useState, useEffect } from 'react'
import { TrendingUp, Eye, ShoppingBag, Clock, Plus } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'

interface Stats {
  total_artworks: number
  total_orders: number
  total_earnings: number
  pending_review: number
}

export default function Overview() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getCreatorDashboard()
      .then((data: unknown) => setStats(data as Stats))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const statCards = [
    { label: 'Artworks', value: stats?.total_artworks ?? '-', icon: Eye, accent: '#0075de' },
    { label: 'Total Orders', value: stats?.total_orders ?? '-', icon: ShoppingBag, accent: '#2a9d99' },
    { label: 'Total Earnings', value: stats ? `$${stats.total_earnings.toFixed(2)}` : '-', icon: TrendingUp, accent: '#1aae39' },
    { label: 'Pending Review', value: stats?.pending_review ?? '-', icon: Clock, accent: '#dd5b00' },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: '-0.4px',
            color: 'rgba(0,0,0,0.95)',
            lineHeight: 1.2,
          }}
        >
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},{' '}
          {user?.artist_name || user?.username}
        </h1>
        <p style={{ fontSize: 14, color: '#615d59', marginTop: 4 }}>
          Here's what's happening with your art
        </p>
      </div>

      {/* Stats */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ height: 100, background: '#f6f5f4', borderRadius: 12, animation: 'pulse 1.8s infinite' }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
          {statCards.map((card) => (
            <div
              key={card.label}
              style={{
                background: '#ffffff',
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: 12,
                padding: '20px 20px',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: '#615d59', fontWeight: 500 }}>{card.label}</span>
                <card.icon size={15} style={{ color: card.accent }} />
              </div>
              <p
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  letterSpacing: '-1px',
                  color: 'rgba(0,0,0,0.95)',
                  lineHeight: 1,
                }}
              >
                {card.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Pending review alert */}
      {stats?.pending_review ? (
        <div
          style={{
            marginTop: 20,
            padding: '14px 16px',
            background: '#fff3e8',
            border: '1px solid rgba(221,91,0,0.2)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Clock size={15} style={{ color: '#dd5b00', flexShrink: 0 }} />
          <p style={{ fontSize: 14, color: '#dd5b00' }}>
            You have <strong>{stats.pending_review}</strong> artwork{stats.pending_review > 1 ? 's' : ''} pending review
          </p>
        </div>
      ) : null}

      {/* Quick actions */}
      <div style={{ marginTop: 32 }}>
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'rgba(0,0,0,0.9)',
            marginBottom: 12,
            letterSpacing: '-0.05px',
          }}
        >
          Quick actions
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <a
            href="#artworks"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              background: '#0075de',
              color: '#fff',
              borderRadius: 4,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <Plus size={14} />
            Upload Artwork
          </a>
          <a
            href="#subscription"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              background: 'rgba(0,0,0,0.05)',
              color: 'rgba(0,0,0,0.85)',
              borderRadius: 4,
              fontSize: 14,
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            View Plans
          </a>
        </div>
      </div>
    </div>
  )
}
