import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Shirt, Frame, Coffee, ShoppingBag, Smartphone } from 'lucide-react'
import ArtworkCard from '../components/ArtworkCard'

const featuredArtworks = [
  { id: 1, title: '山水之间', artist_name: '李墨白', image_url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80', price: 45 },
  { id: 2, title: 'Urban Nights', artist_name: '陈若水', image_url: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&q=80', price: 38 },
  { id: 3, title: '竹林深处', artist_name: '张素描', image_url: 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=600&q=80', price: 52 },
  { id: 4, title: '落日余晖', artist_name: '王染青', image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', price: 40 },
  { id: 5, title: '白描花卉', artist_name: '赵清雅', image_url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&q=80', price: 35 },
  { id: 6, title: '古镇小巷', artist_name: '周逸风', image_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80', price: 42 },
  { id: 7, title: '抽象水墨', artist_name: '吴涛声', image_url: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600&q=80', price: 58 },
  { id: 8, title: '春江水暖', artist_name: '郑云淡', image_url: 'https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=600&q=80', price: 47 },
]

const categories = [
  { name: 'T-Shirt', label: 'T-Shirt', icon: Shirt, count: 128 },
  { name: 'Poster', label: 'Poster', icon: Frame, count: 96 },
  { name: 'Canvas', label: 'Canvas Print', icon: Frame, count: 84 },
  { name: 'Mug', label: 'Mug', icon: Coffee, count: 62 },
  { name: 'Bag', label: 'Tote Bag', icon: ShoppingBag, count: 54 },
  { name: 'Phone', label: 'Phone Case', icon: Smartphone, count: 78 },
]

export default function Storefront() {
  const [loaded] = useState(false)

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1600&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-ink/60" />
        </div>

        <div
          className={`relative z-10 text-center px-6 max-w-4xl mx-auto transition-all duration-700 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <p className="text-paper/50 text-xs uppercase tracking-[0.3em] mb-6">
            Original Chinese Art · Worldwide Delivery
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-paper leading-tight mb-6">
            Art That Travels<br />
            <span className="text-paper/80">the Globe</span>
          </h1>
          <p className="text-paper/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Exclusive designs from China's finest independent artists.<br />
            Printed on-demand. Shipped worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#artworks"
              className="px-8 py-3.5 bg-paper text-ink font-medium rounded-lg hover:bg-paper/90 transition-colors inline-flex items-center justify-center gap-2"
            >
              Shop Now <ArrowRight size={18} />
            </a>
            <Link
              to="/join"
              className="px-8 py-3.5 bg-vermilion text-paper font-medium rounded-lg hover:bg-vermilion/90 transition-colors inline-flex items-center justify-center gap-2"
            >
              For Artists
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-5 h-8 border-2 border-paper/40 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-paper/60 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-ink mb-3">
              Shop by Product
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <a
                key={cat.name}
                href={`#`}
                className="group flex flex-col items-center p-5 bg-warm-gray rounded-2xl hover:bg-light-ink transition-colors text-center"
              >
                <div className="w-12 h-12 flex items-center justify-center mb-3 text-ink group-hover:text-vermilion transition-colors">
                  <cat.icon size={26} strokeWidth={1.5} />
                </div>
                <p className="text-sm font-medium text-ink mb-0.5">{cat.label}</p>
                <p className="text-xs text-smoke">{cat.count} designs</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Artworks */}
      <section id="artworks" className="py-20 px-6 bg-warm-gray">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-xs uppercase tracking-wider text-smoke mb-2">Featured</p>
              <h2 className="text-2xl md:text-3xl font-semibold text-ink">
                Discover Unique Art
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredArtworks.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold text-ink mb-3">
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Choose Your Design',
                desc: 'Browse thousands of original artworks from Chinese independent artists',
              },
              {
                step: '02',
                title: 'Select Product',
                desc: 'T-Shirts, mugs, posters, canvas prints and more — all printed on-demand',
              },
              {
                step: '03',
                title: 'Worldwide Delivery',
                desc: 'Printed in the US, EU or Australia. Ships within 7-14 business days',
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
            Are You a Chinese Artist?
          </h2>
          <p className="text-paper/60 text-lg mb-8">
            Join Layers and turn your original artwork into a global income stream. Subscribe in CNY, earn in USD.
          </p>
          <Link
            to="/join"
            className="inline-flex items-center gap-2 px-8 py-4 bg-vermilion text-paper font-medium rounded-lg hover:bg-vermilion/90 transition-colors"
          >
            Join as Artist <ArrowRight size={18} />
          </Link>
          <div className="mt-10 flex justify-center gap-8 text-sm text-paper/40">
            <span>¥0 to start</span>
            <span>·</span>
            <span>15 min setup</span>
            <span>·</span>
            <span>Global audience</span>
          </div>
        </div>
      </section>
    </div>
  )
}
