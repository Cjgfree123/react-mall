import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { LanguageSwitcher } from '../../components/LanguageSwitcher'
import './index.less'

export default function NotFoundPage() {
  const { t } = useTranslation()
  return <main className="not-found-page">
    <LanguageSwitcher />
    <p className="not-found-code">404</p>
    <h1>{t('notFound.title')}</h1>
    <p>{t('notFound.description')}</p>
    <Link to="/">{t('notFound.backHome')}</Link>
  </main>
}
