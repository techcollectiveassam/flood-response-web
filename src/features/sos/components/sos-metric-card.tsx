import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

type SosMetricTone = 'default' | 'info' | 'success'
type SosMetricHintTone = 'muted' | 'success'

type SosMetricCardProps = {
  label: string
  value: string
  unit?: string
  hint: string
  tone?: SosMetricTone
  hintTone?: SosMetricHintTone
}

const valueToneClasses: Record<SosMetricTone, string> = {
  default: 'text-foreground',
  info: 'text-primary',
  success: 'text-success-text',
}

export function SosMetricCard({
  label,
  value,
  unit,
  hint,
  tone = 'default',
  hintTone = 'muted',
}: SosMetricCardProps) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-soft/70 p-4 text-left">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className={cn('mt-1 text-2xl font-black', valueToneClasses[tone])}>
        {value}
        {unit ? (
          <span className="ml-1 text-xs font-normal text-muted-foreground">
            {unit}
          </span>
        ) : null}
      </p>
      <p
        className={cn(
          'mt-1 flex items-center gap-1 text-[11px] font-medium',
          hintTone === 'success' ? 'text-success-text' : 'text-muted-foreground',
        )}
      >
        {hintTone === 'success' ? (
          <Check className="size-3.5 shrink-0" aria-hidden="true" />
        ) : null}
        {hint}
      </p>
    </div>
  )
}
