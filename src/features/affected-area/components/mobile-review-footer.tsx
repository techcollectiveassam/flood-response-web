import { ArrowLeft, ArrowRight, CircleCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

type MobileReviewFooterProps = {
  onBack: () => void
}

export function MobileReviewFooter({ onBack }: MobileReviewFooterProps) {
  const { t } = useTranslation()

  return (
    <div className="mt-6">
      <p className="flex items-start justify-center gap-2 text-center text-xs leading-relaxed text-muted-foreground">
        <CircleCheck
          className="mt-0.5 size-4 shrink-0 text-success-text"
          aria-hidden="true"
        />
        <span className="max-w-xs">
          {t('affectedArea.location.saved')}
        </span>
      </p>

      <Button
        type="button"
        className="mt-4 h-12 w-full rounded-xl bg-primary text-sm font-bold uppercase tracking-[0.08em] text-primary-foreground hover:bg-primary-hover"
      >
        {t('affectedArea.review.submit')}
        <ArrowRight className="size-4" aria-hidden="true" />
      </Button>

      <p className="mt-2 text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {t('affectedArea.location.draftStatus')}
      </p>

      <div className="mt-1 flex justify-center">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {t('affectedArea.backToPhotos')}
        </button>
      </div>
    </div>
  )
}
