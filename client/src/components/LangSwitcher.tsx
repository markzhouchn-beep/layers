import { useState } from 'react'
import { Globe } from 'lucide-react'
import { useI18n } from '../i18n'
import type { Lang } from '../i18n'

const langs: { key: Lang; label: string }[] = [
  { key: 'en', label: 'English' },
  { key: 'zh', label: '中文' },
  { key: 'fr', label: 'Français' },
]

export default function LangSwitcher() {
  const { lang, setLang } = useI18n()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-smoke hover:text-ink transition-colors"
      >
        <Globe size={14} />
        <span>{langs.find(l => l.key === lang)?.label}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-paper border border-light-ink rounded-lg shadow-md py-1 min-w-[100px] z-50">
          {langs.map((l) => (
            <button
              key={l.key}
              onClick={() => { setLang(l.key); setOpen(false) }}
              className={`w-full text-left px-4 py-2 text-xs transition-colors ${
                lang === l.key ? 'text-vermilion font-medium' : 'text-smoke hover:text-ink'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
