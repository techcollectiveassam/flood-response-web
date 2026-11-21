import { cn } from '@/lib/utils'

type OptionRadioIndicatorProps = {
  checked: boolean
}

export function OptionRadioIndicator({
  checked,
}: OptionRadioIndicatorProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex size-5 shrink-0 items-center justify-center rounded-full transition-colors',
        checked ? 'bg-primary-soft ring-1 ring-primary/20' : 'bg-primary-soft/70',
      )}
    >
      {checked ? <span className="size-2.5 rounded-full bg-primary" /> : null}
    </span>
  )
}
