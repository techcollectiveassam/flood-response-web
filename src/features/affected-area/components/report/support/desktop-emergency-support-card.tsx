import { PhoneCall, Siren } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

const STATE_EMERGENCY_NUMBER = '1070'
const DISTRICT_EMERGENCY_NUMBER = '1077'

type EmergencyLineProps = {
  label: string
  number: string
  tone: 'emergency' | 'primary'
}

function EmergencyLine({ label, number, tone }: EmergencyLineProps) {
  const toneClass =
    tone === 'emergency' ? 'text-destructive' : 'text-primary'

  return (
    <a
      href={`tel:${number}`}
      className="flex min-h-12 items-center gap-3 rounded-xl bg-card px-3 py-2.5 shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
    >
      <PhoneCall
        className={cn('size-4 shrink-0', toneClass)}
        aria-hidden="true"
      />
      <span className="min-w-0 flex-1 text-sm font-medium text-foreground">
        {label}
      </span>
      <span className={cn('text-base font-bold', toneClass)}>{number}</span>
    </a>
  )
}

export function DesktopEmergencySupportCard() {
  const { t } = useTranslation()

  return (
    <section className="rounded-2xl bg-destructive-soft p-5">
      <div className="flex items-start gap-2">
        <Siren
          className="mt-0.5 size-5 shrink-0 text-destructive"
          aria-hidden="true"
        />
        <h2 className="text-lg font-bold leading-tight text-destructive">
          {t('affectedArea.support.emergency.title')}
        </h2>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-foreground/80">
        {t('affectedArea.support.emergency.description')}
      </p>

      <div className="mt-4 space-y-2">
        <EmergencyLine
          label={t('affectedArea.support.emergency.stateLabel')}
          number={STATE_EMERGENCY_NUMBER}
          tone="emergency"
        />
        <EmergencyLine
          label={t('affectedArea.support.emergency.districtLabel')}
          number={DISTRICT_EMERGENCY_NUMBER}
          tone="primary"
        />
      </div>

      <p className="mt-3 text-center text-[11px] leading-relaxed text-muted-foreground">
        {t('affectedArea.support.emergency.footer')}
      </p>
    </section>
  )
}
