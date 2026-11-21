import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { SeverityLevelField } from './severity-level-field'

type ReportSituationDesktopProps = {
  onBack: () => void
}

export function ReportSituationDesktop({
  onBack,
}: ReportSituationDesktopProps) {
  const { t } = useTranslation()

  return (
    <>
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {t('affectedArea.backToLocation')}
        </button>
      </div>

      <section className="rounded-2xl border border-border-subtle bg-card p-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {t('affectedArea.situation.title')}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {t('affectedArea.situation.description')}
        </p>
      </section>

      <SeverityLevelField />
    </>
  )
}
