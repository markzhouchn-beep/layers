import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Shirt, Frame, Coffee, ShoppingBag, Smartphone } from 'lucide-react'
import ArtworkCard from '../components/ArtworkCard'

// Mock data for display
const featuredArtworks = [
  { id: 1, title: '山水之间', artist_name: '李墨白', image_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80', price: 45 },
  { id: 2, title: '都市夜景', artist_name: '陈若水', image_url: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&q=80', price: 38 },
  { id: 3, title: '竹林深处', artist_name: '张素描', image_url: 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=600&q=80', price: 52 },
  { id: 4, title: '落日余晖', artist_name: '王染青', image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', price: 40 },
  { id: 5, title: '白描花卉', artist_name: '赵清雅', image_url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&q=80', price: 35 },
  { id: 6, title: '古镇小巷', artist_name: '周逸风', image_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80', price: 42 },
  { id: 7, title: '抽象水墨', artist_name: '吴涛声', image_url: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600&q=80', price: 58 },
  { id: 8, title: '春江水暖', artist_name: '郑云淡', image_url: 'https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=600&q=80', price: 47 },
]

const categories = [
  { name: 'T-Shirt', label: 'T恤', icon: Shirt, count: 128 },
  { name: 'Poster', label: '海报', icon: Frame, count: 96 },
  { name: 'Canvas', label: '画布', icon: Frame, count: 84 },
  { name: 'Mug', label: '马克杯', icon: Coffee, count: 62 },
  { name: 'Bag', label: '帆布包', icon: ShoppingBag, count: 54 },
  { name: 'Phone', label: '手机壳', icon: Smartphone, count: 78 },
]

export default function Home() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1600&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-ink/60" />
        </div>

        {/* Content */}
        <div
          className={`relative z-10 text-center px-6 max-w-4xl mx-auto transition-all duration-700 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <p className="text-paper/60 text-sm uppercase tracking-[0.2em] mb-6">
            中国艺术家 · 全球版画平台
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-paper leading-tight mb-6">
            中国艺术家<br />
            <span className="text-paper/80">全球舞台</span>
          </h1>
          <p className="text-paper/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            将你的原创作品，变成世界各地的珍藏。<br />
            零库存、零物流、零风险。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/join"
              className="px-8 py-3.5 bg-vermilion text-paper font-medium rounded-lg hover:bg-vermilion/90 transition-colors inline-flex items-center justify-center gap-2"
            >
              开始创作 <ArrowRight size={18} />
            </Link>
            <a
              href="#artworks"
              className="px-8 py-3.5 bg-paper/10 backdrop-blur-sm border border-paper/20 text-paper font-medium rounded-lg hover:bg-paper/20 transition-colors"
            >
              探索作品
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-5 h-8 border-2 border-paper/40 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-paper/60 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-ink mb-3">
              用你的设计，装点生活
            </h2>
            <p className="text-smoke text-base">12 款精选产品，全部由你设计</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/category/${cat.name}`}
                className="group flex flex-col items-center p-6 bg-warm-gray rounded-2xl hover:bg-light-ink transition-colors text-center"
              >
                <div className="w-12 h-12 flex items-center justify-center mb-3 text-ink group-hover:text-vermilion transition-colors">
                  <cat.icon size={28} strokeWidth={1.5} />
                </div>
                <p className="text-sm font-medium text-ink mb-0.5">{cat.label}</p>
                <p className="text-xs text-smoke">{cat.count} 件商品</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Artworks */}
      <section id="artworks" className="py-20 px-6 bg-warm-gray">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-xs uppercase tracking-wider text-smoke mb-2">精选作品</p>
              <h2 className="text-2xl md:text-3xl font-semibold text-ink">
                发现独特设计
              </h2>
            </div>
            <Link
              to="/explore"
              className="hidden md:flex items-center gap-1.5 text-sm font-medium text-smoke hover:text-vermilion transition-colors"
            >
              查看全部 <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredArtworks.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>

          <div className="mt-10 text-center md:hidden">
            <Link
              to="/explore"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-vermilion"
            >
              查看全部作品 <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-wider text-smoke mb-2">艺术家入驻</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-ink">
              三步，开启你的全球商店
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: '上传作品',
                desc: '提交你的原创艺术作品，等待审核通过',
              },
              {
                step: '02',
                title: '选择产品',
                desc: '从 12 款精选产品中选择你的设计载体',
              },
              {
                step: '03',
                title: '全球销售',
                desc: '通过 Instagram 触达全球消费者，坐等版税到账',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-5xl font-light text-light-ink mb-4">{item.step}</div>
                <h3 className="text-base font-semibold text-ink mb-2">{item.title}</h3>
                <p className="text-sm text-smoke leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-ink text-paper">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            准备好让世界看见你的作品了吗？
          </h2>
          <p className="text-paper/60 text-lg mb-8">
            加入 Layers，让你的原创艺术走进全球百万家庭
          </p>
          <Link
            to="/join"
            className="inline-flex items-center gap-2 px-8 py-4 bg-vermilion text-paper font-medium rounded-lg hover:bg-vermilion/90 transition-colors"
          >
            立即入驻 <ArrowRight size={18} />
          </Link>

          <div className="mt-10 flex justify-center gap-8 text-sm text-paper/40">
            <span>¥0 入驻</span>
            <span>·</span>
            <span>15 分钟完成</span>
            <span>·</span>
            <span>全球收款</span>
          </div>
        </div>
      </section>
    </div>
  )
}
