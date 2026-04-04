'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import {
  Language,
  getLanguage,
  setLanguage,
  toggleLanguage,
  translations,
} from '@/utils/language'

interface LanguageContextType {
  language: Language
  t: typeof translations.bn
  toggle: () => void
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>('bn')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const initialLang = getLanguage()
    setLanguageState(initialLang)
  }, [])

  const handleToggle = () => {
    const newLang = toggleLanguage()
    setLanguageState(newLang)
  }

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    setLanguageState(lang)
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        t: translations[language],
        toggle: handleToggle,
        setLanguage: handleSetLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}
