import { RadioTower } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function DesktopConnectivitySupportCard() {
  const { t } = useTranslation()

  return (
    <section className="rounded-2xl bg-primary-soft/40 p-5">
      <div className="flex items-start gap-2">
        <RadioTower
          className="mt-0.5 size-5 shrink-0 text-primary"
          aria-hidden="true"
        />
        <h2 className="text-lg font-bold leading-tight text-foreground">
          {t('affectedArea.support.connectivity.title')}
        </h2>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {t('affectedArea.support.connectivity.description')}
      </p>
    </section>
  )
}
