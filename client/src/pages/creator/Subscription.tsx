import { Check } from 'lucide-react'

const plans = [
  {
    id: 'free',
    name: '免费版',
    price: '¥0',
    priceSub: '/年',
    royalty: '8%',
    color: 'border-light-ink',
    highlight: false,
    features: [
      '最多 10 件作品',
      '1 个外部平台',
      '基础数据统计',
      '邮件支持',
    ],
    disabled: [],
  },
  {
    id: 'basic',
    name: '基础版',
    price: '¥299',
    priceSub: '/年',
    royalty: '30%',
    color: 'border-vermilion',
    highlight: true,
    recommended: true,
    features: [
      '最多 50 件作品',
      '3 个外部平台',
      '高级数据分析',
      '优先审核',
      'Email 支持',
    ],
    disabled: [],
  },
  {
    id: 'pro',
    name: '专业版',
    price: '¥599',
    priceSub: '/年',
    royalty: '45%',
    color: 'border-light-ink',
    highlight: false,
    features: [
      '无限作品数量',
      '无限外部平台',
      '高级数据分析',
      '优先审核',
      '专属客服',
      '优先提现',
    ],
    disabled: [],
  },
]

const currentPlan = 'basic'

export default function Subscription() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">订阅方案</h1>
        <p className="text-smoke text-sm mt-1">选择最适合您的方案，随时升级或降级</p>
      </div>

      {/* Current plan */}
      <div className="bg-ink text-paper rounded-xl p-5">
        <p className="text-xs text-paper/50 mb-1">当前方案</p>
        <div className="flex items-center justify-between">
          <p className="text-xl font-semibold">
            {plans.find(p => p.id === currentPlan)?.name}
            <span className="text-paper/50 text-sm ml-2">
              ({plans.find(p => p.id === currentPlan)?.royalty} 版税)
            </span>
          </p>
          <p className="text-sm text-paper/50">到期日：2027-04-14</p>
        </div>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-4">
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlan
          const isUpgrade = !isCurrent && plan.id !== 'free' && plan.id !== currentPlan

          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl border-2 ${plan.color} p-6 ${plan.highlight ? 'shadow-md' : ''}`}
            >
              {plan.recommended && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-vermilion text-paper text-xs rounded-full">
                  推荐
                </span>
              )}

              <div className="mb-4">
                <p className="text-base font-semibold text-ink">{plan.name}</p>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-ink">{plan.price}</span>
                  <span className="text-sm text-smoke">{plan.priceSub}</span>
                </div>
                <p className="text-sm font-medium text-vermilion mt-1">{plan.royalty} 版税</p>
              </div>

              <ul className="space-y-2.5 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-smoke">
                    <Check size={14} className="text-bamboo flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>

              <button
                disabled={isCurrent}
                className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isCurrent
                    ? 'bg-light-ink text-smoke cursor-not-allowed'
                    : isUpgrade
                    ? 'bg-vermilion text-paper hover:bg-vermilion/90'
                    : 'bg-warm-gray text-ink hover:bg-light-ink'
                }`}
              >
                {isCurrent ? '当前方案' : isUpgrade ? '立即升级' : '降级'}
              </button>
            </div>
          )
        })}
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-xl border border-light-ink p-6">
        <h3 className="font-semibold text-ink mb-4">常见问题</h3>
        <div className="space-y-4">
          {[
            { q: '订阅费用如何支付？', a: '支持支付宝、微信支付、银行转账，按年结算。' },
            { q: '可以随时更换方案吗？', a: '可以。升级立即生效，降级次年生效。' },
            { q: '版税如何结算？', a: '通过 Stripe Connect 美元结算，每月自动打款到您的账户。' },
            { q: '免费版可以试用吗？', a: '可以。免费版永久有效，无时间限制。' },
          ].map((item) => (
            <div key={item.q} className="border-b border-light-ink last:border-0 pb-4 last:pb-0">
              <p className="text-sm font-medium text-ink mb-1">{item.q}</p>
              <p className="text-sm text-smoke">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
