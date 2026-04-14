import { useState, useEffect } from 'react'
import { Plus, Clock, Check, X, Upload, Image } from 'lucide-react'
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
  rejection_reason?: string
  created_at: string
}

const statusConfig = {
  pending:  { label: 'Pending Review',  badge: 'badge-orange', icon: Clock, color: '#dd5b00' },
  approved: { label: 'Approved',        badge: 'badge-green', icon: Check, color: '#1aae39' },
  rejected: { label: 'Rejected',        badge: 'badge-red',   icon: X, color: '#eb5757' },
}

const TABS: { id: 'all'|'pending'|'approved'|'rejected'; label: string }[] = [
  { id: 'all',      label: 'All' },
  { id: 'pending',  label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
]

export default function MyArtworks() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'all'|'pending'|'approved'|'rejected'>('all')
  const [showModal, setShowModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [step, setStep] = useState<1|2>(1)
  const [form, setForm] = useState({ title: '', description: '' })
  const [mockupData, setMockupData] = useState<{ dataUrl: string; blueprintId: number; productName: string } | null>(null)
  const [submitError, setSubmitError] = useState('')

  const load = () => {
    setLoading(true)
    api.getMyArtworks()
      .then((data: unknown) => setArtworks((data as Artwork[]) || []))
      .catch(() => setArtworks([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = activeTab === 'all' ? artworks : artworks.filter(a => a.status === activeTab)

  const tabCount = (id: 'all' | 'pending' | 'approved' | 'rejected') =>
    id === 'all' ? artworks.length : artworks.filter(a => a.status === id).length

  const openModal = () => {
    setShowModal(true)
    setStep(1)
    setForm({ title: '', description: '' })
    setMockupData(null)
    setSubmitError('')
  }

  const handleMockupSave = (data: { dataUrl: string; blueprintId: number; productName: string }) => {
    setMockupData(data)
  }

  const handleSubmit = async () => {
    if (!form.title.trim()) { setSubmitError('Please enter a title'); return }
    if (!mockupData) { setSubmitError('Please generate a mockup preview first'); return }
    setSubmitError('')
    setUploading(true)
    try {
      await api.createArtwork({
        title: form.title,
        description: form.description,
        original_image_url: mockupData.dataUrl,
        tags: [],
      })
      setShowModal(false)
      load()
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {/* Header row — Upload button ALWAYS visible */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.3px', color: 'rgba(0,0,0,0.95)', marginBottom: 2 }}>
            My Artworks
          </h1>
          <p style={{ fontSize: 13, color: '#a39e98' }}>
            {artworks.length} {artworks.length === 1 ? 'artwork' : 'artworks'} total
            {artworks.filter(a => a.status === 'pending').length > 0 && (
              <span style={{ color: '#dd5b00', marginLeft: 8 }}>
                · {artworks.filter(a => a.status === 'pending').length} awaiting review
              </span>
            )}
          </p>
        </div>
        <button
          onClick={openModal}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 14px',
            background: '#0075de',
            color: '#fff',
            border: 'none',
            borderRadius: 5,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <Plus size={14} />
          Upload Artwork
        </button>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: 0 }}>
        {TABS.map(tab => {
          const count = tabCount(tab.id)
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 14px',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #0075de' : '2px solid transparent',
                background: 'transparent',
                fontSize: 14,
                fontWeight: activeTab === tab.id ? 600 : 500,
                color: activeTab === tab.id ? '#0075de' : '#615d59',
                cursor: 'pointer',
                transition: 'all 0.15s',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              {tab.label}
              {count > 0 && (
                <span style={{
                  padding: '1px 7px',
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 600,
                  background: activeTab === tab.id ? 'rgba(0,117,222,0.1)' : 'rgba(0,0,0,0.07)',
                  color: activeTab === tab.id ? '#0075de' : '#615d59',
                }}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: 20,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false) }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 14,
              padding: '28px',
              width: '100%',
              maxWidth: 720,
              maxHeight: '92vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            }}
          >
            {/* Modal header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {step === 1 ? <Image size={16} style={{ color: '#615d59' }} /> : <Upload size={16} style={{ color: '#0075de' }} />}
                </div>
                <div>
                  <p style={{ fontSize: 16, fontWeight: 700, color: 'rgba(0,0,0,0.95)', letterSpacing: '-0.2px' }}>
                    {step === 1 ? 'Step 1: Artwork Info' : 'Step 2: Design Preview'}
                  </p>
                  <p style={{ fontSize: 12, color: '#a39e98' }}>
                    {step === 1 ? 'Tell buyers about your artwork' : 'Choose product & position your design'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', fontSize: 20, color: '#a39e98', cursor: 'pointer', padding: 4, lineHeight: 1 }}
              >
                ✕
              </button>
            </div>

            {/* Step dots */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
              {[1, 2].map(s => (
                <div
                  key={s}
                  style={{
                    height: 4,
                    flex: 1,
                    borderRadius: 2,
                    background: s <= step ? '#0075de' : 'rgba(0,0,0,0.08)',
                    transition: 'background 0.25s',
                  }}
                />
              ))}
            </div>

            {submitError && (
              <div style={{ padding: '10px 14px', background: '#fde8e8', borderRadius: 6, fontSize: 13, color: '#eb5757', marginBottom: 16 }}>
                {submitError}
              </div>
            )}

            {/* Step 1: Info */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.9)', marginBottom: 6 }}>
                    Title <span style={{ color: '#eb5757' }}>*</span>
                  </label>
                  <input
                    className="input"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Mountain Landscape No.7"
                    autoFocus
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
                    placeholder="Tell buyers about this artwork — inspiration, technique, story..."
                    rows={3}
                    style={{ resize: 'vertical' }}
                  />
                </div>

                {/* Status note */}
                <div style={{
                  padding: '12px 14px',
                  background: '#f6f5f4',
                  border: '1px solid rgba(0,0,0,0.08)',
                  borderRadius: 8,
                  fontSize: 13,
                  color: '#615d59',
                  lineHeight: 1.6,
                }}>
                  <strong style={{ color: 'rgba(0,0,0,0.85)' }}>What happens next:</strong> After you submit, your artwork will be reviewed by our team within 1-2 days. You'll see the status change to "Approved" or "Rejected" here.
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => setShowModal(false)}
                    className="btn-secondary"
                    style={{ flex: 1, justifyContent: 'center', padding: '10px' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!form.title.trim()) { setSubmitError('Please enter a title'); return }
                      setSubmitError('')
                      setStep(2)
                    }}
                    className="btn-primary"
                    style={{ flex: 2, justifyContent: 'center', padding: '10px' }}
                  >
                    Next: Choose Product →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Mockup Generator */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Product selected indicator */}
                {mockupData && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 14px',
                    background: '#e8f9e8',
                    border: '1px solid rgba(26,174,57,0.2)',
                    borderRadius: 8,
                    fontSize: 13,
                    color: '#1aae39',
                  }}>
                    <Check size={14} />
                    Preview ready · Product: <strong>{mockupData.productName}</strong>
                    — click "Save & Export Mockup" in the generator if you want to update the preview
                  </div>
                )}

                <MockupGenerator
                  artworkUrl={mockupData?.dataUrl}
                  onSave={handleMockupSave}
                  initialProductId="tshirt"
                />

                <div style={{ display: 'flex', gap: 10, borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: 16 }}>
                  <button
                    onClick={() => setStep(1)}
                    className="btn-secondary"
                    style={{ flex: 1, justifyContent: 'center', padding: '10px' }}
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={uploading || !mockupData}
                    className="btn-primary"
                    style={{ flex: 2, justifyContent: 'center', padding: '10px', opacity: (!mockupData || uploading) ? 0.6 : 1 }}
                  >
                    {uploading ? 'Submitting...' : 'Submit for Review'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Artwork Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 16 }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ aspectRatio: '4/5', background: '#f6f5f4', borderRadius: 12, animation: 'pulse 1.8s infinite' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '72px 24px',
            border: '1.5px dashed rgba(0,0,0,0.12)',
            borderRadius: 14,
          }}
        >
          <div style={{ width: 48, height: 48, borderRadius: 12, background: '#f6f5f4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
            <Image size={22} style={{ color: '#a39e98' }} />
          </div>
          <p style={{ fontSize: 15, color: 'rgba(0,0,0,0.75)', marginBottom: 8 }}>
            {activeTab === 'all' ? "You haven't uploaded any artworks yet" : `No ${activeTab} artworks`}
          </p>
          {activeTab === 'all' && (
            <button
              onClick={openModal}
              style={{ fontSize: 14, color: '#0075de', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
            >
              Upload your first artwork →
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 16 }}>
          {filtered.map(artwork => {
            const s = statusConfig[artwork.status] || statusConfig.pending
            const StatusIcon = s.icon
            const img = artwork.mockup_url || artwork.original_image_url

            return (
              <div
                key={artwork.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: 10,
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.03)',
                }}
              >
                {/* Image area */}
                <div style={{ position: 'relative', aspectRatio: '4/5', background: '#f6f5f4' }}>
                  {img ? (
                    <img
                      src={img}
                      alt={artwork.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a39e98', fontSize: 13 }}>
                      No preview
                    </div>
                  )}

                  {/* Status badge */}
                  <div style={{ position: 'absolute', top: 8, right: 8 }}>
                    <span
                      className={`badge ${s.badge}`}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}
                    >
                      <StatusIcon size={10} />
                      {s.label}
                    </span>
                  </div>

                  {/* Pending notice */}
                  {artwork.status === 'pending' && (
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '6px 10px',
                      background: 'rgba(221,91,0,0.9)',
                      fontSize: 11,
                      color: '#fff',
                      fontWeight: 500,
                    }}>
                      Under review — usually 1-2 days
                    </div>
                  )}

                  {/* Rejected reason */}
                  {artwork.status === 'rejected' && artwork.rejection_reason && (
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '6px 10px',
                      background: 'rgba(235,87,87,0.9)',
                      fontSize: 11,
                      color: '#fff',
                      fontWeight: 500,
                    }}>
                      Reason: {artwork.rejection_reason}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: '10px 12px' }}>
                  <p style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'rgba(0,0,0,0.9)',
                    marginBottom: 4,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {artwork.title}
                  </p>
                  <p style={{ fontSize: 12, color: '#a39e98' }}>
                    {artwork.view_count || 0} views · {new Date(artwork.created_at).toLocaleDateString()}
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
