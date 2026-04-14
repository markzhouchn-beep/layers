import { Check } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '¥0',
    period: '/ year',
    royalty: '8%',
    maxWorks: 3,
    features: [
      'Up to 3 artworks',
      'Basic dashboard',
      'Email support',
    ],
    disabled: [
      'External platform sync',
      'Priority review',
      'Advanced analytics',
    ],
    cta: 'Current plan',
    color: '#f6f5f4',
    border: 'rgba(0,0,0,0.1)',
  },
  {
    id: 'basic',
    name: 'Basic',
    price: '¥299',
    period: '/ year',
    royalty: '30%',
    maxWorks: 20,
    features: [
      'Up to 20 artworks',
      'External platform sync',
      'Priority review',
      'Email support',
    ],
    disabled: [
      'Advanced analytics',
      'Priority withdrawals',
    ],
    cta: 'Upgrade',
    recommended: true,
    color: '#ffffff',
    border: '#0075de',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '¥599',
    period: '/ year',
    royalty: '45%',
    maxWorks: null,
    features: [
      'Unlimited artworks',
      'External platform sync',
      'Priority review',
      'Advanced analytics',
      'Priority withdrawals',
      'Dedicated support',
    ],
    disabled: [],
    cta: 'Upgrade',
    color: '#ffffff',
    border: 'rgba(0,0,0,0.1)',
  },
]

const PLAN_ORDER = { free: 0, basic: 1, pro: 2 }

export default function Subscription() {
  const { user } = useAuth()
  const currentPlanId = user?.plan || 'free'

  const handleUpgrade = (targetPlan: string) => {
    // TODO: connect to payment flow (Alipay/WeChat for CNY subscription)
    alert(`Upgrade to ${targetPlan} — payment integration coming soon. Contact us at support@layershop.store`)
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.3px', color: 'rgba(0,0,0,0.95)', marginBottom: 4 }}>
          Subscription
        </h1>
        <p style={{ fontSize: 14, color: '#615d59' }}>
          Choose the right plan for your creative business.
        </p>
      </div>

      {/* Current plan banner */}
      {user && (
        <div
          style={{
            background: 'rgba(0,0,0,0.95)',
            borderRadius: 10,
            padding: '16px 20px',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 3 }}>Current plan</p>
            <p style={{ fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: '-0.3px' }}>
              {plans.find(p => p.id === currentPlanId)?.name || 'Free'}
              <span style={{ fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.5)', marginLeft: 8 }}>
                · {(plans.find(p => p.id === currentPlanId)?.royalty || '8%')} royalty
              </span>
            </p>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            Renews {user.subscription_expires_at ? new Date(user.subscription_expires_at).toLocaleDateString() : '—'}
          </p>
        </div>
      )}

      {/* Plans */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 32 }}>
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlanId
          const currentOrder = PLAN_ORDER[currentPlanId as keyof typeof PLAN_ORDER] || 0
          const planOrder = PLAN_ORDER[plan.id as keyof typeof PLAN_ORDER] || 0
          const isUpgrade = planOrder > currentOrder

          return (
            <div
              key={plan.id}
              style={{
                background: plan.color,
                border: `2px solid ${isCurrent ? plan.border : plan.border === '#0075de' ? '#0075de' : 'rgba(0,0,0,0.1)'}`,
                borderRadius: 12,
                padding: '24px 20px',
                position: 'relative',
                opacity: isCurrent ? 1 : 1,
              }}
            >
              {plan.recommended && !isCurrent && (
                <div
                  style={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '3px 12px',
                    background: '#0075de',
                    color: '#fff',
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    letterSpacing: '0.5px',
                  }}
                >
                  RECOMMENDED
                </div>
              )}

              {/* Plan header */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: 'rgba(0,0,0,0.9)' }}>{plan.name}</p>
                  {isCurrent && (
                    <span className="badge badge-blue" style={{ fontSize: 11 }}>Current</span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                  <span style={{ fontSize: 28, fontWeight: 700, color: 'rgba(0,0,0,0.95)', letterSpacing: '-1px' }}>
                    {plan.price}
                  </span>
                  <span style={{ fontSize: 13, color: '#a39e98' }}>{plan.period}</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#0075de', marginTop: 3 }}>
                  {plan.royalty} royalty
                </p>
              </div>

              {/* Features */}
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 20 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: '#615d59' }}>
                    <Check size={13} style={{ color: '#1aae39', flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
                {plan.disabled.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: '#a39e98' }}>
                    <span style={{ width: 13, textAlign: 'center', flexShrink: 0 }}>–</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {isCurrent ? (
                <div
                  style={{
                    padding: '8px 12px',
                    background: 'rgba(0,0,0,0.04)',
                    borderRadius: 4,
                    textAlign: 'center',
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#615d59',
                  }}
                >
                  Current plan ✓
                </div>
              ) : isUpgrade ? (
                <button
                  onClick={() => handleUpgrade(plan.id)}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '9px 12px', fontSize: 14 }}
                >
                  Upgrade to {plan.name} →
                </button>
              ) : (
                <button
                  className="btn-secondary"
                  style={{ width: '100%', justifyContent: 'center', padding: '9px 12px', fontSize: 14 }}
                  onClick={() => alert('Downgrade will take effect at next billing cycle. Contact support@layershop.store')}
                >
                  Switch to {plan.name}
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* FAQ */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid rgba(0,0,0,0.1)',
          borderRadius: 12,
          padding: '24px',
        }}
      >
        <p style={{ fontSize: 15, fontWeight: 700, color: 'rgba(0,0,0,0.9)', marginBottom: 16 }}>
          Frequently Asked Questions
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { q: 'How do I pay?', a: 'We accept Alipay, WeChat Pay, and bank transfer (CNY). Billed annually.' },
            { q: 'Can I switch plans?', a: 'Yes. Upgrades take effect immediately. Downgrades apply at the next billing cycle.' },
            { q: 'How are royalties paid?', a: 'Royalties are paid in USD via Payoneer or PayPal, monthly, after you reach the minimum of $50.' },
            { q: 'Is the free plan really free?', a: 'Yes. Free plan is free forever with no time limits.' },
          ].map((item, i) => (
            <div key={i} style={{ paddingBottom: i < 3 ? 16 : 0, borderBottom: i < 3 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'rgba(0,0,0,0.85)', marginBottom: 4 }}>{item.q}</p>
              <p style={{ fontSize: 13, color: '#615d59', lineHeight: 1.6 }}>{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
