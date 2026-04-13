import { useState } from 'react'
import { Check, X, Eye, Users, Image, ShoppingBag, Clock } from 'lucide-react'
import { useI18n } from '../i18n'

const mockPending = [
  { id: 1, title: '云海翻涌', artist: '李墨白', username: 'limobai', email: 'li@test.com', thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=80', submittedAt: '2小时前' },
  { id: 2, title: '秋日山林', artist: '陈若水', username: 'chenruo', email: 'chen@test.com', thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80', submittedAt: '5小时前' },
]

const stats = [
  { label: '总作品数', value: '24', icon: Image, color: 'text-ink' },
  { label: '待审核', value: '2', icon: Clock, color: 'text-rattan' },
  { label: '艺术家数', value: '8', icon: Users, color: 'text-bamboo' },
  { label: '总订单', value: '156', icon: ShoppingBag, color: 'text-vermilion' },
]

export default function AdminDashboard() {
  const { t } = useI18n()
  const [pending, setPending] = useState(mockPending)
  const [tab, setTab] = useState<'pending' | 'approved' | 'rejected'>('pending')

  const approve = (id: number) => {
    setPending(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="pt-16 min-h-screen bg-paper">
      {/* Header */}
      <div className="bg-ink text-paper px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-semibold mb-6">{t.admin.dashboard}</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <s.icon size={16} className={s.color} />
                  <p className="text-xs text-paper/50">{s.label}</p>
                </div>
                <p className="text-2xl font-semibold text-paper">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-warm-gray rounded-lg p-1 mb-6 w-fit">
          {[
            { key: 'pending', label: `${t.admin.pending} (${mockPending.length})` },
            { key: 'approved', label: `${t.admin.approved} (19)` },
            { key: 'rejected', label: `${t.admin.rejected} (3)` },
          ].map((t_) => (
            <button
              key={t_.key}
              onClick={() => setTab(t_.key as typeof tab)}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
                tab === t_.key ? 'bg-paper text-ink shadow-sm' : 'text-smoke hover:text-ink'
              }`}
            >
              {t_.label}
            </button>
          ))}
        </div>

        {/* Pending list */}
        {tab === 'pending' && (
          <div className="space-y-4">
            {pending.map((artwork) => (
              <div key={artwork.id} className="bg-white rounded-xl border border-light-ink p-4 flex gap-4 items-center">
                <img src={artwork.thumbnail} alt={artwork.title} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-ink">{artwork.title}</h3>
                  <p className="text-xs text-smoke mt-0.5">by {artwork.artist} · @{artwork.username}</p>
                  <p className="text-xs text-smoke mt-0.5">提交于 {artwork.submittedAt}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => approve(artwork.id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-bamboo text-paper text-xs font-medium rounded-lg hover:bg-bamboo/90"
                  >
                    <Check size={14} /> {t.admin.approve}
                  </button>
                  <button
                    onClick={() => setPending(prev => prev.filter(p => p.id !== artwork.id))}
                    className="flex items-center gap-1.5 px-4 py-2 border border-light-ink text-xs font-medium text-smoke rounded-lg hover:bg-warm-gray"
                  >
                    <X size={14} /> {t.admin.reject}
                  </button>
                  <button className="w-9 h-9 flex items-center justify-center border border-light-ink rounded-lg text-smoke hover:bg-warm-gray">
                    <Eye size={14} />
                  </button>
                </div>
              </div>
            ))}
            {pending.length === 0 && (
              <div className="text-center py-16 text-smoke">
                <p>暂无待审核作品</p>
              </div>
            )}
          </div>
        )}

        {tab === 'approved' && (
          <div className="text-center py-16 text-smoke">
            <p>已通过作品列表（开发中）</p>
          </div>
        )}

        {tab === 'rejected' && (
          <div className="text-center py-16 text-smoke">
            <p>已拒绝作品列表（开发中）</p>
          </div>
        )}
      </div>
    </div>
  )
}
