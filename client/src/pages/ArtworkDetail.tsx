import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Eye, ShoppingBag, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../services/api'

const PRODUCTS = [
  { id: 5, label: 'Classic T-Shirt', price: 35 },
  { id: 6, label: 'Premium T-Shirt', price: 42 },
  { id: 10, label: 'Classic Mug', price: 22 },
  { id: 31, label: 'Poster', price: 28 },
  { id: 34, label: 'Canvas Print', price: 55 },
  { id: 21, label: 'Tote Bag', price: 25 },
  { id: 27, label: 'Phone Case', price: 30 },
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
}

export default function ArtworkDetail() {
  const { id } = useParams<{ id: string }>()
  const [artwork, setArtwork] = useState<Artwork | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0])

  useEffect(() => {
    if (!id) return
    api.getArtwork(id)
      .then(setArtwork)
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
            <button className="w-full py-4 bg-ink text-paper font-medium rounded-xl hover:bg-ink/80 flex items-center justify-center gap-2 mb-3">
              <ShoppingBag size={18} /> Buy Now — ${selectedProduct.price}
            </button>
            <p className="text-xs text-smoke text-center">
              Ships worldwide from US/EU/Australia · 7-14 business days
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
