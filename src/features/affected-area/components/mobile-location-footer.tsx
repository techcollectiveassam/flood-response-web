import { ArrowRight, CircleCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

export function MobileLocationFooter() {
  const { t } = useTranslation()

  return (
    <div className="mt-5">
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
        {t('affectedArea.next')}
        <ArrowRight className="size-4" aria-hidden="true" />
      </Button>
    </div>
  )
}
