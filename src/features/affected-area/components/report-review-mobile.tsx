import { useTranslation } from 'react-i18next'
import { MobileReviewFooter } from './mobile-review-footer'
import { ReviewSummary } from './review-summary'

type ReportReviewMobileProps = {
  onBack: () => void
  onEditLocation: () => void
  onEditSituation: () => void
  onEditPhotos: () => void
}

export function ReportReviewMobile({
  onBack,
  onEditLocation,
  onEditSituation,
  onEditPhotos,
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

      <div className="mt-6">
        <ReviewSummary
          onEditLocation={onEditLocation}
          onEditSituation={onEditSituation}
          onEditPhotos={onEditPhotos}
        />
      </div>

      <MobileReviewFooter onBack={onBack} />
    </>
  )
}
