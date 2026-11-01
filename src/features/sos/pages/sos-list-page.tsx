import { useTranslation } from 'react-i18next'

export function SosListPage() {
  const { t } = useTranslation()

  return (
    <section>
      <header>
        <h1 className="text-2xl font-semibold">{t('sos.list.title')}</h1>
      </header>
    </section>
  )
}
