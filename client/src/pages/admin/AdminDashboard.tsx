import { useState } from 'react'
import { Check, X, Eye, Image, Users, ShoppingBag, Clock, ArrowUpRight } from 'lucide-react'

const stats = [
  { label: '总作品', value: '24', icon: Image, color: 'text-ink', change: '+3 本月' },
  { label: '待审核', value: '2', icon: Clock, color: 'text-rattan', change: '需处理' },
  { label: '创作者', value: '8', icon: Users, color: 'text-bamboo', change: '+2 本月' },
  { label: '总订单', value: '156', icon: ShoppingBag, color: 'text-vermilion', change: '+12 本月' },
]

const pendingArtworks = [
  { id: 1, title: '云海翻涌', artist: '李墨白', username: 'limobai', thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=80', plan: 'basic', submittedAt: '2小时前' },
  { id: 2, title: '秋日山林', artist: '陈若水', username: 'chenruo', thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', plan: 'pro', submittedAt: '5小时前' },
]

const recentOrders = [
  { id: 'ORD-001', artwork: '山水之间', artist: '李墨白', platform: 'Gumroad', amount: '$35.00', status: 'paid', date: '2小时前' },
  { id: 'ORD-002', artwork: '都市夜景', artist: '陈若水', platform: 'Etsy', amount: '$42.00', status: 'producing', date: '1天前' },
  { id: 'ORD-003', artwork: '竹林深处', artist: '张素描', platform: 'Gumroad', amount: '$52.00', status: 'shipped', date: '3天前' },
]

const platformSummary = [
  { platform: 'Gumroad', orders: 89, revenue: '$3,115', syncStatus: 'active' },
  { platform: 'Etsy', orders: 45, revenue: '$1,890', syncStatus: 'active' },
  { platform: 'Amazon', orders: 22, revenue: '$770', syncStatus: 'degraded' },
]

const tabConfig = {
  dashboard: { label: '数据大盘', component: 'stats' },
  artworks: { label: '作品审核', component: 'artworks' },
  orders: { label: '订单管理', component: 'orders' },
  creators: { label: '创作者', component: 'creators' },
  platforms: { label: '外部平台', component: 'platforms' },
}

type Tab = 'dashboard' | 'artworks' | 'orders' | 'creators' | 'platforms'

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('dashboard')
  const [pending, setPending] = useState(pendingArtworks)

  const approve = (id: number) => setPending(p => p.filter(x => x.id !== id))

  return (
    <div className="pt-16 min-h-screen bg-warm-gray">
      {/* Header */}
      <div className="bg-ink text-paper px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">运营管理后台</h1>
              <p className="text-paper/50 text-sm mt-1">Layers 平台管理中心</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-paper/50">admin@layershop.store</span>
              <div className="w-8 h-8 bg-vermilion rounded-full flex items-center justify-center text-sm font-medium">A</div>
            </div>
          </div>
        </div>
      </div>

      {/* Nav tabs */}
      <div className="bg-paper border-b border-light-ink sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 h-12 overflow-x-auto">
            {(Object.entries(tabConfig) as [Tab, typeof tabConfig.dashboard][]).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  tab === key ? 'bg-ink text-paper' : 'text-smoke hover:text-ink hover:bg-warm-gray'
                }`}
              >
                {cfg.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Dashboard tab */}
        {tab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="bg-white rounded-xl border border-light-ink p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-smoke">{s.label}</p>
                    <s.icon size={16} className={s.color} />
                  </div>
                  <p className="text-2xl font-semibold text-ink">{s.value}</p>
                  <p className="text-xs text-smoke mt-1">{s.change}</p>
                </div>
              ))}
            </div>

            {/* Pending review */}
            {pending.length > 0 && (
              <div className="bg-white rounded-xl border border-light-ink overflow-hidden">
                <div className="px-6 py-4 border-b border-light-ink flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-ink">待审核作品</h2>
                    <span className="px-2 py-0.5 bg-rattan/10 text-rattan text-xs rounded-full">{pending.length}</span>
                  </div>
                  <button onClick={() => setTab('artworks')} className="text-xs text-vermilion hover:underline flex items-center gap-1">
                    查看全部 <ArrowUpRight size={12} />
                  </button>
                </div>
                <div className="divide-y divide-light-ink">
                  {pending.map((artwork) => (
                    <div key={artwork.id} className="px-6 py-4 flex items-center gap-4">
                      <img src={artwork.thumbnail} alt={artwork.title} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink">{artwork.title}</p>
                        <p className="text-xs text-smoke mt-0.5">by {artwork.artist} · @{artwork.username} · {artwork.submittedAt}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => approve(artwork.id)} className="flex items-center gap-1.5 px-4 py-2 bg-bamboo text-paper text-xs font-medium rounded-lg hover:bg-bamboo/90">
                          <Check size={14} /> 通过
                        </button>
                        <button onClick={() => setPending(p => p.filter(x => x.id !== artwork.id))} className="flex items-center gap-1.5 px-4 py-2 border border-light-ink text-xs text-smoke rounded-lg hover:bg-warm-gray">
                          <X size={14} /> 拒绝
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent orders */}
            <div className="bg-white rounded-xl border border-light-ink overflow-hidden">
              <div className="px-6 py-4 border-b border-light-ink flex items-center justify-between">
                <h2 className="font-semibold text-ink">最近订单</h2>
                <button onClick={() => setTab('orders')} className="text-xs text-vermilion hover:underline flex items-center gap-1">
                  查看全部 <ArrowUpRight size={12} />
                </button>
              </div>
              <div className="divide-y divide-light-ink">
                {recentOrders.map((order) => (
                  <div key={order.id} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-ink">{order.artwork}</p>
                      <p className="text-xs text-smoke mt-0.5">{order.platform} · {order.id} · {order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-ink">{order.amount}</p>
                      <p className="text-xs text-smoke">{order.artist}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      order.status === 'paid' ? 'bg-bamboo/10 text-bamboo' :
                      order.status === 'producing' ? 'bg-rattan/10 text-rattan' :
                      order.status === 'shipped' ? 'bg-ink/10 text-ink' : 'bg-light-ink text-smoke'
                    }`}>
                      {order.status === 'paid' ? '已收款' : order.status === 'producing' ? '生产中' : order.status === 'shipped' ? '已发货' : order.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Artworks tab */}
        {tab === 'artworks' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-ink">作品审核</h2>
              <div className="flex gap-1 bg-warm-gray rounded-lg p-1">
                {['待审核', '已通过', '已拒绝'].map((label, i) => (
                  <button key={i} className={`px-3 py-1 rounded text-xs font-medium ${i === 0 ? 'bg-paper text-ink shadow-sm' : 'text-smoke'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {pending.length === 0 ? (
              <div className="text-center py-16 text-smoke bg-white rounded-xl border border-light-ink">
                <p>暂无待审核作品</p>
              </div>
            ) : (
              pending.map((artwork) => (
                <div key={artwork.id} className="bg-white rounded-xl border border-light-ink p-5 flex items-center gap-4">
                  <img src={artwork.thumbnail} alt={artwork.title} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-ink">{artwork.title}</h3>
                    <p className="text-xs text-smoke mt-0.5">by {artwork.artist} · 方案: {artwork.plan} · {artwork.submittedAt}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => approve(artwork.id)} className="flex items-center gap-1.5 px-4 py-2 bg-bamboo text-paper text-xs font-medium rounded-lg">
                      <Check size={14} /> 通过
                    </button>
                    <button onClick={() => setPending(p => p.filter(x => x.id !== artwork.id))} className="flex items-center gap-1.5 px-4 py-2 border border-light-ink text-xs text-smoke rounded-lg">
                      <X size={14} /> 拒绝
                    </button>
                    <button className="w-9 h-9 flex items-center justify-center border border-light-ink rounded-lg text-smoke hover:bg-warm-gray">
                      <Eye size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Orders tab */}
        {tab === 'orders' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-light-ink overflow-hidden">
              <div className="px-6 py-4 border-b border-light-ink">
                <h2 className="font-semibold text-ink">全部订单</h2>
              </div>
              <div className="divide-y divide-light-ink">
                {recentOrders.map((order) => (
                  <div key={order.id} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-ink">{order.artwork}</p>
                      <p className="text-xs text-smoke mt-0.5">{order.platform} · {order.id} · {order.date}</p>
                    </div>
                    <div className="text-right mr-4">
                      <p className="text-sm font-medium text-ink">{order.amount}</p>
                      <p className="text-xs text-smoke">{order.artist}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      order.status === 'paid' ? 'bg-bamboo/10 text-bamboo' : order.status === 'producing' ? 'bg-rattan/10 text-rattan' : 'bg-ink/10 text-ink'
                    }`}>
                      {order.status === 'paid' ? '已收款' : order.status === 'producing' ? '生产中' : '已发货'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Creators tab */}
        {tab === 'creators' && (
          <div className="bg-white rounded-xl border border-light-ink overflow-hidden">
            <div className="px-6 py-4 border-b border-light-ink">
              <h2 className="font-semibold text-ink">创作者列表</h2>
            </div>
            <div className="divide-y divide-light-ink">
              {[
                { name: '李墨白', username: 'limobai', plan: 'Basic', artworks: 12, status: 'active' },
                { name: '陈若水', username: 'chenruo', plan: 'Pro', artworks: 8, status: 'active' },
                { name: '张素描', username: 'zhangsumiao', plan: 'Free', artworks: 3, status: 'active' },
              ].map((c) => (
                <div key={c.username} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-warm-gray rounded-full flex items-center justify-center text-sm font-medium text-ink">
                      {c.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink">{c.name}</p>
                      <p className="text-xs text-smoke">@{c.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs px-2 py-0.5 bg-warm-gray text-smoke rounded">{c.plan}</span>
                    <span className="text-xs text-smoke">{c.artworks} 件作品</span>
                    <span className={`w-2 h-2 rounded-full ${c.status === 'active' ? 'bg-bamboo' : 'bg-vermilion'}`} />
                    <button className="text-xs text-vermilion hover:underline">管理</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Platforms tab */}
        {tab === 'platforms' && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              {platformSummary.map((p) => (
                <div key={p.platform} className="bg-white rounded-xl border border-light-ink p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-ink">{p.platform}</h3>
                    <span className={`w-2 h-2 rounded-full ${p.syncStatus === 'active' ? 'bg-bamboo' : 'bg-rattan'}`} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-smoke">订单数</span>
                      <span className="text-ink font-medium">{p.orders}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-smoke">营收</span>
                      <span className="text-ink font-medium">{p.revenue}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
