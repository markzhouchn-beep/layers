import { ExternalLink, RefreshCw, Check, Link2 } from 'lucide-react'

const platforms = [
  {
    id: 'gumroad',
    name: 'Gumroad',
    desc: '全球最受欢迎的创作者销售平台，支持数字和实体产品',
    website: 'gumroad.com',
    color: '#FF6B35',
    connected: true,
    accountName: 'layers-artist',
    lastSync: '5 分钟前',
    totalSales: '$420',
  },
  {
    id: 'etsy',
    name: 'Etsy',
    desc: '手工艺和原创设计产品的顶级市场',
    website: 'etsy.com',
    color: '#F56400',
    connected: true,
    accountName: 'Layers Art Shop',
    lastSync: '2 小时前',
    totalSales: '$210',
  },
  {
    id: 'amazon',
    name: 'Amazon Merch',
    desc: '全球最大电商平台，按需印刷服务',
    website: 'merch.amazon.com',
    color: '#FF9900',
    connected: false,
    accountName: null,
    lastSync: null,
    totalSales: null,
  },
  {
    id: 'redbubble',
    name: 'Redbubble',
    desc: '独立艺术家产品平台，全球销售',
    website: 'redbubble.com',
    color: '#E34234',
    connected: false,
    accountName: null,
    lastSync: null,
    totalSales: null,
  },
]

export default function ExternalAccounts() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">外部平台</h1>
        <p className="text-smoke text-sm mt-1">连接您的外部销售平台，自动同步订单数据</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-light-ink p-5">
          <p className="text-xs text-smoke mb-1">已连接</p>
          <p className="text-2xl font-semibold text-ink">{platforms.filter(p=>p.connected).length}</p>
        </div>
        <div className="bg-white rounded-xl border border-light-ink p-5">
          <p className="text-xs text-smoke mb-1">本月销售</p>
          <p className="text-2xl font-semibold text-ink">$630</p>
        </div>
        <div className="bg-white rounded-xl border border-light-ink p-5">
          <p className="text-xs text-smoke mb-1">同步状态</p>
          <p className="text-sm font-medium text-bamboo flex items-center gap-1 mt-1">
            <RefreshCw size={14} /> 实时同步中
          </p>
        </div>
      </div>

      {/* Platform list */}
      <div className="space-y-4">
        {platforms.map((platform) => (
          <div key={platform.id} className="bg-white rounded-xl border border-light-ink p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                {/* Platform logo placeholder */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
                  style={{ backgroundColor: platform.color }}
                >
                  {platform.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-ink">{platform.name}</h3>
                    {platform.connected ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-bamboo/10 text-bamboo text-xs rounded-full">
                        <Check size={10} /> 已连接
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-light-ink text-smoke text-xs rounded-full">
                        未连接
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-smoke mt-0.5">{platform.desc}</p>
                  <p className="text-xs text-smoke mt-0.5">{platform.website}</p>
                  {platform.connected && (
                    <div className="flex gap-4 mt-2">
                      <span className="text-xs text-smoke">账号：<span className="text-ink">{platform.accountName}</span></span>
                      <span className="text-xs text-smoke">总销量：<span className="text-ink">{platform.totalSales}</span></span>
                      <span className="text-xs text-smoke">上次同步：<span className="text-ink">{platform.lastSync}</span></span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                {platform.connected ? (
                  <>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-light-ink text-xs text-smoke rounded-lg hover:bg-warm-gray transition-colors">
                      <RefreshCw size={12} /> 立即同步
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-light-ink text-xs text-smoke rounded-lg hover:bg-warm-gray transition-colors">
                      <ExternalLink size={12} /> 管理
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-vermilion border border-vermilion/30 rounded-lg hover:bg-vermilion/5 transition-colors">
                      断开
                    </button>
                  </>
                ) : (
                  <button className="flex items-center gap-1.5 px-4 py-1.5 bg-vermilion text-paper text-xs font-medium rounded-lg hover:bg-vermilion/90 transition-colors">
                    <Link2 size={12} /> 连接
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Note */}
      <div className="bg-warm-gray rounded-xl p-5">
        <p className="text-sm text-smoke">
          <strong className="text-ink">连接外部平台后：</strong>
          AI Agent 会自动每 15 分钟同步您的订单数据，订单信息将自动出现在您的创作者后台。
          所有敏感信息（API Key 等）均加密存储，我们绝不会将其用于平台自身运营以外的任何用途。
        </p>
      </div>
    </div>
  )
}
