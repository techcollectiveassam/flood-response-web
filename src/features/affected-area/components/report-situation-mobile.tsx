import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useReportDraft } from '../contexts/report-draft-context'
import { DetailsField } from './details-field'
import { MobileSituationFooter } from './mobile-situation-footer'
import { SeverityLevelField } from './severity-level-field'

type ReportSituationMobileProps = {
  onBack: () => void
  onNext: () => void
}

export function ReportSituationMobile({
  onBack,
  onNext,
}: ReportSituationMobileProps) {
  const { t } = useTranslation()
  const { draft } = useReportDraft()
  const [showSeverityError, setShowSeverityError] = useState(false)

  function handleNext() {
    if (!draft.situation.severity) {
      setShowSeverityError(true)
      return
    }

    setShowSeverityError(false)
    onNext()
  }

  return (
    <>
      <header className="mt-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {t('affectedArea.situation.title')}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {t('affectedArea.situation.description')}
        </p>
      </header>

      <div className="mt-6">
        <SeverityLevelField error={showSeverityError} />
      </div>

      <div className="mt-6">
        <DetailsField />
      </div>

      <MobileSituationFooter onBack={onBack} onNext={handleNext} />
    </>
  )
}
