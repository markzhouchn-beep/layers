import { useState } from 'react'
import { Check, ArrowRight, ArrowLeft, Upload } from 'lucide-react'

const steps = [
  { num: 1, label: '注册账号' },
  { num: 2, label: '选择方案' },
  { num: 3, label: '上传作品' },
]

const plans = [
  {
    id: 'free',
    name: '免费版',
    price: '¥0',
    priceSub: '/年',
    royalty: '8%',
    features: ['最多 10 件作品', '基础分析', '标准支持'],
    highlight: false,
  },
  {
    id: 'basic',
    name: '基础版',
    price: '¥299',
    priceSub: '/年',
    royalty: '30%',
    features: ['最多 50 件作品', '优先审核', 'Instagram 同步', '销售数据分析'],
    highlight: true,
    recommended: true,
  },
  {
    id: 'pro',
    name: '专业版',
    price: '¥599',
    priceSub: '/年',
    royalty: '45%',
    features: ['无限作品', '优先审核', 'Instagram 同步', '高级分析', '专属客服', '提现优先'],
    highlight: false,
  },
]

export default function Join() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    artist_name: '',
    plan: 'basic',
  })
  const [dragOver, setDragOver] = useState(false)

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    // File upload handling would go here
  }

  return (
    <div className="pt-16 min-h-screen bg-paper">
      {/* Header */}
      <div className="max-w-3xl mx-auto px-6 pt-16 pb-8">
        <h1 className="text-3xl font-semibold text-ink mb-2">艺术家入驻</h1>
        <p className="text-smoke">三步开启你的全球版画商店</p>
      </div>

      {/* Steps */}
      <div className="max-w-3xl mx-auto px-6 mb-12">
        <div className="flex items-center">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    step > s.num
                      ? 'bg-bamboo text-paper'
                      : step === s.num
                      ? 'bg-vermilion text-paper'
                      : 'bg-light-ink text-smoke'
                  }`}
                >
                  {step > s.num ? <Check size={18} /> : s.num}
                </div>
                <p className={`text-xs mt-2 ${step === s.num ? 'text-ink font-medium' : 'text-smoke'}`}>
                  {s.label}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px mx-4 mb-6 ${step > s.num ? 'bg-bamboo' : 'bg-light-ink'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form content */}
      <div className="max-w-3xl mx-auto px-6 pb-20">
        {/* Step 1: Register */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">艺术家名称</label>
              <input
                type="text"
                value={form.artist_name}
                onChange={(e) => setForm({ ...form, artist_name: e.target.value })}
                placeholder={'你的展示名称，如「李墨白水墨」'}
                className="w-full px-4 py-3 bg-warm-gray border border-light-ink rounded-lg text-sm text-ink placeholder:text-smoke/60 focus:outline-none focus:border-vermilion transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">用户名</label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="唯一用户名，用于个人主页 URL"
                className="w-full px-4 py-3 bg-warm-gray border border-light-ink rounded-lg text-sm text-ink placeholder:text-smoke/60 focus:outline-none focus:border-vermilion transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">邮箱</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="用于登录和通知"
                className="w-full px-4 py-3 bg-warm-gray border border-light-ink rounded-lg text-sm text-ink placeholder:text-smoke/60 focus:outline-none focus:border-vermilion transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">密码</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="至少 8 位"
                className="w-full px-4 py-3 bg-warm-gray border border-light-ink rounded-lg text-sm text-ink placeholder:text-smoke/60 focus:outline-none focus:border-vermilion transition-colors"
              />
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full py-3.5 bg-ink text-paper font-medium rounded-lg hover:bg-ink/80 transition-colors flex items-center justify-center gap-2"
            >
              下一步 <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Step 2: Choose plan */}
        {step === 2 && (
          <div>
            <p className="text-sm text-smoke mb-6 text-center">
              选择你的订阅方案，随时可升级或降级
            </p>
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => setForm({ ...form, plan: plan.id })}
                  className={`relative cursor-pointer p-5 rounded-2xl border-2 transition-all ${
                    form.plan === plan.id
                      ? 'border-vermilion bg-vermilion/5'
                      : plan.highlight
                      ? 'border-light-ink bg-warm-gray'
                      : 'border-light-ink bg-paper hover:border-smoke'
                  }`}
                >
                  {plan.recommended && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-vermilion text-paper text-xs rounded-full">
                      推荐
                    </span>
                  )}
                  <p className="text-base font-semibold text-ink mb-1">{plan.name}</p>
                  <div className="mb-3">
                    <span className="text-2xl font-semibold text-ink">{plan.price}</span>
                    <span className="text-sm text-smoke">{plan.priceSub}</span>
                  </div>
                  <p className="text-sm font-medium text-vermilion mb-4">{plan.royalty} 版税</p>
                  <ul className="space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-smoke">
                        <Check size={12} className="text-bamboo flex-shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3.5 border border-light-ink text-sm font-medium text-smoke rounded-lg hover:bg-warm-gray transition-colors flex items-center gap-2"
              >
                <ArrowLeft size={16} /> 返回
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3.5 bg-ink text-paper font-medium rounded-lg hover:bg-ink/80 transition-colors flex items-center justify-center gap-2"
              >
                下一步 <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Upload */}
        {step === 3 && (
          <div>
            <p className="text-sm text-smoke mb-6 text-center">
              上传你的第一件原创作品（可选，也可以之后上传）
            </p>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleFileDrop}
              className={`border-2 border-dashed rounded-2xl p-12 text-center mb-6 transition-colors ${
                dragOver ? 'border-vermilion bg-vermilion/5' : 'border-light-ink'
              }`}
            >
              <Upload size={32} className="mx-auto mb-4 text-smoke" strokeWidth={1.5} />
              <p className="text-sm font-medium text-ink mb-1">拖拽图片到此处</p>
              <p className="text-xs text-smoke mb-4">或点击下方按钮选择文件</p>
              <button className="px-6 py-2 bg-warm-gray border border-light-ink text-sm font-medium text-ink rounded-lg hover:bg-light-ink transition-colors">
                选择文件
              </button>
              <p className="text-xs text-smoke mt-4">支持 JPG/PNG，最大 10MB</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3.5 border border-light-ink text-sm font-medium text-smoke rounded-lg hover:bg-warm-gray transition-colors flex items-center gap-2"
              >
                <ArrowLeft size={16} /> 返回
              </button>
              <button
                onClick={() => alert('注册成功！请前往邮箱验证账号。')}
                className="flex-1 py-3.5 bg-vermilion text-paper font-medium rounded-lg hover:bg-vermilion/90 transition-colors flex items-center justify-center gap-2"
              >
                完成入驻 <Check size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
