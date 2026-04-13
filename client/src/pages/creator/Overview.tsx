import { TrendingUp, ShoppingBag, Eye, Star, ArrowUpRight, ExternalLink } from 'lucide-react'

const stats = [
  { label: '累计收入', value: '$0.00', sub: '本月 +$0.00', icon: TrendingUp, color: 'text-bamboo' },
  { label: '总订单', value: '0', sub: '本月 0 单', icon: ShoppingBag, color: 'text-vermilion' },
  { label: '作品浏览', value: '0', sub: '本周 +0', icon: Eye, color: 'text-smoke' },
  { label: '平均版税', value: '8%', sub: '当前方案', icon: Star, color: 'text-rattan' },
]

const recentOrders = [
  { id: 'ORD-001', artwork: '山水之间', platform: 'Gumroad', amount: '$35.00', royalty: '$2.80', status: 'paid', date: '2小时前' },
  { id: 'ORD-002', artwork: '都市夜景', platform: 'Etsy', amount: '$42.00', royalty: '$3.36', status: 'producing', date: '1天前' },
]

const platformStats = [
  { platform: 'Gumroad', sales: 12, revenue: '$420', link: '#' },
  { platform: 'Etsy', sales: 5, revenue: '$210', link: '#' },
]

export default function CreatorOverview() {
  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-semibold text-ink">欢迎回来</h1>
        <p className="text-smoke text-sm mt-1">这里是您的创作者数据总览</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-light-ink p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-smoke">{s.label}</p>
              <s.icon size={16} className={s.color} />
            </div>
            <p className="text-2xl font-semibold text-ink">{s.value}</p>
            <p className="text-xs text-smoke mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl border border-light-ink overflow-hidden">
        <div className="px-6 py-4 border-b border-light-ink flex justify-between items-center">
          <h2 className="font-semibold text-ink">最近订单</h2>
          <a href="#" className="text-xs text-vermilion hover:underline flex items-center gap-1">
            查看全部 <ArrowUpRight size={12} />
          </a>
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
                <p className="text-xs text-bamboo mt-0.5">版税 {order.royalty}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                order.status === 'paid' ? 'bg-bamboo/10 text-bamboo' :
                order.status === 'producing' ? 'bg-rattan/10 text-rattan' : 'bg-light-ink text-smoke'
              }`}>
                {order.status === 'paid' ? '已收款' : order.status === 'producing' ? '生产中' : order.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Platform stats */}
      <div className="bg-white rounded-xl border border-light-ink overflow-hidden">
        <div className="px-6 py-4 border-b border-light-ink">
          <h2 className="font-semibold text-ink">外部平台</h2>
        </div>
        <div className="divide-y divide-light-ink">
          {platformStats.map((p) => (
            <div key={p.platform} className="px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink">{p.platform}</p>
                <p className="text-xs text-smoke mt-0.5">{p.sales} 单 · {p.revenue}</p>
              </div>
              <a href={p.link} className="flex items-center gap-1 text-xs text-vermilion hover:underline">
                <ExternalLink size={12} /> 管理
              </a>
            </div>
          ))}
          <div className="px-6 py-4">
            <button className="text-sm text-vermilion hover:underline">
              + 连接更多平台
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
