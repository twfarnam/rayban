import { useState, useContext, createContext } from 'react'

type LanguageOption = 'en' | 'es'

interface LanguageContext {
  language: LanguageOption
  setLanguage: (language: LanguageOption) => void
}

const Context = createContext<LanguageContext>({
  language: navigator.language.startsWith('es') ? 'es' : 'en',
  setLanguage: () => {},
})

export function useLanguage(): LanguageContext {
  return useContext(Context)
}

export default function LanguageProvider({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement {
  const [language, setLanguage] = useState<LanguageOption>('en')

  return (
    <Context.Provider value={{ language, setLanguage }}>
      {children}
    </Context.Provider>
  )
}
