import { Asterisk } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function SosTriggerButton() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-border-subtle bg-card p-5">
      <div className="relative flex items-center justify-center">
        <span
          className="absolute size-56 rounded-full bg-emergency-ring/40 motion-safe:animate-pulse"
          aria-hidden="true"
        />

        <span className="relative flex size-52 items-center justify-center rounded-full bg-emergency-ring p-2 ring-1 ring-destructive/30">
          <button
            type="button"
            aria-label={t('home.sos.ariaLabel')}
            className="flex size-full flex-col items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-lg shadow-destructive/25 transition-transform focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emergency-ring motion-safe:active:scale-[0.97]"
          >
            <Asterisk
              className="size-12 text-destructive-soft"
              strokeWidth={3}
              aria-hidden="true"
            />
            <span className="text-[2rem] font-extrabold leading-none tracking-tight">
              {t('home.sos.label')}
            </span>
            <span className="mt-1 text-[11px] font-bold uppercase tracking-[0.1em] text-destructive-soft">
              {t('home.sos.hint')}
            </span>
          </button>
        </span>
      </div>
    </div>
  )
}
