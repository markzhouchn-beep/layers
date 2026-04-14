import { useState, useEffect } from 'react'
import { Plus, Clock, Check, X, Upload } from 'lucide-react'
import MockupGenerator from '../../components/MockupGenerator'
import api from '../../services/api'

interface Artwork {
  id: number
  title: string
  description: string
  original_image_url: string
  mockup_url: string
  status: 'pending' | 'approved' | 'rejected'
  tags: string[]
  view_count: number
  created_at: string
}

const statusConfig = {
  pending:  { label: 'Pending Review',  badge: 'badge-orange', icon: Clock },
  approved: { label: 'Approved',        badge: 'badge-green', icon: Check },
  rejected: { label: 'Rejected',         badge: 'badge-red',   icon: X },
}

const TAB_LABELS: Record<string, string> = {
  all: 'All',
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
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
      .then((data: unknown) => setArtworks((data as Artwork[]) || []))
      .catch(() => setArtworks([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = tab === 'all' ? artworks : artworks.filter(a => a.status === tab)
  const countFor = (t: 'all' | 'pending' | 'approved' | 'rejected') =>
    t === 'all' ? artworks.length : artworks.filter(a => a.status === t).length

  const handleMockupSave = (data: { dataUrl: string; blueprintId: number; productName: string }) => {
    setMockupData(data)
  }

  const handleSubmit = async () => {
    if (!form.title.trim()) { setError('Please enter a title'); return }
    if (!mockupData) { setError('Please generate a preview first'); return }
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
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const openUpload = () => {
    setShowUpload(true)
    setStep('info')
    setForm({ title: '', description: '' })
    setMockupData(null)
    setError('')
  }

  return (
    <div>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.3px', color: 'rgba(0,0,0,0.95)' }}>
          My Artworks
        </h1>
        {/* Upload button — always visible */}
        <button
          onClick={openUpload}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 14px',
            background: '#0075de',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Plus size={14} />
          Upload Artwork
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
        {(['all', 'pending', 'approved', 'rejected'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '6px 12px',
              borderRadius: 4,
              border: 'none',
              fontSize: 13,
              fontWeight: tab === t ? 600 : 500,
              cursor: 'pointer',
              transition: 'all 0.12s',
              background: tab === t ? 'rgba(0,0,0,0.06)' : 'transparent',
              color: tab === t ? 'rgba(0,0,0,0.9)' : '#615d59',
            }}
          >
            {TAB_LABELS[t]}
            {countFor(t) > 0 && (
              <span
                style={{
                  padding: '1px 6px',
                  borderRadius: 10,
                  fontSize: 11,
                  fontWeight: 600,
                  background: tab === t ? 'rgba(0,0,0,0.1)' : '#e8e8e8',
                  color: tab === t ? 'rgba(0,0,0,0.9)' : '#615d59',
                }}
              >
                {countFor(t)}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: 16,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) { setShowUpload(false) } }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 12,
              padding: '24px',
              width: '100%',
              maxWidth: 680,
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: 'var(--shadow-deep)',
            }}
          >
            {/* Modal header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Upload size={16} style={{ color: '#615d59' }} />
                <h2 style={{ fontSize: 16, fontWeight: 700, color: 'rgba(0,0,0,0.95)' }}>
                  {step === 'info' ? 'Upload Artwork' : 'Design Preview'}
                </h2>
              </div>
              <button
                onClick={() => setShowUpload(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#a39e98', padding: 4 }}
              >
                ✕
              </button>
            </div>

            {/* Step indicator */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
              {[1, 2].map(s => (
                <div
                  key={s}
                  style={{
                    flex: 1,
                    height: 3,
                    borderRadius: 2,
                    background: s <= (step === 'info' ? 1 : 2) ? '#0075de' : 'rgba(0,0,0,0.08)',
                    transition: 'background 0.2s',
                  }}
                />
              ))}
            </div>

            {error && (
              <div style={{ padding: '10px 12px', background: '#fde8e8', borderRadius: 6, fontSize: 13, color: '#eb5757', marginBottom: 16 }}>
                {error}
              </div>
            )}

            {/* Step 1: Info */}
            {step === 'info' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.9)', marginBottom: 6 }}>
                    Title <span style={{ color: '#eb5757' }}>*</span>
                  </label>
                  <input
                    className="input"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Mountain Landscape"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.9)', marginBottom: 6 }}>
                    Description <span style={{ color: '#a39e98', fontWeight: 400 }}>(optional)</span>
                  </label>
                  <textarea
                    className="input"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Tell buyers about this artwork..."
                    rows={3}
                    style={{ resize: 'vertical' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
                  <button
                    onClick={() => setShowUpload(false)}
                    className="btn-secondary"
                    style={{ flex: 1, justifyContent: 'center', padding: '10px' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!form.title.trim()) { setError('Please enter a title'); return }
                      setError('')
                      setStep('design')
                    }}
                    className="btn-primary"
                    style={{ flex: 1, justifyContent: 'center', padding: '10px' }}
                  >
                    Next: Design Preview →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Design */}
            {step === 'design' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {mockupData && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 12px',
                      background: '#e8f9e8',
                      borderRadius: 6,
                      fontSize: 13,
                      color: '#1aae39',
                    }}
                  >
                    <Check size={13} />
                    Preview saved · Product: <strong>{mockupData.productName}</strong> — you can edit or submit directly
                  </div>
                )}
                <MockupGenerator
                  artworkUrl={mockupData?.dataUrl}
                  onSave={handleMockupSave}
                  initialProductId="tshirt"
                />
                <div style={{ display: 'flex', gap: 10, paddingTop: 8, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                  <button
                    onClick={() => setStep('info')}
                    className="btn-secondary"
                    style={{ flex: 1, justifyContent: 'center', padding: '10px' }}
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={uploading || !mockupData}
                    className="btn-primary"
                    style={{ flex: 1, justifyContent: 'center', padding: '10px' }}
                  >
                    {uploading ? 'Submitting...' : 'Publish Artwork'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Artwork Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ aspectRatio: '4/5', background: '#f6f5f4', borderRadius: 12, animation: 'pulse 1.8s infinite' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '64px 0',
            border: '1px dashed rgba(0,0,0,0.12)',
            borderRadius: 12,
          }}
        >
          <p style={{ fontSize: 15, color: '#615d59', marginBottom: 12 }}>
            {tab === 'all' ? "You haven't uploaded any artworks yet" : `No ${tab} artworks`}
          </p>
          {tab === 'all' && (
            <button onClick={openUpload} style={{ fontSize: 14, color: '#0075de', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
              Upload your first artwork →
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {filtered.map(artwork => {
            const s = statusConfig[artwork.status] || statusConfig.pending
            const img = artwork.mockup_url || artwork.original_image_url
            return (
              <div
                key={artwork.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: 10,
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                {/* Image */}
                <div style={{ position: 'relative', aspectRatio: '4/5', background: '#f6f5f4' }}>
                  {img ? (
                    <img src={img} alt={artwork.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a39e98', fontSize: 13 }}>
                      No preview
                    </div>
                  )}
                  {/* Status badge */}
                  <div style={{ position: 'absolute', top: 8, right: 8 }}>
                    <span className={`badge ${s.badge}`}>
                      <s.icon size={10} style={{ marginRight: 3 }} />
                      {s.label}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding: '10px 12px' }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'rgba(0,0,0,0.9)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {artwork.title}
                  </p>
                  <p style={{ fontSize: 12, color: '#a39e98' }}>
                    {artwork.view_count || 0} views
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
