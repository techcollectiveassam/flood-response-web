import { useTranslation } from 'react-i18next'
import { MobileReportProgress } from './mobile-report-progress'

export function ReportFloodMobile() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto w-full max-w-md">
      <MobileReportProgress currentStep={1} />

      <header className="mt-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {t('affectedArea.location.title')}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {t('affectedArea.location.description')}
        </p>
      </header>
    </div>
  )
}
