import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Eye, ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../services/api'

const PRODUCTS = [
  { id: 5, label: 'Classic T-Shirt', price: 24.99, printifyId: 5 },
  { id: 10, label: 'Classic Mug', price: 19.99, printifyId: 10 },
  { id: 31, label: 'Poster', price: 39.99, printifyId: 31 },
  { id: 34, label: 'Canvas Print', price: 59.99, printifyId: 34 },
  { id: 21, label: 'Tote Bag', price: 29.99, printifyId: 21 },
]

interface Artwork {
  id: number
  title: string
  description: string
  original_image_url: string
  mockup_url: string
  tags: string[]
  view_count: number
  artist_name: string
  username: string
  avatar: string
  printify_blueprint_id?: number
}

export default function ArtworkDetail() {
  const { id } = useParams<{ id: string }>()
  const [artwork, setArtwork] = useState<Artwork | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0])
  const [buying, setBuying] = useState(false)
  const [paymentError, setPaymentError] = useState('')

  useEffect(() => {
    if (!id) return
    api.getArtwork(id)
      .then((data: Artwork) => {
        setArtwork(data)
        if (data.printify_blueprint_id) {
          const match = PRODUCTS.find(p => p.printifyId === data.printify_blueprint_id)
          if (match) setSelectedProduct(match)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  const handleBuy = async () => {
    if (!artwork) return
    setBuying(true)
    setPaymentError('')
    try {
      const data = await api.createCheckoutSession(artwork.id, selectedProduct.printifyId)
      if (data.url) window.location.href = data.url
    } catch (err: unknown) {
      setPaymentError(err instanceof Error ? err.message : 'Checkout failed.')
    } finally {
      setBuying(false)
    }
  }

  if (loading) {
    return (
      <div style={{ paddingTop: 100, paddingBottom: 80 }}>
        <div className="container mx-auto px-6">
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>
              <div style={{ aspectRatio: '1', background: '#f6f5f4', borderRadius: 12, animation: 'pulse 1.8s infinite' }} />
              <div className="space-y-4" style={{ paddingTop: 8 }}>
                <div style={{ height: 32, background: '#f6f5f4', borderRadius: 6, animation: 'pulse 1.8s infinite' }} />
                <div style={{ height: 16, width: 120, background: '#f6f5f4', borderRadius: 4, animation: 'pulse 1.8s infinite' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!artwork) {
    return (
      <div style={{ paddingTop: 120, textAlign: 'center' }}>
        <p style={{ fontSize: 15, color: '#615d59', marginBottom: 12 }}>Artwork not found</p>
        <Link to="/" className="text-link">← Back to shop</Link>
      </div>
    )
  }

  const image = artwork.mockup_url || artwork.original_image_url
  const artistDisplay = artwork.artist_name || artwork.username || 'Anonymous'

  return (
    <div style={{ paddingTop: 88, paddingBottom: 80 }}>
      <div className="container mx-auto px-6">
        {/* Breadcrumb */}
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 14,
            color: '#615d59',
            marginBottom: 32,
            transition: 'color 0.15s',
          }}
          className="hover:text-[rgba(0,0,0,0.9)]"
        >
          <ArrowLeft size={14} />
          Back to shop
        </Link>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 64,
            maxWidth: 1000,
          }}
        >
          {/* Image */}
          <div>
            <div
              style={{
                background: '#f6f5f4',
                borderRadius: 16,
                overflow: 'hidden',
                border: '1px solid rgba(0,0,0,0.08)',
              }}
            >
              {image ? (
                <img
                  src={image}
                  alt={artwork.title}
                  style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#a39e98',
                    fontSize: 14,
                  }}
                >
                  No image
                </div>
              )}
            </div>

            {/* View count */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginTop: 14,
                color: '#a39e98',
                fontSize: 13,
              }}
            >
              <Eye size={13} />
              {artwork.view_count || 0} views
            </div>
          </div>

          {/* Info */}
          <div style={{ paddingTop: 4 }}>
            {/* Title */}
            <h1
              style={{
                fontSize: 32,
                fontWeight: 700,
                letterSpacing: '-0.75px',
                color: 'rgba(0,0,0,0.95)',
                lineHeight: 1.15,
                marginBottom: 8,
              }}
            >
              {artwork.title}
            </h1>

            {/* Artist */}
            <p style={{ fontSize: 15, color: '#615d59', marginBottom: 28 }}>
              by{' '}
              <span style={{ color: '#0075de', fontWeight: 500 }}>{artistDisplay}</span>
            </p>

            {/* Price */}
            <p
              style={{
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: '-0.5px',
                color: 'rgba(0,0,0,0.95)',
                marginBottom: 24,
              }}
            >
              ${selectedProduct.price}
            </p>

            {/* Description */}
            {artwork.description && (
              <p
                style={{
                  fontSize: 15,
                  color: '#615d59',
                  lineHeight: 1.65,
                  marginBottom: 28,
                }}
              >
                {artwork.description}
              </p>
            )}

            {/* Product selector */}
            <div style={{ marginBottom: 28 }}>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'rgba(0,0,0,0.9)',
                  marginBottom: 10,
                  letterSpacing: '-0.05px',
                }}
              >
                Choose product
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {PRODUCTS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: 8,
                      border: selectedProduct.id === p.id
                        ? '2px solid #0075de'
                        : '1px solid rgba(0,0,0,0.12)',
                      background: selectedProduct.id === p.id ? '#f2f9ff' : '#ffffff',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.12s',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: selectedProduct.id === p.id ? 600 : 500,
                        color: selectedProduct.id === p.id ? '#0075de' : 'rgba(0,0,0,0.9)',
                      }}
                    >
                      {p.label}
                    </span>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: selectedProduct.id === p.id ? '#0075de' : 'rgba(0,0,0,0.65)',
                      }}
                    >
                      ${p.price}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Buy button */}
            <button
              onClick={handleBuy}
              disabled={buying}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '14px 20px',
                fontSize: 15,
                justifyContent: 'center',
                marginBottom: 12,
              }}
            >
              {buying ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Redirecting...
                </>
              ) : (
                <>
                  <ShoppingBag size={16} />
                  Buy Now — ${selectedProduct.price}
                </>
              )}
            </button>

            {paymentError && (
              <p style={{ fontSize: 13, color: '#eb5757', textAlign: 'center', marginBottom: 8 }}>
                {paymentError}
              </p>
            )}

            <p
              style={{
                fontSize: 13,
                color: '#a39e98',
                textAlign: 'center',
                lineHeight: 1.5,
              }}
            >
              Secure checkout via Stripe · Worldwide shipping 7–14 days
            </p>

            {/* Tags */}
            {artwork.tags?.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 6,
                  marginTop: 28,
                  paddingTop: 24,
                  borderTop: '1px solid rgba(0,0,0,0.07)',
                }}
              >
                {(artwork.tags as string[]).map((tag) => (
                  <span
                    key={tag}
                    className="badge badge-gray"
                    style={{ fontSize: 12 }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
