import { ArrowLeft, ArrowRight, CircleCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

type DesktopReviewFooterProps = {
  onBack: () => void
}

export function DesktopReviewFooter({ onBack }: DesktopReviewFooterProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-success-soft px-4 py-3">
        <p className="flex items-start gap-2 text-xs leading-relaxed text-success-text">
          <CircleCheck
            className="mt-0.5 size-4 shrink-0"
            aria-hidden="true"
          />
          <span>{t('affectedArea.location.savedDesktop')}</span>
        </p>

        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-foreground">
          {t('affectedArea.location.draftStatus')}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {t('affectedArea.backToPhotos')}
        </button>

        <Button
          type="button"
          className="h-12 rounded-xl bg-primary px-5 text-sm font-bold uppercase tracking-[0.08em] text-primary-foreground hover:bg-primary-hover"
        >
          {t('affectedArea.review.submit')}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}
