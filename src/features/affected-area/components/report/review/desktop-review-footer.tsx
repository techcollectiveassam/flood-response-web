import { ArrowLeft, ArrowRight, CircleCheck, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import type { TranslationKey } from '@/lib/i18n/catalog'

type DesktopReviewFooterProps = {
  onBack: () => void
  onSubmit: () => void
  isSubmitting: boolean
  errorKey: TranslationKey | null
}

export function DesktopReviewFooter({
  onBack,
  onSubmit,
  isSubmitting,
  errorKey,
}: DesktopReviewFooterProps) {
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

      {errorKey && (
        <p
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive-soft px-3 py-2 text-xs font-semibold text-destructive"
        >
          {t(errorKey)}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {t('affectedArea.backToPhotos')}
        </button>

        <Button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="h-12 rounded-xl bg-primary px-5 text-sm font-bold uppercase tracking-[0.08em] text-primary-foreground hover:bg-primary-hover"
        >
          {t('affectedArea.review.submit')}
          {isSubmitting ? (
            <Loader2
              className="size-4 motion-safe:animate-spin"
              aria-hidden="true"
            />
          ) : (
            <ArrowRight className="size-4" aria-hidden="true" />
          )}
        </Button>
      </div>
    </div>
  )
}
