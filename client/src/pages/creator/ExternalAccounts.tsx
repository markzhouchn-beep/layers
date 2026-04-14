import { useState, useEffect } from 'react'
import { ExternalLink, RefreshCw, Check, Link2, Loader2 } from 'lucide-react'
import api from '../../services/api'

interface ExternalAccount {
  id: number
  platform: string
  account_name: string | null
  shop_url: string | null
  connected: boolean
  last_sync: string | null
  total_sales: string | null
}

const PLATFORM_META = {
  gumroad: {
    name: 'Gumroad',
    desc: 'Popular creator marketplace for digital and physical products. Connect to sync sales orders.',
    website: 'gumroad.com',
    color: '#FF6B35',
    connectHelp: 'You need a Gumroad account. After connecting, enter your Gumroad API key.',
  },
  etsy: {
    name: 'Etsy',
    desc: 'Handmade and original design marketplace. Requires Etsy Open API application.',
    website: 'etsy.com',
    color: '#F56400',
    connectHelp: 'You need an approved Etsy developer application. Etsy OAuth is required.',
  },
  amazon: {
    name: 'Amazon Merch on Demand',
    desc: "World's largest e-commerce platform print-on-demand. Available for approved Pro creators.",
    website: 'merch.amazon.com',
    color: '#FF9900',
    connectHelp: 'Pro plan required. Amazon Merch requires an approved application.',
  },
  redbubble: {
    name: 'Redbubble',
    desc: 'Independent artist products marketplace with global reach.',
    website: 'redbubble.com',
    color: '#E34234',
    connectHelp: 'Requires Redbubble account. API integration coming soon.',
  },
}

export default function ExternalAccounts() {
  const [accounts, setAccounts] = useState<ExternalAccount[]>([])
  const [showConnect, setShowConnect] = useState<string | null>(null)
  const [connectForm, setConnectForm] = useState({ api_key: '', shop_url: '' })
  const [connecting, setConnecting] = useState(false)
  const [syncing, setSyncing] = useState<string | null>(null)

  const load = () => {
    api.getExternalAccounts()
      .then((data: unknown) => setAccounts((data as ExternalAccount[]) || []))
      .catch(() => setAccounts([]))

  }

  useEffect(() => { load() }, [])

  const handleConnect = async (platform: string) => {
    if (!connectForm.api_key.trim()) return
    setConnecting(true)
    try {
      await api.addExternalAccount({ platform, api_key: connectForm.api_key, shop_url: connectForm.shop_url })
      setShowConnect(null)
      setConnectForm({ api_key: '', shop_url: '' })
      load()
    } catch {}
    setConnecting(false)
  }

  const connectedCount = accounts.filter(a => a.connected).length

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.3px', color: 'rgba(0,0,0,0.95)', marginBottom: 4 }}>
          External Platforms
        </h1>
        <p style={{ fontSize: 14, color: '#615d59' }}>
          Connect your existing shop accounts to automatically sync orders into your Layers dashboard.
        </p>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 28 }}>
        <div className="card" style={{ padding: '16px 18px' }}>
          <p style={{ fontSize: 12, color: '#a39e98', marginBottom: 6 }}>Connected</p>
          <p style={{ fontSize: 26, fontWeight: 700, color: 'rgba(0,0,0,0.95)', letterSpacing: '-0.5px' }}>
            {connectedCount}
          </p>
        </div>
        <div className="card" style={{ padding: '16px 18px' }}>
          <p style={{ fontSize: 12, color: '#a39e98', marginBottom: 6 }}>Monthly Sales</p>
          <p style={{ fontSize: 26, fontWeight: 700, color: 'rgba(0,0,0,0.95)', letterSpacing: '-0.5px' }}>
            —
          </p>
        </div>
        <div className="card" style={{ padding: '16px 18px' }}>
          <p style={{ fontSize: 12, color: '#a39e98', marginBottom: 6 }}>Sync Status</p>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#2a9d99', display: 'flex', alignItems: 'center', gap: 5 }}>
            <RefreshCw size={13} />
            {connectedCount > 0 ? 'Active' : 'No connections'}
          </p>
        </div>
      </div>

      {/* Platform list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
        {(['gumroad', 'etsy', 'amazon', 'redbubble'] as const).map(platformId => {
          const meta = PLATFORM_META[platformId]
          const account = accounts.find(a => a.platform === platformId)
          const isConnected = !!account?.connected
          const isConnecting = showConnect === platformId

          return (
            <div
              key={platformId}
              className="card"
              style={{ padding: '18px 20px' }}
            >
              {isConnecting ? (
                /* Connect form */
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        background: meta.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: 14,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {meta.name[0]}
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: 'rgba(0,0,0,0.9)' }}>Connect {meta.name}</p>
                      <p style={{ fontSize: 12, color: '#a39e98' }}>{meta.connectHelp}</p>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(0,0,0,0.85)', marginBottom: 4 }}>
                      API Key or Access Token *
                    </label>
                    <input
                      className="input"
                      type="password"
                      placeholder={`Your ${meta.name} API key...`}
                      value={connectForm.api_key}
                      onChange={e => setConnectForm({ ...connectForm, api_key: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => { setShowConnect(null); setConnectForm({ api_key: '', shop_url: '' }) }}
                      className="btn-secondary"
                      style={{ flex: 1, justifyContent: 'center', padding: '8px' }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleConnect(platformId)}
                      disabled={connecting || !connectForm.api_key.trim()}
                      className="btn-primary"
                      style={{ flex: 1, justifyContent: 'center', padding: '8px' }}
                    >
                      {connecting ? <Loader2 size={13} className="animate-spin" /> : null}
                      {connecting ? 'Connecting...' : 'Connect'}
                    </button>
                  </div>
                </div>
              ) : (
                /* Normal view */
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        background: meta.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: 14,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {meta.name[0]}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 2 }}>
                        <p style={{ fontSize: 14, fontWeight: 600, color: 'rgba(0,0,0,0.9)' }}>{meta.name}</p>
                        {isConnected ? (
                          <span className="badge badge-green" style={{ fontSize: 11 }}>
                            <Check size={9} style={{ marginRight: 2 }} />
                            Connected
                          </span>
                        ) : (
                          <span className="badge badge-gray" style={{ fontSize: 11 }}>Not connected</span>
                        )}
                      </div>
                      <p style={{ fontSize: 12, color: '#615d59', marginBottom: 2 }}>{meta.desc}</p>
                      {isConnected && (
                        <div style={{ display: 'flex', gap: 16, marginTop: 5 }}>
                          {account?.account_name && (
                            <span style={{ fontSize: 12, color: '#615d59' }}>
                              Account: <strong style={{ color: 'rgba(0,0,0,0.85)' }}>{account.account_name}</strong>
                            </span>
                          )}
                          {account?.last_sync && (
                            <span style={{ fontSize: 12, color: '#a39e98' }}>
                              Last sync: {new Date(account.last_sync).toLocaleString()}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 7, flexShrink: 0 }}>
                    {isConnected ? (
                      <>
                        <button
                          onClick={() => setSyncing(platformId)}
                          disabled={!!syncing}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            padding: '6px 10px',
                            background: 'rgba(0,0,0,0.04)',
                            border: '1px solid rgba(0,0,0,0.1)',
                            borderRadius: 4,
                            fontSize: 12,
                            fontWeight: 500,
                            color: '#615d59',
                            cursor: 'pointer',
                          }}
                        >
                          <RefreshCw size={11} className={syncing === platformId ? 'animate-spin' : ''} />
                          Sync
                        </button>
                        <button
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            padding: '6px 10px',
                            background: 'transparent',
                            border: '1px solid rgba(0,0,0,0.1)',
                            borderRadius: 4,
                            fontSize: 12,
                            fontWeight: 500,
                            color: '#615d59',
                            cursor: 'pointer',
                          }}
                        >
                          <ExternalLink size={11} />
                          Manage
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setShowConnect(platformId)}
                        className="btn-primary"
                        style={{ padding: '6px 12px', fontSize: 13 }}
                      >
                        <Link2 size={12} />
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Note */}
      <div
        style={{
          background: '#f6f5f4',
          border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: 10,
          padding: '16px 18px',
        }}
      >
        <p style={{ fontSize: 13, color: '#615d59', lineHeight: 1.65 }}>
          <strong style={{ color: 'rgba(0,0,0,0.85)' }}>How it works:</strong>{' '}
          After connecting, our AI agent syncs your orders every 15 minutes automatically.
          All sensitive data (API keys) are encrypted. We never use them for anything other than syncing your orders.
        </p>
      </div>
    </div>
  )
}
