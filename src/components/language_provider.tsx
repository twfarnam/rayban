import { useEffect, useState, useContext, createContext } from 'react'
import copy from '../copy'

export type LanguageOption = keyof typeof copy
export type LanguageKey = keyof typeof copy['en']

interface LanguageContext {
  language: string
  getTranslation: (key: LanguageKey) => string
  setLanguage: (language: LanguageOption) => void
}

const Context = createContext<LanguageContext>({
  language: '',
  getTranslation: () => '',
  setLanguage: () => undefined,
})

export function useLanguage(): LanguageContext {
  return useContext(Context)
}

export default function LanguageProvider({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement {
  let lang = navigator.language.toLowerCase()
  if (lang == 'zh-sg') lang = 'zh-cn'
  let locale: LanguageOption = 'en'
  // @ts-ignore
  if (copy[lang]) {
    // @ts-ignore
    locale = lang
    // @ts-ignore
  } else if (copy[lang.split('-')[0]]) {
    // @ts-ignore
    locale = lang.split('-')[0]
  }
  const [language, setLanguage] = useState<LanguageOption>(locale)

  useEffect(() => {
    document.body.dataset.lang = language
  }, [language])

  function getTranslation(key: LanguageKey): string {
    // @ts-ignore
    return (copy[language][key] || copy['en'][key]) as string
  }

  return (
    <Context.Provider value={{ language, setLanguage, getTranslation }}>
      {children}
    </Context.Provider>
  )
}
