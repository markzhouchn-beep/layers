import { useState } from 'react'
import { Check, ArrowRight, ArrowLeft, Upload } from 'lucide-react'

const steps = ['注册账号', '选择方案', '上传作品']

const plans = [
  {
    id: 'free',
    name: '免费版',
    price: '¥0',
    royalty: '8%',
    features: ['最多 10 件作品', '基础分析'],
  },
  {
    id: 'basic',
    name: '基础版',
    price: '¥299',
    royalty: '30%',
    features: ['最多 50 件作品', '优先审核', 'Instagram 同步'],
    recommended: true,
  },
  {
    id: 'pro',
    name: '专业版',
    price: '¥599',
    royalty: '45%',
    features: ['无限作品', '优先审核', 'Instagram 同步', '专属客服'],
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

  return (
    <div className="pt-16 min-h-screen bg-paper">

      {/* Page title */}
      <div className="px-6 pt-12 pb-6 text-center">
        <h1 className="text-2xl font-semibold text-ink">艺术家入驻</h1>
        <p className="text-sm text-smoke mt-1">三步开启你的全球版画商店</p>
      </div>

      {/* Step pills */}
      <div className="px-6 mb-8">
        <div className="flex items-center justify-center gap-2">
          {steps.map((label, i) => {
            const num = i + 1
            const isActive = step === num
            const isDone = step > num
            return (
              <div key={num} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    isDone
                      ? 'bg-bamboo text-paper'
                      : isActive
                      ? 'bg-vermilion text-paper'
                      : 'bg-light-ink text-smoke'
                  }`}
                >
                  {isDone ? <Check size={12} /> : <span>{num}</span>}
                  <span className="hidden sm:inline">{label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-6 h-px ${step > num ? 'bg-bamboo' : 'bg-light-ink'}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Form area */}
      <div className="px-6 pb-20">

        {/* STEP 1: Register */}
        {step === 1 && (
          <div className="max-w-sm mx-auto space-y-4">
            <div>
              <p className="text-xs text-smoke mb-1.5">艺术家名称</p>
              <input
                type="text"
                value={form.artist_name}
                onChange={(e) => setForm({ ...form, artist_name: e.target.value })}
                placeholder="如李墨白"
                className="w-full px-4 py-3 bg-warm-gray border border-light-ink rounded-lg text-sm text-ink placeholder:text-smoke/60 focus:outline-none focus:border-vermilion transition-colors"
              />
            </div>
            <div>
              <p className="text-xs text-smoke mb-1.5">用户名</p>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="设置唯一用户名"
                className="w-full px-4 py-3 bg-warm-gray border border-light-ink rounded-lg text-sm text-ink placeholder:text-smoke/60 focus:outline-none focus:border-vermilion transition-colors"
              />
            </div>
            <div>
              <p className="text-xs text-smoke mb-1.5">邮箱</p>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="用于登录和通知"
                className="w-full px-4 py-3 bg-warm-gray border border-light-ink rounded-lg text-sm text-ink placeholder:text-smoke/60 focus:outline-none focus:border-vermilion transition-colors"
              />
            </div>
            <div>
              <p className="text-xs text-smoke mb-1.5">密码</p>
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
              className="w-full py-3.5 bg-ink text-paper text-sm font-medium rounded-lg hover:bg-ink/80 transition-colors flex items-center justify-center gap-2 mt-6"
            >
              下一步 <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* STEP 2: Plans */}
        {step === 2 && (
          <div className="max-w-sm mx-auto">
            <p className="text-xs text-smoke mb-4 text-center">选择你的订阅方案</p>
            <div className="space-y-3">
              {plans.map((plan) => {
                const selected = form.plan === plan.id
                return (
                  <button
                    key={plan.id}
                    onClick={() => setForm({ ...form, plan: plan.id })}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selected
                        ? 'border-vermilion bg-vermilion/5'
                        : 'border-light-ink bg-paper hover:border-smoke'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-semibold text-ink">{plan.name}</p>
                        <p className="text-xs text-vermilion mt-0.5">{plan.royalty} 版税</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-ink">{plan.price}</p>
                        <p className="text-xs text-smoke">/年</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {plan.features.map((f) => (
                        <span key={f} className="text-xs text-smoke bg-warm-gray px-2 py-0.5 rounded-full">
                          {f}
                        </span>
                      ))}
                    </div>
                    {selected && (
                      <div className="absolute top-4 right-4">
                        <Check size={14} className="text-vermilion" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-3 border border-light-ink text-sm text-smoke rounded-lg hover:bg-warm-gray transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft size={14} /> 返回
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 bg-ink text-paper text-sm font-medium rounded-lg hover:bg-ink/80 transition-colors flex items-center justify-center gap-2"
              >
                下一步 <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Upload */}
        {step === 3 && (
          <div className="max-w-sm mx-auto">
            <p className="text-xs text-smoke mb-4 text-center">
              上传第一件作品（可选，之后也可以上传）
            </p>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false) }}
              className={`border-2 border-dashed rounded-xl p-8 text-center mb-5 transition-colors ${
                dragOver ? 'border-vermilion bg-vermilion/5' : 'border-light-ink'
              }`}
            >
              <Upload size={28} className="mx-auto mb-3 text-smoke" strokeWidth={1.5} />
              <p className="text-sm font-medium text-ink mb-1">点击选择文件</p>
              <p className="text-xs text-smoke">支持 JPG/PNG，最大 10MB</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="px-5 py-3 border border-light-ink text-sm text-smoke rounded-lg hover:bg-warm-gray transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft size={14} /> 返回
              </button>
              <button
                onClick={() => alert('注册成功！')}
                className="flex-1 py-3 bg-vermilion text-paper text-sm font-medium rounded-lg hover:bg-vermilion/90 transition-colors flex items-center justify-center gap-2"
              >
                完成入驻 <Check size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
