import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import { en } from './en'
import { zh } from './zh'
import { fr } from './fr'

type Translations = typeof en
type Lang = 'en' | 'zh' | 'fr'

const translations: Record<Lang, Translations> = { en, zh, fr }

interface I18nContextValue {
  lang: Lang
  t: Translations
  setLang: (l: Lang) => void
}

const I18nContext = createContext<I18nContextValue>({
  lang: 'en',
  t: en,
  setLang: () => {},
})

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem('layers_lang') as Lang
    return saved || 'en'
  })

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    localStorage.setItem('layers_lang', l)
  }, [])

  return (
    <I18nContext.Provider value={{ lang, t: translations[lang], setLang }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}

export type { Lang, Translations }
