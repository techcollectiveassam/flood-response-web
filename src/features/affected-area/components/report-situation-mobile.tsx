import { useTranslation } from 'react-i18next'
import { DetailsField } from './details-field'
import { MobileSituationFooter } from './mobile-situation-footer'
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
      <header className="mt-6">
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

      <MobileSituationFooter onBack={onBack} />
    </>
  )
}
