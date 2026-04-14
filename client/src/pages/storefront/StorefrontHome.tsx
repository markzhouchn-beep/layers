import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import ArtworkCard from '../../components/ArtworkCard'
import api from '../../services/api'

interface Artwork {
  id: number
  title: string
  artist_name: string
  username: string
  mockup_url: string
  original_image_url: string
  tags: string[]
  view_count: number
  created_at: string
}

const categories = [
  { label: 'T-Shirts', href: '/?category=tshirt', count: 128 },
  { label: 'Posters', href: '/?category=poster', count: 96 },
  { label: 'Canvas', href: '/?category=canvas', count: 84 },
  { label: 'Mugs', href: '/?category=mug', count: 62 },
  { label: 'Tote Bags', href: '/?category=tote', count: 54 },
]

export default function StorefrontHome() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getArtworks({ limit: 20 })
      .then(({ items }: { items: Artwork[] }) => setArtworks(items))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-col">

      {/* ── Hero ── */}
      <section
        style={{
          paddingTop: 100,
          paddingBottom: 100,
          background: '#ffffff',
        }}
      >
        <div className="container mx-auto px-6">
          <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>
            {/* Eyebrow */}
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#0075de',
                marginBottom: 20,
              }}
            >
              Original Art · Global Print
            </p>

            {/* Headline */}
            <h1
              style={{
                fontSize: 'clamp(40px, 6vw, 72px)',
                fontWeight: 700,
                lineHeight: 1.0,
                letterSpacing: '-2.5px',
                color: 'rgba(0,0,0,0.95)',
                marginBottom: 24,
              }}
            >
              Chinese Art,
              <br />
              World Audience.
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: 20,
                fontWeight: 400,
                lineHeight: 1.55,
                color: '#615d59',
                maxWidth: 540,
                margin: '0 auto 40px',
                letterSpacing: '-0.2px',
              }}
            >
              Independent Chinese artists selling original designs on premium print products.
              Printed on-demand. Shipped worldwide from US, EU or Australia.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="#artworks"
                className="btn-primary"
                style={{ padding: '12px 24px', fontSize: 15 }}
              >
                Browse Artworks
                <ArrowRight size={16} />
              </a>
              <Link
                to="/join"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '12px 24px',
                  fontSize: 15,
                  fontWeight: 600,
                  color: 'rgba(0,0,0,0.75)',
                  background: 'rgba(0,0,0,0.05)',
                  borderRadius: 4,
                  transition: 'all 0.15s',
                }}
                className="hover:bg-[rgba(0,0,0,0.08)]"
              >
                I'm an Artist
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div style={{ borderTop: '1px solid rgba(0,0,0,0.07)' }} />

      {/* ── Categories ── */}
      <section style={{ padding: '48px 0', background: '#f6f5f4' }}>
        <div className="container mx-auto px-6">
          <div
            style={{
              display: 'flex',
              gap: 8,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <a
              href="#artworks"
              className="badge badge-gray"
              style={{ fontSize: 13, padding: '6px 14px' }}
            >
              All
            </a>
            {categories.map((cat) => (
              <a
                key={cat.label}
                href={cat.href}
                className="badge badge-gray"
                style={{ fontSize: 13, padding: '6px 14px' }}
              >
                {cat.label}
                <span
                  style={{
                    marginLeft: 6,
                    opacity: 0.6,
                    fontSize: 12,
                  }}
                >
                  {cat.count}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Artwork Grid ── */}
      <section id="artworks" style={{ padding: '64px 0 80px', background: '#ffffff' }}>
        <div className="container mx-auto px-6">
          {/* Section header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginBottom: 32,
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  letterSpacing: '-0.4px',
                  color: 'rgba(0,0,0,0.95)',
                  lineHeight: 1.2,
                }}
              >
                Featured Artworks
              </h2>
              <p style={{ fontSize: 14, color: '#615d59', marginTop: 4 }}>
                {loading ? 'Loading...' : `${artworks.length} designs from independent artists`}
              </p>
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: 24,
              }}
            >
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    aspectRatio: '4/5',
                    background: '#f6f5f4',
                    borderRadius: 12,
                    animation: 'pulse 1.8s ease-in-out infinite',
                  }}
                />
              ))}
            </div>
          ) : artworks.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '80px 0',
                border: '1px dashed rgba(0,0,0,0.12)',
                borderRadius: 12,
              }}
            >
              <p style={{ fontSize: 15, color: '#615d59', marginBottom: 12 }}>
                No artworks published yet.
              </p>
              <Link to="/join" className="text-link" style={{ fontSize: 14 }}>
                Be the first artist →
              </Link>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: 24,
              }}
            >
              {artworks.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── How it works — warm section ── */}
      <section style={{ padding: '80px 0', background: '#f6f5f4' }}>
        <div className="container mx-auto px-6">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2
              style={{
                fontSize: 32,
                fontWeight: 700,
                letterSpacing: '-1px',
                color: 'rgba(0,0,0,0.95)',
              }}
            >
              How it works
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 1,
              background: 'rgba(0,0,0,0.08)',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            {[
              {
                num: '01',
                title: 'Choose a design',
                desc: 'Browse original artworks from Chinese independent creators',
              },
              {
                num: '02',
                title: 'Pick your product',
                desc: 'T-shirt, mug, poster, canvas — all printed on-demand',
              },
              {
                num: '03',
                title: 'Order securely',
                desc: 'Stripe checkout. Printed locally and shipped worldwide',
              },
            ].map((item) => (
              <div
                key={item.num}
                style={{
                  background: '#ffffff',
                  padding: '36px 32px',
                  textAlign: 'center',
                }}
              >
                <p
                  style={{
                    fontSize: 40,
                    fontWeight: 700,
                    letterSpacing: '-2px',
                    color: 'rgba(0,0,0,0.08)',
                    marginBottom: 12,
                    lineHeight: 1,
                  }}
                >
                  {item.num}
                </p>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: 'rgba(0,0,0,0.9)',
                    marginBottom: 8,
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: '#615d59',
                    lineHeight: 1.55,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Artist CTA ── */}
      <section
        style={{
          padding: '100px 0',
          background: '#ffffff',
          borderTop: '1px solid rgba(0,0,0,0.07)',
        }}
      >
        <div className="container mx-auto px-6">
          <div
            style={{
              maxWidth: 600,
              margin: '0 auto',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#0075de',
                marginBottom: 16,
              }}
            >
              For Artists
            </p>

            <h2
              style={{
                fontSize: 'clamp(28px, 4vw, 44px)',
                fontWeight: 700,
                letterSpacing: '-1.5px',
                color: 'rgba(0,0,0,0.95)',
                lineHeight: 1.1,
                marginBottom: 16,
              }}
            >
              Turn your art into a global income stream
            </h2>

            <p
              style={{
                fontSize: 17,
                color: '#615d59',
                lineHeight: 1.6,
                marginBottom: 32,
              }}
            >
              Subscribe in CNY. Earn in USD. Layers handles printing, shipping,
              and customer service — you focus on creating.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/join" className="btn-primary" style={{ padding: '12px 24px' }}>
                Start for free
                <ArrowRight size={16} />
              </Link>
              <Link to="/creator" className="btn-secondary" style={{ padding: '12px 24px' }}>
                Creator Login
              </Link>
            </div>

            <div
              style={{
                display: 'flex',
                gap: 16,
                justifyContent: 'center',
                marginTop: 28,
                fontSize: 13,
                color: '#a39e98',
              }}
            >
              <span>¥0 to start</span>
              <span>·</span>
              <span>30%–45% royalty</span>
              <span>·</span>
              <span>Global reach</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
