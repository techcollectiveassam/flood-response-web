import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { DetailsField } from './details-field'
import { SeverityLevelField } from './severity-level-field'

type ReportSituationMobileProps = {
  onBack: () => void
}

export function ReportSituationMobile({
  onBack,
}: ReportSituationMobileProps) {
  const { t } = useTranslation()

  return (
    <>
      <div className="mt-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {t('affectedArea.backToLocation')}
        </button>
      </div>

      <header className="mt-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {t('affectedArea.situation.title')}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {t('affectedArea.situation.description')}
        </p>
      </header>

      <div className="mt-6">
        <SeverityLevelField />
      </div>

      <div className="mt-6">
        <DetailsField />
      </div>
    </>
  )
}
