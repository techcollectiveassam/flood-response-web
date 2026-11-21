import { ArrowLeft, ArrowRight, CircleCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/hooks/use-language'
import { buildLocalizedPath } from '@/lib/i18n/locale-segment'

type DesktopLocationFooterProps = {
  onNext: () => void
}

export function DesktopLocationFooter({ onNext }: DesktopLocationFooterProps) {
  const { t } = useTranslation()
  const { language } = useLanguage()

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
        <Link
          to={buildLocalizedPath(language, '/')}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {t('affectedArea.backToHome')}
        </Link>

        <Button
          type="button"
          onClick={onNext}
          className="h-12 rounded-xl bg-primary px-5 text-sm font-bold uppercase tracking-[0.08em] text-primary-foreground hover:bg-primary-hover"
        >
          {t('affectedArea.nextSituation')}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}
