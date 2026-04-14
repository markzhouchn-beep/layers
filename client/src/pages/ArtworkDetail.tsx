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
        // Auto-select matching product based on blueprint
        if (data.printify_blueprint_id) {
          const match = PRODUCTS.find(p => p.printifyId === data.printify_blueprint_id)
          if (match) setSelectedProduct(match)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="pt-24 pb-20 px-6 max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="aspect-[4/3] bg-warm-gray rounded-xl mb-8" />
          <div className="h-8 bg-warm-gray rounded w-1/2 mb-4" />
          <div className="h-4 bg-warm-gray rounded w-1/4 mb-8" />
        </div>
      </div>
    )
  }

  if (!artwork) {
    return (
      <div className="pt-24 pb-20 px-6 max-w-4xl mx-auto text-center">
        <p className="text-smoke">作品不存在或已被删除</p>
        <Link to="/" className="mt-4 inline-block text-sm text-vermilion hover:underline">返回商店</Link>
      </div>
    )
  }

  const image = artwork.mockup_url || artwork.original_image_url

  const handleBuy = async () => {
    setBuying(true)
    setPaymentError('')
    try {
      const data = await api.createCheckoutSession(artwork!.id, selectedProduct.printifyId)
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err: unknown) {
      setPaymentError(err instanceof Error ? err.message : 'Checkout failed. Please try again.')
    } finally {
      setBuying(false)
    }
  }

  return (
    <div className="pt-24 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-smoke hover:text-ink mb-6">
          <ArrowLeft size={14} /> 返回商店
        </Link>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Image */}
          <div>
            <div className="rounded-2xl overflow-hidden bg-warm-gray">
              {image ? (
                <img src={image} alt={artwork.title} className="w-full aspect-square object-cover" />
              ) : (
                <div className="w-full aspect-square flex items-center justify-center text-smoke/30">No image</div>
              )}
            </div>
            <div className="mt-4 flex items-center gap-4 text-sm text-smoke">
              <span className="flex items-center gap-1"><Eye size={14} />{artwork.view_count || 0} views</span>
            </div>
          </div>

          {/* Info */}
          <div>
            <h1 className="text-3xl font-semibold text-ink mb-2">{artwork.title}</h1>
            <p className="text-sm text-smoke mb-6">
              by <Link to={`/artist/${artwork.username}`} className="text-vermilion hover:underline">{artwork.artist_name || artwork.username}</Link>
            </p>

            <p className="text-3xl font-semibold text-ink mb-6">${selectedProduct.price}</p>

            {artwork.description && (
              <p className="text-sm text-smoke leading-relaxed mb-6">{artwork.description}</p>
            )}

            {/* Product selector */}
            <div className="mb-6">
              <p className="text-xs text-smoke mb-2">选择产品</p>
              <div className="grid grid-cols-2 gap-2">
                {PRODUCTS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedProduct.id === p.id
                        ? 'border-vermilion bg-vermilion/5'
                        : 'border-light-ink hover:border-smoke'
                    }`}
                  >
                    <p className="text-sm font-medium text-ink">{p.label}</p>
                    <p className="text-xs text-smoke">${p.price}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Buy CTA */}
            <button
              onClick={handleBuy}
              disabled={buying}
              className="w-full py-4 bg-ink text-paper font-medium rounded-xl hover:bg-ink/80 flex items-center justify-center gap-2 mb-3 disabled:opacity-70"
            >
              {buying ? <Loader2 size={18} className="animate-spin" /> : <ShoppingBag size={18} />}
              {buying ? 'Redirecting...' : `Buy Now — $${selectedProduct.price}`}
            </button>
            {paymentError && <p className="text-xs text-red-500 text-center mb-2">{paymentError}</p>}
            <p className="text-xs text-smoke text-center">
              Secure checkout via Stripe · Ships worldwide · 7-14 business days
            </p>

            {/* Tags */}
            {artwork.tags?.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {(artwork.tags as string[]).map(tag => (
                  <span key={tag} className="text-xs bg-warm-gray px-2.5 py-1 rounded-full text-smoke">#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
