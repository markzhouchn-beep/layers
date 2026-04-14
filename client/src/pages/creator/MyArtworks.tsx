import { useState, useEffect } from 'react'
import { Plus, Clock, Check, X } from 'lucide-react'
import MockupGenerator from '../../components/MockupGenerator'
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
  const [step, setStep] = useState<'info' | 'design'>('info')
  const [form, setForm] = useState({ title: '', description: '' })
  const [mockupData, setMockupData] = useState<{ dataUrl: string; blueprintId: number; productName: string } | null>(null)
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

  const handleMockupSave = (data: { dataUrl: string; blueprintId: number; productName: string }) => {
    setMockupData(data)
    setStep('design')
  }

  const handleSubmit = async () => {
    if (!form.title.trim()) { setError('请填写作品标题'); return }
    if (!mockupData) { setError('请先设计并导出预览图'); return }
    setError('')
    setUploading(true)
    try {
      await api.createArtwork({
        title: form.title,
        description: form.description,
        original_image_url: mockupData.dataUrl,
        tags: [],
      })
      setShowUpload(false)
      setStep('info')
      setForm({ title: '', description: '' })
      setMockupData(null)
      load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '上传失败')
    } finally {
      setUploading(false)
    }
  }

  const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
    pending:  { label: '待审核', color: 'text-smoke bg-warm-gray', icon: Clock },
    approved: { label: '已通过', color: 'text-bamboo bg-bamboo/10', icon: Check },
    rejected: { label: '已拒绝', color: 'text-red-500 bg-red-50', icon: X },
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink">我的作品</h1>
        <button onClick={() => { setShowUpload(true); setStep('info'); setMockupData(null); setError('') }}
          className="flex items-center gap-1.5 px-4 py-2 bg-vermilion text-paper text-sm rounded-lg hover:bg-vermilion/90">
          <Plus size={14} /> 上传作品
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-warm-gray p-1 rounded-lg w-fit">
        {(['all', 'pending', 'approved', 'rejected'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-1.5 text-xs rounded-md transition-colors ${tab === t ? 'bg-paper text-ink shadow-sm' : 'text-smoke hover:text-ink'}`}>
            {t === 'all' ? '全部' : t === 'pending' ? '待审核' : t === 'approved' ? '已通过' : '已拒绝'}
            {t === 'pending' && artworks.some(a => a.status === 'pending') && (
              <span className="ml-1 text-vermilion">({artworks.filter(a => a.status === 'pending').length})</span>
            )}
          </button>
        ))}
      </div>

      {/* Upload modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-paper rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-ink">
                {step === 'info' ? '上传作品' : '设计预览图'}
              </h2>
              <button onClick={() => { setShowUpload(false); setStep('info'); setMockupData(null) }}
                className="text-smoke hover:text-ink">✕</button>
            </div>

            {error && <p className="text-xs text-red-500 bg-red-50 p-2 rounded">{error}</p>}

            {step === 'info' ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-smoke mb-1">作品标题 *</p>
                  <input value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                    placeholder="如：山水之间" className="w-full px-3 py-2.5 bg-warm-gray border border-light-ink rounded-lg text-sm focus:outline-none focus:border-vermilion" />
                </div>
                <div>
                  <p className="text-xs text-smoke mb-1">描述（选填）</p>
                  <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                    placeholder="描述你的作品..." rows={3}
                    className="w-full px-3 py-2.5 bg-warm-gray border border-light-ink rounded-lg text-sm resize-none focus:outline-none focus:border-vermilion" />
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setShowUpload(false)} className="flex-1 py-2.5 border border-light-ink text-sm text-smoke rounded-lg">取消</button>
                  <button onClick={() => { if (!form.title.trim()) setError('请填写标题'); else setStep('design') }}
                    className="flex-1 py-2.5 bg-ink text-paper text-sm rounded-lg">下一步：设计 →</button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {mockupData && (
                  <div className="text-xs text-smoke bg-bamboo/10 p-2 rounded flex items-center gap-2">
                    <Check size={12} className="text-bamboo" />
                    预览图已保存 · 产品：{mockupData.productName} · 可以修改或直接提交
                  </div>
                )}
                <MockupGenerator
                  artworkUrl={mockupData?.dataUrl}
                  onSave={handleMockupSave}
                  initialProductId="tshirt"
                />
                <div className="flex gap-2 pt-2 border-t border-light-ink">
                  <button onClick={() => setStep('info')} className="flex-1 py-2.5 border border-light-ink text-sm text-smoke rounded-lg">← 上一步</button>
                  <button onClick={handleSubmit} disabled={uploading || !mockupData}
                    className="flex-1 py-2.5 bg-vermilion text-paper text-sm rounded-lg disabled:opacity-60 disabled:cursor-not-allowed">
                    {uploading ? '提交中...' : '确认发布作品'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="aspect-square bg-warm-gray rounded-xl animate-pulse" />)}
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
            const img = artwork.mockup_url || artwork.original_image_url
            return (
              <div key={artwork.id} className="bg-warm-gray rounded-xl overflow-hidden group">
                <div className="aspect-square bg-light-ink/20 relative">
                  {img ? (
                    <img src={img} alt={artwork.title} className="w-full h-full object-cover" />
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
