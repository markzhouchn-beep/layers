import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Heart, Share2 } from 'lucide-react'
import ArtworkCard from '../components/ArtworkCard'

// Mock artwork data
const artworkData = {
  id: 1,
  title: '山水之间',
  artist_name: '李墨白',
  username: 'limobai',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
  description: '这幅作品灵感来源于中国传统山水画，试图在现代设计语言中重现「可游、可居」的意境。运用留白与虚实对比，营造出一种静谧而深远的空间感。',
  image_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200&q=80',
  tags: ['山水', '水墨', '现代中式'],
  likes: 234,
  views: 1893,
  price: 45,
  printify_product_id: '12345',
}

const products = [
  { id: 1, name: 'Classic T-Shirt', label: 'T恤', price: 35 },
  { id: 2, name: 'Premium T-Shirt', label: '高端T恤', price: 42 },
  { id: 3, name: 'Canvas Print', label: '画布', price: 65 },
  { id: 4, name: 'Poster', label: '海报', price: 25 },
  { id: 5, name: 'Mug', label: '马克杯', price: 22 },
  { id: 6, name: 'Tote Bag', label: '帆布包', price: 28 },
]

const relatedArtworks = [
  { id: 2, title: '都市夜景', artist_name: '陈若水', image_url: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&q=80', price: 38 },
  { id: 3, title: '竹林深处', artist_name: '张素描', image_url: 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=600&q=80', price: 52 },
  { id: 5, title: '白描花卉', artist_name: '赵清雅', image_url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&q=80', price: 35 },
  { id: 7, title: '抽象水墨', artist_name: '吴涛声', image_url: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600&q=80', price: 58 },
]

export default function ArtworkDetail() {
  const params = useParams()
  void params.id // suppress unused warning
  const [selectedProduct, setSelectedProduct] = useState(products[0])
  const [selectedColor, setSelectedColor] = useState('white')
  const [selectedSize, setSelectedSize] = useState('M')
  const [liked, setLiked] = useState(false)

  const colors = ['白色', '黑色', '浅灰', '藏青']
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

  return (
    <div className="pt-16">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <nav className="text-sm text-smoke">
          <Link to="/" className="hover:text-ink transition-colors">首页</Link>
          <span className="mx-2">/</span>
          <Link to="/explore" className="hover:text-ink transition-colors">作品</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{artworkData.title}</span>
        </nav>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left: Image */}
          <div className="img-zoom rounded-2xl overflow-hidden bg-warm-gray">
            <img
              src={artworkData.image_url}
              alt={artworkData.title}
              className="w-full aspect-square object-cover"
            />
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            {/* Artist */}
            <Link to={`/artist/${artworkData.username}`} className="flex items-center gap-3 mb-6 group">
              <img
                src={artworkData.avatar}
                alt={artworkData.artist_name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium text-ink group-hover:text-vermilion transition-colors">
                  {artworkData.artist_name}
                </p>
                <p className="text-xs text-smoke">艺术家</p>
              </div>
            </Link>

            {/* Title & actions */}
            <h1 className="text-2xl md:text-3xl font-semibold text-ink mb-2">
              {artworkData.title}
            </h1>
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setLiked(!liked)}
                className={`flex items-center gap-1.5 text-sm transition-colors ${
                  liked ? 'text-vermilion' : 'text-smoke hover:text-vermilion'
                }`}
              >
                <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
                {artworkData.likes + (liked ? 1 : 0)}
              </button>
              <button className="flex items-center gap-1.5 text-sm text-smoke hover:text-ink transition-colors">
                <Share2 size={16} /> 分享
              </button>
            </div>

            {/* Description */}
            <p className="text-smoke text-sm leading-relaxed mb-6">
              {artworkData.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {artworkData.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-warm-gray text-sm text-smoke rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-light-ink mb-8" />

            {/* Product picker */}
            <div className="mb-6">
              <p className="text-sm font-medium text-ink mb-3">选择产品类型</p>
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

            {/* Color picker */}
            <div className="mb-6">
              <p className="text-sm font-medium text-ink mb-3">颜色</p>
              <div className="flex gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                      selectedColor === color
                        ? 'border-vermilion bg-vermilion/5 text-vermilion'
                        : 'border-light-ink text-smoke'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size picker */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-medium text-ink">尺码</p>
                <button className="text-xs text-smoke underline">尺码表</button>
              </div>
              <div className="flex gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-10 rounded-lg border text-sm font-medium transition-colors ${
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

            {/* Price & CTA */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-smoke mb-0.5">起售价</p>
                <p className="text-3xl font-semibold text-ink">
                  ${selectedProduct.price}
                </p>
              </div>
              <button className="px-8 py-3.5 bg-vermilion text-paper font-medium rounded-lg hover:bg-vermilion/90 transition-colors">
                立即购买
              </button>
            </div>

            <p className="text-xs text-smoke">
              由 Printify 从美国/欧洲直发，国际物流 7-14 天到达
            </p>
          </div>
        </div>
      </div>

      {/* Related */}
      <section className="py-20 px-6 bg-warm-gray">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-semibold text-ink mb-8">相关作品</h2>
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
