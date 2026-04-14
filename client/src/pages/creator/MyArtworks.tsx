import { useState, useEffect } from 'react'
import { Plus, Clock, Check, X } from 'lucide-react'
import api from '../../services/api'

interface Artwork {
  id: number
  title: string
  description: string
  original_image_url: string
  mockup_url: string
  status: string
  tags: string[]
  view_count: number
  created_at: string
}

export default function MyArtworks() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [showUpload, setShowUpload] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', image_url: '' })
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    api.getMyArtworks()
      .then((data: unknown) => setArtworks(data as Artwork[]))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = artworks.filter(a => tab === 'all' ? true : a.status === tab)

  const handleUpload = async () => {
    if (!form.title.trim() || !form.image_url.trim()) {
      setError('标题和图片URL不能为空')
      return
    }
    setError('')
    setUploading(true)
    try {
      await api.createArtwork({ title: form.title, description: form.description, original_image_url: form.image_url })
      setShowUpload(false)
      setForm({ title: '', description: '', image_url: '' })
      load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '上传失败')
    } finally {
      setUploading(false)
    }
  }

  const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
    pending: { label: '待审核', color: 'text-smoke bg-warm-gray', icon: Clock },
    approved: { label: '已通过', color: 'text-bamboo bg-bamboo/10', icon: Check },
    rejected: { label: '已拒绝', color: 'text-red-500 bg-red-50', icon: X },
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink">我的作品</h1>
        <button onClick={() => setShowUpload(true)} className="flex items-center gap-1.5 px-4 py-2 bg-vermilion text-paper text-sm rounded-lg hover:bg-vermilion/90">
          <Plus size={14} /> 上传作品
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-warm-gray p-1 rounded-lg w-fit">
        {(['all', 'pending', 'approved', 'rejected'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 text-xs rounded-md transition-colors ${tab === t ? 'bg-paper text-ink shadow-sm' : 'text-smoke hover:text-ink'}`}>
            {t === 'all' ? '全部' : t === 'pending' ? '待审核' : t === 'approved' ? '已通过' : '已拒绝'}
          </button>
        ))}
      </div>

      {/* Upload modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-paper rounded-2xl p-6 w-full max-w-sm space-y-4">
            <h2 className="text-lg font-semibold text-ink">上传作品</h2>
            {error && <p className="text-xs text-red-500 bg-red-50 p-2 rounded">{error}</p>}
            <div>
              <p className="text-xs text-smoke mb-1">作品标题</p>
              <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="如：山水系列" className="w-full px-3 py-2.5 bg-warm-gray border border-light-ink rounded-lg text-sm focus:outline-none focus:border-vermilion" />
            </div>
            <div>
              <p className="text-xs text-smoke mb-1">图片URL</p>
              <input value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} placeholder="https://..." className="w-full px-3 py-2.5 bg-warm-gray border border-light-ink rounded-lg text-sm focus:outline-none focus:border-vermilion" />
            </div>
            <div>
              <p className="text-xs text-smoke mb-1">描述（选填）</p>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="描述你的作品..." rows={3} className="w-full px-3 py-2.5 bg-warm-gray border border-light-ink rounded-lg text-sm resize-none focus:outline-none focus:border-vermilion" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowUpload(false)} className="flex-1 py-2.5 border border-light-ink text-sm text-smoke rounded-lg">取消</button>
              <button onClick={handleUpload} disabled={uploading} className="flex-1 py-2.5 bg-ink text-paper text-sm rounded-lg disabled:opacity-60">{uploading ? '上传中...' : '确认'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-square bg-warm-gray rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-smoke text-sm">还没有作品</p>
          <button onClick={() => setShowUpload(true)} className="mt-3 text-sm text-vermilion hover:underline">上传第一件</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map(artwork => {
            const s = statusConfig[artwork.status] || statusConfig.pending
            return (
              <div key={artwork.id} className="bg-warm-gray rounded-xl overflow-hidden group">
                <div className="aspect-square bg-light-ink/20 relative">
                  {artwork.mockup_url || artwork.original_image_url ? (
                    <img src={artwork.mockup_url || artwork.original_image_url} alt={artwork.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-smoke/40">无图片</div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${s.color}`}>
                      <s.icon size={10} />{s.label}
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-ink truncate">{artwork.title}</p>
                  <p className="text-xs text-smoke mt-0.5">{artwork.view_count || 0} 次浏览</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
