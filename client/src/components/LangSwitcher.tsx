import { useState } from 'react'
import { useI18n } from '../i18n'
import type { Lang } from '../i18n'

const langs: { key: Lang; label: string }[] = [
  { key: 'en', label: 'EN' },
  { key: 'zh', label: '中文' },
  { key: 'fr', label: 'FR' },
]

export default function LangSwitcher() {
  const { lang, setLang } = useI18n()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-sm font-medium text-[rgba(0,0,0,0.6)] hover:text-[rgba(0,0,0,0.9)] transition-colors px-2 py-1 rounded-md hover:bg-[rgba(0,0,0,0.05)]"
      >
        <span>{langs.find(l => l.key === lang)?.label}</span>
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ opacity: 0.6 }}>
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 bg-white border border-[rgba(0,0,0,0.1)] rounded-lg shadow-[0_4px_18px_rgba(0,0,0,0.08)] py-1 min-w-[80px] z-50">
            {langs.map((l) => (
              <button
                key={l.key}
                onClick={() => { setLang(l.key); setOpen(false) }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  lang === l.key
                    ? 'font-semibold text-[rgba(0,0,0,0.9)]'
                    : 'text-[rgba(0,0,0,0.65)] hover:text-[rgba(0,0,0,0.9)] hover:bg-[rgba(0,0,0,0.04)]'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
