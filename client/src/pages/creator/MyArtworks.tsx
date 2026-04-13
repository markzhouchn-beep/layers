import { useState } from 'react'
import { Plus, Clock, Check, X, Edit3 } from 'lucide-react'

const artworks = [
  { id: 1, title: '山水之间', status: 'approved', views: 1234, likes: 89, sales: 12, thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80', externalUrls: { gumroad: '#', etsy: null } },
  { id: 2, title: '都市夜景', status: 'pending', views: 0, likes: 0, sales: 0, thumbnail: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=400&q=80', externalUrls: {} },
  { id: 3, title: '竹林深处', status: 'rejected', views: 456, likes: 23, sales: 0, thumbnail: 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=400&q=80', externalUrls: {}, rejectionReason: '图片分辨率不足' },
  { id: 4, title: '落日余晖', status: 'approved', views: 789, likes: 45, sales: 5, thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', externalUrls: { gumroad: '#' } },
  { id: 5, title: '白描花卉', status: 'approved', views: 321, likes: 18, sales: 2, thumbnail: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&q=80', externalUrls: { gumroad: '#', etsy: '#' } },
]

const statusConfig = {
  approved: { label: '已通过', icon: Check, color: 'bg-bamboo/10 text-bamboo', dot: 'bg-bamboo' },
  pending: { label: '审核中', icon: Clock, color: 'bg-rattan/10 text-rattan', dot: 'bg-rattan' },
  rejected: { label: '已拒绝', icon: X, color: 'bg-vermilion/10 text-vermilion', dot: 'bg-vermilion' },
}

type Tab = 'all' | 'approved' | 'pending' | 'rejected'

export default function MyArtworks() {
  const [tab, setTab] = useState<Tab>('all')

  const filtered = tab === 'all' ? artworks : artworks.filter(a => a.status === tab)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">我的作品</h1>
          <p className="text-sm text-smoke mt-1">共 {artworks.length} 件作品</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-vermilion text-paper text-sm font-medium rounded-lg hover:bg-vermilion/90 transition-colors">
          <Plus size={16} /> 上传新作品
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-warm-gray rounded-lg p-1 w-fit">
        {([
          { key: 'all', label: `全部 (${artworks.length})` },
          { key: 'approved', label: `已通过 (${artworks.filter(a=>a.status==='approved').length})` },
          { key: 'pending', label: `审核中 (${artworks.filter(a=>a.status==='pending').length})` },
          { key: 'rejected', label: `已拒绝 (${artworks.filter(a=>a.status==='rejected').length})` },
        ] as {key:Tab;label:string}[]).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
              tab === t.key ? 'bg-paper text-ink shadow-sm' : 'text-smoke hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((artwork) => {
          const cfg = statusConfig[artwork.status as keyof typeof statusConfig]
          return (
            <div key={artwork.id} className="bg-white rounded-xl border border-light-ink overflow-hidden">
              {/* Image */}
              <div className="aspect-square bg-warm-gray relative overflow-hidden">
                <img src={artwork.thumbnail} alt={artwork.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </span>
                </div>
                {artwork.status === 'approved' && (
                  <button className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-ink/80 backdrop-blur-sm text-paper text-xs rounded-lg hover:bg-ink transition-colors">
                    <Edit3 size={12} /> 编辑
                  </button>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="text-sm font-semibold text-ink mb-2">{artwork.title}</h3>
                {artwork.status === 'rejected' && artwork.rejectionReason && (
                  <p className="text-xs text-vermilion mb-2">{artwork.rejectionReason}</p>
                )}
                {artwork.status === 'approved' && (
                  <div className="flex gap-4 text-xs text-smoke mb-3">
                    <span>{artwork.views} 浏览</span>
                    <span>{artwork.likes} 收藏</span>
                    <span>{artwork.sales} 售出</span>
                  </div>
                )}
                {artwork.status === 'approved' && Object.keys(artwork.externalUrls).length > 0 && (
                  <div className="flex gap-2">
                    {Object.entries(artwork.externalUrls).filter(([,v])=>v).map(([platform]) => (
                      <span key={platform} className="text-xs px-2 py-0.5 bg-warm-gray text-smoke rounded-full capitalize">
                        {platform}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {/* Upload card */}
        <button className="aspect-square bg-warm-gray rounded-xl border-2 border-dashed border-light-ink flex flex-col items-center justify-center gap-2 text-smoke hover:border-vermilion hover:text-vermilion transition-colors">
          <Plus size={32} strokeWidth={1.5} />
          <span className="text-sm font-medium">上传作品</span>
        </button>
      </div>
    </div>
  )
}
