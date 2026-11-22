import { useTranslation } from 'react-i18next'
import type { TranslationKey } from '@/lib/i18n/catalog'
import { MobileReviewFooter } from './mobile-review-footer'
import { ReporterContactCard } from './reporter-contact-card'
import { ReviewSummary } from './review-summary'

type ReportReviewMobileProps = {
  onBack: () => void
  onEditLocation: () => void
  onEditSituation: () => void
  onEditPhotos: () => void
  onSubmit: () => void
  isSubmitting: boolean
  errorKey: TranslationKey | null
}

export function ReportReviewMobile({
  onBack,
  onEditLocation,
  onEditSituation,
  onEditPhotos,
  onSubmit,
  isSubmitting,
  errorKey,
}: ReportReviewMobileProps) {
  const { t } = useTranslation()

  return (
    <>
      <header className="mt-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {t('affectedArea.review.title')}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {t('affectedArea.review.description')}
        </p>
      </header>

      <div className="mt-6 space-y-4">
        <ReviewSummary
          onEditLocation={onEditLocation}
          onEditSituation={onEditSituation}
          onEditPhotos={onEditPhotos}
        />
        <ReporterContactCard />
      </div>

      <MobileReviewFooter
        onBack={onBack}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        errorKey={errorKey}
      />
    </>
  )
}
