import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Heart, Share2, ExternalLink } from 'lucide-react'
import ArtworkCard from '../components/ArtworkCard'

const artworkData = {
  id: 1,
  title: 'Mountain Waters',
  artist_name: 'Li Mobai',
  username: 'limobai',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
  description: 'Inspired by traditional Chinese landscape painting, this piece seeks to recreate the atmosphere of "wandering and dwelling" within a modern design language. The use of negative space and contrast creates a sense of depth and tranquility.',
  image_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200&q=80',
  tags: ['Landscape', 'Ink', 'Modern Chinese'],
  likes: 234,
  price: 45,
}

const products = [
  { id: 1, name: 'Classic T-Shirt', label: 'T-Shirt', price: 35 },
  { id: 2, name: 'Premium T-Shirt', label: 'Premium Tee', price: 42 },
  { id: 3, name: 'Canvas Print', label: 'Canvas', price: 65 },
  { id: 4, name: 'Poster', label: 'Poster', price: 25 },
  { id: 5, name: 'Mug', label: 'Mug', price: 22 },
  { id: 6, name: 'Tote Bag', label: 'Tote Bag', price: 28 },
]

const relatedArtworks = [
  { id: 2, title: 'Urban Nights', artist_name: 'Chen Ruoshui', image_url: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&q=80', price: 38 },
  { id: 3, title: 'Bamboo Forest', artist_name: 'Zhang Sumiao', image_url: 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=600&q=80', price: 52 },
  { id: 5, title: 'Flower Study', artist_name: 'Zhao Qingya', image_url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&q=80', price: 35 },
  { id: 7, title: 'Abstract Ink', artist_name: 'Wu Taosheng', image_url: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600&q=80', price: 58 },
]

export default function ArtworkDetail() {
  const params = useParams()
  void params.id
  const [selectedProduct, setSelectedProduct] = useState(products[0])
  const [selectedSize, setSelectedSize] = useState('M')
  const [liked, setLiked] = useState(false)

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

  return (
    <div className="pt-16">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <nav className="text-sm text-smoke">
          <Link to="/" className="hover:text-ink transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/" className="hover:text-ink transition-colors">Artworks</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{artworkData.title}</span>
        </nav>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image */}
          <div className="rounded-2xl overflow-hidden bg-warm-gray">
            <img src={artworkData.image_url} alt={artworkData.title} className="w-full aspect-square object-cover" />
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <Link to={`/artist/${artworkData.username}`} className="flex items-center gap-3 mb-6 group">
              <img src={artworkData.avatar} alt={artworkData.artist_name} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <p className="text-sm font-medium text-ink group-hover:text-vermilion transition-colors">{artworkData.artist_name}</p>
                <p className="text-xs text-smoke">Artist</p>
              </div>
            </Link>

            <h1 className="text-2xl md:text-3xl font-semibold text-ink mb-3">{artworkData.title}</h1>

            <div className="flex items-center gap-4 mb-6">
              <button onClick={() => setLiked(!liked)} className={`flex items-center gap-1.5 text-sm transition-colors ${liked ? 'text-vermilion' : 'text-smoke hover:text-vermilion'}`}>
                <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
                {artworkData.likes + (liked ? 1 : 0)}
              </button>
              <button className="flex items-center gap-1.5 text-sm text-smoke hover:text-ink transition-colors">
                <Share2 size={16} /> Share
              </button>
            </div>

            <p className="text-smoke text-sm leading-relaxed mb-6">{artworkData.description}</p>

            <div className="flex flex-wrap gap-2 mb-8">
              {artworkData.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-warm-gray text-sm text-smoke rounded-full text-xs">
                  {tag}
                </span>
              ))}
            </div>

            <div className="border-t border-light-ink mb-8" />

            {/* Product picker */}
            <div className="mb-5">
              <p className="text-sm font-medium text-ink mb-3">Select Product</p>
              <div className="grid grid-cols-3 gap-2">
                {products.map((prod) => (
                  <button
                    key={prod.id}
                    onClick={() => setSelectedProduct(prod)}
                    className={`py-2.5 px-3 rounded-lg border text-sm transition-colors ${
                      selectedProduct.id === prod.id
                        ? 'border-vermilion bg-vermilion/5 text-vermilion'
                        : 'border-light-ink text-smoke hover:border-ink'
                    }`}
                  >
                    {prod.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Size picker */}
            {selectedProduct.id <= 2 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-medium text-ink">Size</p>
                  <button className="text-xs text-smoke underline">Size Guide</button>
                </div>
                <div className="flex gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-11 h-10 rounded-lg border text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-vermilion bg-vermilion/5 text-vermilion'
                          : 'border-light-ink text-smoke hover:border-ink'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price & CTA */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-smoke mb-0.5">Starting at</p>
                <p className="text-3xl font-semibold text-ink">${selectedProduct.price}</p>
              </div>
              <a
                href="#"
                className="px-8 py-3.5 bg-vermilion text-paper font-medium rounded-lg hover:bg-vermilion/90 transition-colors flex items-center gap-2"
              >
                Buy on Gumroad <ExternalLink size={16} />
              </a>
            </div>
            <p className="text-xs text-smoke">
              Ships from US, EU or AU · 7-14 business days delivery
            </p>
          </div>
        </div>
      </div>

      {/* Related */}
      <section className="py-20 px-6 bg-warm-gray">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-semibold text-ink mb-8">More Like This</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedArtworks.map((art) => (
              <ArtworkCard key={art.id} artwork={art} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
