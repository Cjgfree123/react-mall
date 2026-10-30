import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

export const languages = ['en', 'zh-CN'] as const
export type Language = (typeof languages)[number]
const storageKey = 'shopping-hub.language'

function getInitialLanguage(): Language {
  try {
    return localStorage.getItem(storageKey) === 'zh-CN' ? 'zh-CN' : 'en'
  } catch {
    return 'en'
  }
}

void i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, 'zh-CN': { translation: zhCN } },
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  supportedLngs: [...languages],
  initAsync: false,
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
})

function syncDocument() {
  document.documentElement.lang = i18n.resolvedLanguage ?? 'en'
  document.title = i18n.t('meta.title')
  document.querySelector('meta[name="description"]')?.setAttribute('content', i18n.t('meta.description'))
  try {
    localStorage.setItem(storageKey, i18n.resolvedLanguage ?? 'en')
  } catch {
    // Language switching still works when browser storage is unavailable.
  }
}

i18n.on('languageChanged', syncDocument)
syncDocument()

if (import.meta.hot) {
  import.meta.hot.dispose(() => i18n.off('languageChanged', syncDocument))
}

export default i18n
