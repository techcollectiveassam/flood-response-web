import { useTranslation } from 'react-i18next'

export function SosCreatePage() {
  const { t } = useTranslation()

  return (
    <section>
      <header>
        <h1 className="text-2xl font-semibold">{t('sos.create.title')}</h1>
      </header>
    </section>
  )
}
