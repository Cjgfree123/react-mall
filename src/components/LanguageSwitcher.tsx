import { useTranslation } from 'react-i18next'
import { languages } from '../i18n'
import './LanguageSwitcher.less'

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation()
  return <label className="language-switcher">
    <span className="sr-only">{t('header.language')}</span>
    <select value={i18n.resolvedLanguage} onChange={(event) => { void i18n.changeLanguage(event.target.value) }}>
      {languages.map((language) => <option key={language} value={language}>{t(language === 'en' ? 'header.languageEn' : 'header.languageZh')}</option>)}
    </select>
  </label>
}
