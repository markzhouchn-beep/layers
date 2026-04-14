import { useState, useEffect } from 'react'
import { Check, X, Eye, Image, Users, ShoppingBag, Clock,  RefreshCw } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'

interface AdminStats {
  total_artworks: number
  pending_artworks: number
  total_creators: number
  total_orders: number
  total_revenue: string
  platforms: { platform: string; count: string; revenue: string }[]
}

interface Artwork {
  id: number
  title: string
  description: string
  original_image_url: string
  mockup_url: string
  status: string
  rejection_reason: string
  username: string
  artist_name: string
  plan: string
  created_at: string
}

interface Creator {
  id: number
  username: string
  email: string
  artist_name: string
  plan: string
  subscription_status: string
  enabled: boolean
  artworks_count: number
  created_at: string
}

const statusMap: Record<string, { label: string; className: string }> = {
  pending:   { label: '待审核', className: 'bg-rattan/10 text-rattan' },
  approved:  { label: '已通过', className: 'bg-bamboo/10 text-bamboo' },
  rejected:  { label: '已拒绝', className: 'bg-red-50 text-red-500' },
  active:    { label: '活跃', className: 'bg-bamboo/10 text-bamboo' },
  inactive:  { label: '未激活', className: 'bg-warm-gray text-smoke' },
}

const tabs = [
  { id: 'dashboard', label: '数据大盘' },
  { id: 'artworks',  label: '作品审核' },
  { id: 'orders',     label: '订单管理' },
  { id: 'creators',  label: '创作者' },
  { id: 'platforms',  label: '外部平台' },
] as const
type TabId = typeof tabs[number]['id']

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const [tab, setTab] = useState<TabId>('dashboard')
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [creators, setCreators] = useState<Creator[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [filterStatus, setFilterStatus] = useState('pending')
  const [syncLoading, setSyncLoading] = useState(false)
  const [syncMsg, setSyncMsg] = useState('')

  const loadStats = () => api.getAdminDashboard().then((d: unknown) => setStats(d as AdminStats)).catch(() => {})
  const loadArtworks = (status?: string) => api.getAdminArtworks({ status: status || undefined }).then((d: unknown) => setArtworks((d as { items: Artwork[] }).items)).catch(() => {})
  const loadCreators = () => api.getAdminCreators().then((d: unknown) => setCreators(d as Creator[])).catch(() => {})

  useEffect(() => {
    setLoading(true)
    Promise.all([loadStats(), loadArtworks(), loadCreators()]).finally(() => setLoading(false))
  }, [])

  const handleApprove = async (id: number) => {
    setActionLoading(id)
    try {
      await api.approveArtwork(id)
      setArtworks(prev => prev.filter(a => a.id !== id))
      loadStats()
    } catch {}
    finally { setActionLoading(null) }
  }

  const handleReject = async (id: number) => {
    setActionLoading(id)
    try {
      await api.rejectArtwork(id)
      setArtworks(prev => prev.filter(a => a.id !== id))
      loadStats()
    } catch {}
    finally { setActionLoading(null) }
  }

  const handleSyncAll = async () => {
    setSyncLoading(true)
    setSyncMsg('')
    try {
      await api.syncPrintifyAll()
      setSyncMsg('同步完成')
    } catch (e: unknown) {
      setSyncMsg('同步失败: ' + (e instanceof Error ? e.message : ''))
    }
    finally { setSyncLoading(false) }
  }

  const handleSyncPending = async () => {
    const pending = await api.getPrintifyPending()
    setSyncMsg(`待同步作品: ${(pending as Artwork[]).length} 件`)
  }

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
              <span className="text-xs text-paper/50">{user?.email}</span>
              <button onClick={logout} className="text-xs text-paper/50 hover:text-paper underline">退出</button>
              <div className="w-8 h-8 bg-vermilion rounded-full flex items-center justify-center text-sm font-medium">
                {user?.username?.[0]?.toUpperCase() || 'A'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nav tabs */}
      <div className="bg-paper border-b border-light-ink sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 h-12">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tab === t.id ? 'bg-ink text-paper' : 'text-smoke hover:text-ink hover:bg-warm-gray'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Dashboard */}
        {tab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: '总作品', value: stats?.total_artworks ?? '-', icon: Image, color: 'text-ink' },
                { label: '待审核', value: stats?.pending_artworks ?? '-', icon: Clock, color: 'text-rattan' },
                { label: '创作者', value: stats?.total_creators ?? '-', icon: Users, color: 'text-bamboo' },
                { label: '总订单', value: stats?.total_orders ?? '-', icon: ShoppingBag, color: 'text-vermilion' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl border border-light-ink p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-smoke">{s.label}</p>
                    <s.icon size={16} className={s.color} />
                  </div>
                  <p className="text-2xl font-semibold text-ink">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Printify sync */}
            <div className="bg-white rounded-xl border border-light-ink p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-ink">Printify 同步</h2>
                <button onClick={handleSyncPending} className="text-xs text-smoke hover:text-ink">检查待同步</button>
              </div>
              <div className="flex gap-3">
                <button onClick={handleSyncAll} disabled={syncLoading} className="flex items-center gap-1.5 px-4 py-2 bg-vermilion text-paper text-sm rounded-lg disabled:opacity-60">
                  {syncLoading ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                  同步全部待发布作品
                </button>
              </div>
              {syncMsg && <p className="text-xs text-smoke mt-2">{syncMsg}</p>}
            </div>
          </div>
        )}

        {/* Artworks */}
        {tab === 'artworks' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-ink">作品审核</h2>
              <div className="flex gap-1 bg-warm-gray rounded-lg p-1">
                {['pending', 'approved', 'rejected'].map(s => (
                  <button key={s} onClick={() => { setFilterStatus(s); loadArtworks(s) }}
                    className={`px-3 py-1 rounded text-xs font-medium ${filterStatus === s ? 'bg-paper text-ink shadow-sm' : 'text-smoke'}`}>
                    {s === 'pending' ? '待审核' : s === 'approved' ? '已通过' : '已拒绝'}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-xl border border-light-ink h-24 animate-pulse" />)}
              </div>
            ) : artworks.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-light-ink">
                <p className="text-smoke text-sm">暂无{filterStatus === 'pending' ? '待审核' : filterStatus === 'approved' ? '已通过' : '已拒绝'}作品</p>
              </div>
            ) : (
              artworks.map(a => (
                <div key={a.id} className="bg-white rounded-xl border border-light-ink p-5 flex items-center gap-4">
                  <img
                    src={a.mockup_url || a.original_image_url || ''}
                    alt={a.title}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0 bg-warm-gray"
                    onError={e => (e.currentTarget.style.display = 'none')}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink">{a.title}</p>
                    <p className="text-xs text-smoke mt-0.5">
                      {a.artist_name || a.username} · {a.plan} · {new Date(a.created_at).toLocaleDateString('zh-CN')}
                    </p>
                    {a.rejection_reason && <p className="text-xs text-red-500 mt-1">拒绝原因：{a.rejection_reason}</p>}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {filterStatus === 'pending' && (
                      <>
                        <button onClick={() => handleApprove(a.id)} disabled={actionLoading === a.id}
                          className="flex items-center gap-1.5 px-4 py-2 bg-bamboo text-paper text-xs font-medium rounded-lg hover:bg-bamboo/90 disabled:opacity-60">
                          <Check size={14} /> 通过
                        </button>
                        <button onClick={() => handleReject(a.id)} disabled={actionLoading === a.id}
                          className="flex items-center gap-1.5 px-4 py-2 border border-light-ink text-xs text-smoke rounded-lg hover:bg-warm-gray disabled:opacity-60">
                          <X size={14} /> 拒绝
                        </button>
                      </>
                    )}
                    <button className="w-9 h-9 flex items-center justify-center border border-light-ink rounded-lg text-smoke hover:bg-warm-gray">
                      <Eye size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Orders */}
        {tab === 'orders' && (
          <div className="bg-white rounded-xl border border-light-ink overflow-hidden">
            <div className="px-6 py-4 border-b border-light-ink">
              <h2 className="font-semibold text-ink">全部订单</h2>
            </div>
            {loading ? (
              <div className="p-6 space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-warm-gray rounded animate-pulse" />)}</div>
            ) : (
              <div className="divide-y divide-light-ink">
                <p className="px-6 py-8 text-sm text-smoke text-center">订单功能开发中（需先接入外部平台）</p>
              </div>
            )}
          </div>
        )}

        {/* Creators */}
        {tab === 'creators' && (
          <div className="bg-white rounded-xl border border-light-ink overflow-hidden">
            <div className="px-6 py-4 border-b border-light-ink">
              <h2 className="font-semibold text-ink">创作者列表 · {creators.length}</h2>
            </div>
            <div className="divide-y divide-light-ink">
              {loading ? (
                <div className="p-6">{[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-warm-gray rounded mb-2 animate-pulse" />)}</div>
              ) : creators.length === 0 ? (
                <p className="px-6 py-8 text-sm text-smoke text-center">暂无创作者</p>
              ) : (
                creators.map(c => (
                  <div key={c.id} className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-warm-gray rounded-full flex items-center justify-center text-sm font-medium text-ink">
                        {c.artist_name?.[0] || c.username?.[0] || '?'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink">{c.artist_name || c.username}</p>
                        <p className="text-xs text-smoke">{c.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs px-2 py-0.5 bg-warm-gray text-smoke rounded">{c.plan}</span>
                      <span className="text-xs text-smoke">{c.artworks_count} 件作品</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${statusMap[c.subscription_status]?.className || statusMap.inactive.className}`}>
                        {statusMap[c.subscription_status]?.label || c.subscription_status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Platforms */}
        {tab === 'platforms' && (
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { platform: 'Gumroad', desc: '全球创作者销售平台', color: '#FF6B35' },
              { platform: 'Etsy', desc: '手工艺品与原创设计市场', color: '#F56400' },
              { platform: 'Amazon Merch', desc: '全球最大电商按需印刷', color: '#FF9900' },
            ].map(p => (
              <div key={p.platform} className="bg-white rounded-xl border border-light-ink p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                  <h3 className="font-semibold text-ink">{p.platform}</h3>
                </div>
                <p className="text-xs text-smoke mb-4">{p.desc}</p>
                <button className="w-full py-2 border border-light-ink text-sm text-smoke rounded-lg hover:bg-warm-gray">
                  配置 API Key
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
