import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const steps = ['注册账号', '选择方案', '完成']

const plans = [
  { id: 'free', name: '免费版', price: '¥0', priceSub: '/年', royalty: '8%', features: ['最多 10 件作品', '1 个外部平台', '基础数据分析'] },
  { id: 'basic', name: '基础版', price: '¥299', priceSub: '/年', royalty: '30%', recommended: true, features: ['最多 50 件作品', '3 个外部平台', '优先审核', '高级数据分析'] },
  { id: 'pro', name: '专业版', price: '¥599', priceSub: '/年', royalty: '45%', features: ['无限作品', '无限外部平台', '优先审核', '专属客服', '优先提现'] },
]

export default function Join() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ username: '', email: '', password: '', artist_name: '', plan: 'free' })

  const validateStep1 = () => {
    if (!form.artist_name.trim()) return '请填写艺术家名称'
    if (!form.username.trim()) return '请填写用户名'
    if (!form.email.includes('@')) return '请填写有效邮箱'
    if (form.password.length < 8) return '密码至少 8 位'
    return ''
  }

  const handleStep1 = () => {
    const err = validateStep1()
    if (err) { setError(err); return }
    setError('')
    setStep(2)
  }

  const handleRegister = async () => {
    setLoading(true)
    setError('')
    try {
      await register({
        username: form.username,
        email: form.email,
        password: form.password,
        artist_name: form.artist_name,
        plan: form.plan,
      })
      setStep(3)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '注册失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-16 min-h-screen bg-paper">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 text-center">
        <h1 className="text-2xl font-semibold text-ink">艺术家入驻</h1>
        <p className="text-sm text-smoke mt-1">三步开启你的全球版画商店</p>
      </div>

      {/* Steps */}
      <div className="px-6 mb-8">
        <div className="flex items-center justify-center gap-2">
          {steps.map((label, i) => {
            const num = i + 1
            const isActive = step === num
            const isDone = step > num
            return (
              <div key={num} className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  isDone ? 'bg-bamboo text-paper' : isActive ? 'bg-vermilion text-paper' : 'bg-light-ink text-smoke'
                }`}>
                  {isDone ? <Check size={12} /> : <span>{num}</span>}
                  <span className="hidden sm:inline">{label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-8 h-px ${step > num ? 'bg-bamboo' : 'bg-light-ink'}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="px-6 pb-20 max-w-sm mx-auto">

        {/* Step 1: Account */}
        {step === 1 && (
          <div className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
                <AlertCircle size={14} />{error}
              </div>
            )}
            <div>
              <p className="text-xs text-smoke mb-1.5">艺术家名称</p>
              <input type="text" value={form.artist_name} onChange={e => setForm({...form, artist_name: e.target.value})} placeholder="如李墨白" className="w-full px-4 py-3 bg-warm-gray border border-light-ink rounded-lg text-sm text-ink placeholder:text-smoke/60 focus:outline-none focus:border-vermilion" />
            </div>
            <div>
              <p className="text-xs text-smoke mb-1.5">用户名</p>
              <input type="text" value={form.username} onChange={e => setForm({...form, username: e.target.value})} placeholder="设置唯一用户名" className="w-full px-4 py-3 bg-warm-gray border border-light-ink rounded-lg text-sm text-ink placeholder:text-smoke/60 focus:outline-none focus:border-vermilion" />
            </div>
            <div>
              <p className="text-xs text-smoke mb-1.5">邮箱</p>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="用于登录和通知" className="w-full px-4 py-3 bg-warm-gray border border-light-ink rounded-lg text-sm text-ink placeholder:text-smoke/60 focus:outline-none focus:border-vermilion" />
            </div>
            <div>
              <p className="text-xs text-smoke mb-1.5">密码</p>
              <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="至少 8 位" className="w-full px-4 py-3 bg-warm-gray border border-light-ink rounded-lg text-sm text-ink placeholder:text-smoke/60 focus:outline-none focus:border-vermilion" />
            </div>
            <button onClick={handleStep1} className="w-full py-3.5 bg-ink text-paper text-sm font-medium rounded-lg hover:bg-ink/80 flex items-center justify-center gap-2">
              下一步 <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Step 2: Plan */}
        {step === 2 && (
          <div>
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 mb-4">
                <AlertCircle size={14} />{error}
              </div>
            )}
            <p className="text-xs text-smoke mb-4 text-center">选择您的订阅方案（稍后可更改）</p>
            <div className="space-y-3 mb-6">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setForm({...form, plan: plan.id})}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all relative ${
                    form.plan === plan.id ? 'border-vermilion bg-vermilion/5' : 'border-light-ink bg-paper hover:border-smoke'
                  }`}
                >
                  {plan.recommended && (
                    <span className="absolute -top-2.5 left-4 px-2.5 py-0.5 bg-vermilion text-paper text-xs rounded-full">推荐</span>
                  )}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-ink">{plan.name}</p>
                      <p className="text-xs text-vermilion mt-0.5">{plan.royalty} 版税</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-ink">{plan.price}</p>
                      <p className="text-xs text-smoke">{plan.priceSub}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {plan.features.map((f) => (
                      <span key={f} className="text-xs text-smoke bg-warm-gray px-2 py-0.5 rounded-full">{f}</span>
                    ))}
                  </div>
                  {form.plan === plan.id && (
                    <div className="absolute top-4 right-4"><Check size={14} className="text-vermilion" /></div>
                  )}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="px-5 py-3 border border-light-ink text-sm text-smoke rounded-lg hover:bg-warm-gray flex items-center gap-1.5">
                <ArrowLeft size={14} /> 返回
              </button>
              <button onClick={handleRegister} disabled={loading} className="flex-1 py-3 bg-ink text-paper text-sm font-medium rounded-lg hover:bg-ink/80 flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? '注册中...' : '完成入驻'} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="text-center">
            <div className="w-16 h-16 bg-bamboo/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-bamboo" />
            </div>
            <h2 className="text-xl font-semibold text-ink mb-2">入驻成功！</h2>
            <p className="text-sm text-smoke mb-6">
              欢迎加入 Layers，您的作品即将触达全球消费者。
            </p>
            <div className="bg-warm-gray rounded-xl p-5 text-left mb-6">
              <p className="text-sm font-medium text-ink mb-3">接下来：</p>
              <ul className="space-y-2">
                {['上传您的第一件原创作品', '连接 Gumroad / Etsy 等外部平台', '等待审核通过，作品自动上架'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-smoke">
                    <Check size={14} className="text-bamboo mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <button onClick={() => navigate('/creator')} className="w-full py-3.5 bg-vermilion text-paper text-sm font-medium rounded-lg hover:bg-vermilion/90 flex items-center justify-center gap-2">
              进入创作者后台 <ArrowRight size={16} />
            </button>
            <a href="/" className="block mt-3 text-sm text-smoke hover:text-vermilion">
              先去商店看看 →
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
