import { CircleCheck, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function DesktopPrivacySupportCard() {
  const { t } = useTranslation()

  return (
    <section className="rounded-2xl border border-border-subtle bg-card p-5 shadow-sm">
      <div className="flex items-start gap-2">
        <ShieldCheck
          className="mt-0.5 size-5 shrink-0 text-foreground"
          aria-hidden="true"
        />
        <h2 className="text-lg font-bold leading-tight text-foreground">
          {t('affectedArea.support.privacy.title')}
        </h2>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {t('affectedArea.support.privacy.description')}
      </p>

      <p className="mt-4 flex items-start gap-2 text-sm font-semibold leading-snug text-success-text">
        <CircleCheck
          className="mt-0.5 size-4 shrink-0"
          aria-hidden="true"
        />
        {t('affectedArea.support.privacy.compliant')}
      </p>
    </section>
  )
}
