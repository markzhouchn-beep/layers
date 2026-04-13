import { useState } from 'react'
import { Plus, TrendingUp, ShoppingBag, Clock, Check, X, Edit3, Image } from 'lucide-react'
import MockupGenerator from '../components/MockupGenerator'
import { useI18n } from '../i18n'

const mockArtworks = [
  { id: 1, title: '山水之间', status: 'approved', views: 1234, likes: 89, sales: 12, thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=300&q=80' },
  { id: 2, title: '都市夜景', status: 'pending', views: 0, likes: 0, sales: 0, thumbnail: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=300&q=80' },
  { id: 3, title: '竹林深处', status: 'rejected', views: 456, likes: 23, sales: 0, thumbnail: 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=300&q=80' },
]

const statusConfig = {
  approved: { label: '已通过', icon: Check, color: 'text-bamboo bg-bamboo/10', dot: 'bg-bamboo' },
  pending: { label: '待审核', icon: Clock, color: 'text-rattan bg-rattan/10', dot: 'bg-rattan' },
  rejected: { label: '已拒绝', icon: X, color: 'text-vermilion bg-vermilion/10', dot: 'bg-vermilion' },
}

export default function CreatorDashboard() {
  const { t } = useI18n()
  const [view, setView] = useState<'list' | 'upload'>('list')
  const [selectedTab, setSelectedTab] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all')

  const filtered = selectedTab === 'all' ? mockArtworks
    : mockArtworks.filter(a => a.status === selectedTab)

  return (
    <div className="pt-16 min-h-screen bg-paper">
      {/* Header */}
      <div className="bg-ink text-paper px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-semibold mb-6">{t.creator.dashboard}</h1>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: t.creator.totalEarnings, value: '$0.00', icon: TrendingUp, sub: '+$0 this month' },
              { label: t.creator.totalSales, value: '0', icon: ShoppingBag, sub: 'orders' },
              { label: t.creator.pendingReview, value: '1', icon: Clock, sub: '' },
              { label: t.creator.approved, value: '1', icon: Check, sub: 'artworks' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 rounded-xl p-4">
                <p className="text-xs text-paper/50 mb-1">{stat.label}</p>
                <p className="text-2xl font-semibold text-paper">{stat.value}</p>
                <p className="text-xs text-paper/30 mt-0.5">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-1 bg-warm-gray rounded-lg p-1">
            {[
              { key: 'all', label: `全部 (${mockArtworks.length})` },
              { key: 'approved', label: `${t.creator.approved} (${mockArtworks.filter(a => a.status === 'approved').length})` },
              { key: 'pending', label: `${t.creator.pendingReview} (${mockArtworks.filter(a => a.status === 'pending').length})` },
              { key: 'rejected', label: `${t.creator.rejected} (${mockArtworks.filter(a => a.status === 'rejected').length})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key as typeof selectedTab)}
                className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  selectedTab === tab.key
                    ? 'bg-paper text-ink shadow-sm'
                    : 'text-smoke hover:text-ink'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setView(view === 'list' ? 'upload' : 'list')}
            className="flex items-center gap-2 px-4 py-2 bg-vermilion text-paper text-xs font-medium rounded-lg hover:bg-vermilion/90 transition-colors"
          >
            {view === 'list' ? (
              <><Plus size={14} /> {t.creator.uploadNew}</>
            ) : (
              <><Image size={14} /> 查看列表</>
            )}
          </button>
        </div>

        {/* Upload / Mockup view */}
        {view === 'upload' && (
          <div className="bg-white rounded-2xl border border-light-ink p-6 mb-8">
            <h2 className="text-base font-semibold text-ink mb-4">{t.creator.editMockup}</h2>
            <MockupGenerator />
          </div>
        )}

        {/* Artwork grid */}
        {view === 'list' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((artwork) => {
              const config = statusConfig[artwork.status as keyof typeof statusConfig]
              return (
                <div key={artwork.id} className="bg-white rounded-xl border border-light-ink overflow-hidden">
                  {/* Image */}
                  <div className="aspect-square bg-warm-gray overflow-hidden relative">
                    <img src={artwork.thumbnail} alt={artwork.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                        {config.label}
                      </span>
                    </div>
                    {artwork.status === 'approved' && (
                      <button
                        onClick={() => setView('upload')}
                        className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-ink/80 backdrop-blur-sm text-paper text-xs rounded-lg hover:bg-ink transition-colors"
                      >
                        <Edit3 size={12} /> {t.creator.editMockup}
                      </button>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-ink mb-3">{artwork.title}</h3>
                    {artwork.status === 'approved' && (
                      <div className="flex gap-4 text-xs text-smoke">
                        <span>{artwork.views} views</span>
                        <span>{artwork.likes} likes</span>
                        <span>{artwork.sales} sold</span>
                      </div>
                    )}
                    {artwork.status === 'rejected' && (
                      <p className="text-xs text-vermilion">图片分辨率不足，建议上传更高质量文件</p>
                    )}
                  </div>
                </div>
              )
            })}

            {/* Upload card */}
            <button
              onClick={() => setView('upload')}
              className="aspect-square bg-warm-gray rounded-xl border-2 border-dashed border-light-ink flex flex-col items-center justify-center gap-2 text-smoke hover:border-vermilion hover:text-vermilion transition-colors"
            >
              <Plus size={28} strokeWidth={1.5} />
              <span className="text-sm font-medium">{t.creator.uploadNew}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
