import { useState, useEffect } from 'react'
import { TrendingUp, Eye, ShoppingBag, Clock } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'

interface Stats {
  total_artworks: number
  total_orders: number
  total_earnings: number
  pending_review: number
}

export default function Overview() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getCreatorDashboard()
      .then((data: unknown) => setStats(data as Stats))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const cards = [
    { label: '我的作品', value: stats?.total_artworks ?? '-', icon: Eye, color: 'text-vermilion' },
    { label: '总订单', value: stats?.total_orders ?? '-', icon: ShoppingBag, color: 'text-ink' },
    { label: '总收入', value: stats ? `$${stats.total_earnings.toFixed(2)}` : '-', icon: TrendingUp, color: 'text-bamboo' },
    { label: '待审核', value: stats?.pending_review ?? '-', icon: Clock, color: 'text-smoke' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-ink">你好，{user?.artist_name || user?.username}</h1>
        <p className="text-sm text-smoke mt-0.5">这是你的创作数据概览</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-warm-gray rounded-xl p-5 animate-pulse h-24" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <div key={card.label} className="bg-warm-gray rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <card.icon size={16} className={card.color} strokeWidth={1.5} />
                <p className="text-xs text-smoke">{card.label}</p>
              </div>
              <p className={`text-2xl font-semibold ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Recent activity placeholder */}
      <div className="bg-warm-gray rounded-xl p-5">
        <p className="text-sm font-medium text-ink mb-3">最近动态</p>
        <div className="space-y-3">
          {stats?.pending_review ? (
            <div className="flex items-center gap-3 p-3 bg-paper rounded-lg">
              <Clock size={14} className="text-smoke flex-shrink-0" />
              <p className="text-sm text-smoke">你有 {stats.pending_review} 件作品正在等待审核</p>
            </div>
          ) : (
            <p className="text-sm text-smoke/60 italic">暂无动态，上传作品后会显示在这里</p>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-4">
        <a href="#/creator/artworks" className="p-4 bg-warm-gray rounded-xl text-center hover:bg-light-ink transition-colors">
          <p className="text-sm font-medium text-ink">上传新作品</p>
          <p className="text-xs text-smoke mt-0.5">开始创作</p>
        </a>
        <a href="#/creator/subscription" className="p-4 bg-warm-gray rounded-xl text-center hover:bg-light-ink transition-colors">
          <p className="text-sm font-medium text-ink">查看订阅方案</p>
          <p className="text-xs text-smoke mt-0.5">升级以获得更高版税</p>
        </a>
      </div>
    </div>
  )
}
