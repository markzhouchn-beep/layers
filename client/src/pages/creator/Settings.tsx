import { useState } from 'react'
import { Save } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

function Check({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function Settings() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    artist_name: user?.artist_name || '',
    bio: '',
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    // TODO: API call to update profile
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ maxWidth: 560 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.3px', color: 'rgba(0,0,0,0.95)', marginBottom: 4 }}>
          Account Settings
        </h1>
        <p style={{ fontSize: 14, color: '#615d59' }}>
          Manage your public creator profile and account security.
        </p>
      </div>

      {/* Profile section */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.9)', marginBottom: 14, letterSpacing: '-0.05px' }}>
          Public Profile
        </p>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: 10,
            padding: '20px',
            marginBottom: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            {/* Avatar placeholder */}
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: '#f6f5f4',
                border: '1px solid rgba(0,0,0,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                fontWeight: 700,
                color: '#615d59',
                flexShrink: 0,
              }}
            >
              {(form.artist_name || user?.username || 'U')[0].toUpperCase()}
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'rgba(0,0,0,0.9)', marginBottom: 2 }}>
                {form.artist_name || user?.username || 'Unnamed Artist'}
              </p>
              <button
                style={{
                  fontSize: 12,
                  color: '#0075de',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  fontWeight: 500,
                }}
              >
                Upload avatar
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(0,0,0,0.85)', marginBottom: 5 }}>
                Artist / Studio Name
              </label>
              <input
                className="input"
                value={form.artist_name}
                onChange={e => setForm({ ...form, artist_name: e.target.value })}
                placeholder="陈小明工作室"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(0,0,0,0.85)', marginBottom: 5 }}>
                Bio
              </label>
              <textarea
                className="input"
                value={form.bio}
                onChange={e => setForm({ ...form, bio: e.target.value })}
                placeholder="Tell buyers about yourself and your art..."
                rows={3}
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>
        </div>

        <button onClick={handleSave} className="btn-primary" style={{ padding: '8px 16px' }}>
          {saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Changes</>}
        </button>
      </div>

      {/* Account section */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.9)', marginBottom: 14, letterSpacing: '-0.05px' }}>
          Account
        </p>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: 10,
            padding: '20px',
            marginBottom: 14,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(0,0,0,0.85)', marginBottom: 5 }}>
                Email Address
              </label>
              <input
                className="input"
                type="email"
                value={user?.email || ''}
                disabled
                style={{ opacity: 0.6, cursor: 'not-allowed' }}
              />
              <p style={{ fontSize: 11, color: '#a39e98', marginTop: 4 }}>Email cannot be changed</p>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(0,0,0,0.85)', marginBottom: 5 }}>
                Change Password
              </label>
              <input className="input" type="password" placeholder="Current password" style={{ marginBottom: 8 }} />
              <input className="input" type="password" placeholder="New password" style={{ marginBottom: 8 }} />
              <input className="input" type="password" placeholder="Confirm new password" />
            </div>
          </div>
        </div>

        <button className="btn-secondary" style={{ padding: '8px 16px' }}>
          Update Password
        </button>
      </div>

      {/* Danger zone */}
      <div
        style={{
          background: '#fff',
          border: '1px solid rgba(231,76,60,0.3)',
          borderRadius: 10,
          padding: '20px',
        }}
      >
        <p style={{ fontSize: 13, fontWeight: 600, color: '#eb5757', marginBottom: 8 }}>
          Danger Zone
        </p>
        <p style={{ fontSize: 13, color: '#615d59', marginBottom: 12, lineHeight: 1.6 }}>
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <button
          style={{
            padding: '7px 14px',
            background: '#fff',
            border: '1px solid rgba(231,76,60,0.4)',
            borderRadius: 4,
            fontSize: 13,
            fontWeight: 500,
            color: '#eb5757',
            cursor: 'pointer',
          }}
        >
          Delete Account
        </button>
      </div>
    </div>
  )
}
