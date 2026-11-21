import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'

type ReportReviewDesktopProps = {
  onBack: () => void
}

export function ReportReviewDesktop({ onBack }: ReportReviewDesktopProps) {
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

      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {t('affectedArea.backToPhotos')}
        </button>
      </div>
    </>
  )
}
