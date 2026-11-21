import { useTranslation } from 'react-i18next'
import { DesktopReviewFooter } from './desktop-review-footer'
import { ReporterContactCard } from './reporter-contact-card'
import { ReviewSummary } from './review-summary'

type ReportReviewDesktopProps = {
  onBack: () => void
  onEditLocation: () => void
  onEditSituation: () => void
  onEditPhotos: () => void
}

export function ReportReviewDesktop({
  onBack,
  onEditLocation,
  onEditSituation,
  onEditPhotos,
}: ReportReviewDesktopProps) {
  const { t } = useTranslation()

  return (
    <>
      <section className="rounded-2xl border border-border-subtle bg-card p-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {t('affectedArea.review.title')}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {t('affectedArea.review.description')}
        </p>
      </section>

      <ReviewSummary
        onEditLocation={onEditLocation}
        onEditSituation={onEditSituation}
        onEditPhotos={onEditPhotos}
      />

      <ReporterContactCard />

      <DesktopReviewFooter onBack={onBack} />
    </>
  )
}
