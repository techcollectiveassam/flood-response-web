import { useTranslation } from 'react-i18next'
import { DesktopSituationFooter } from './desktop-situation-footer'
import { DetailsField } from './details-field'
import { SeverityLevelField } from './severity-level-field'

type ReportSituationDesktopProps = {
  onBack: () => void
  onNext: () => void
}

export function ReportSituationDesktop({
  onBack,
  onNext,
}: ReportSituationDesktopProps) {
  const { t } = useTranslation()

  return (
    <>
      <section className="rounded-2xl border border-border-subtle bg-card p-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {t('affectedArea.situation.title')}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {t('affectedArea.situation.description')}
        </p>
      </section>

      <SeverityLevelField />

      <DetailsField />

      <DesktopSituationFooter onBack={onBack} onNext={onNext} />
    </>
  )
}
