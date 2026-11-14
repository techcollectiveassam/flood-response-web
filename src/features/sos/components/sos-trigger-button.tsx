import { Asterisk, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

type SosTriggerButtonVariant = 'card' | 'plain'
type SosTriggerButtonSize = 'compact' | 'hero'

type SosTriggerButtonProps = {
  variant?: SosTriggerButtonVariant
  size?: SosTriggerButtonSize
}

const sizeClasses = {
  compact: {
    ambient: 'size-56',
    ring: 'size-52 p-2',
    button: 'size-full',
    icon: 'size-12',
    label: 'text-[2rem]',
  },
  hero: {
    ambient: 'size-60',
    ring: 'size-54 p-2',
    button: 'size-44',
    icon: 'size-10',
    label: 'text-[2rem]',
  },
} as const

export function SosTriggerButton({
  variant = 'card',
  size = 'compact',
}: SosTriggerButtonProps) {
  const { t } = useTranslation()
  const classes = sizeClasses[size]
  const Icon = size === 'hero' ? Plus : Asterisk

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        variant === 'card' &&
          'rounded-2xl border border-border-subtle bg-card p-5',
      )}
    >
      <div className="relative flex items-center justify-center">
        <span
          className={cn(
            'absolute rounded-full bg-emergency-ring/40 motion-safe:animate-pulse',
            classes.ambient,
          )}
          aria-hidden="true"
        />

        <span
          className={cn(
            'relative flex items-center justify-center rounded-full bg-emergency-ring ring-1 ring-destructive/30',
            classes.ring,
          )}
        >
          <button
            type="button"
            aria-label={t('home.sos.ariaLabel')}
            className={cn(
              'flex flex-col items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-lg shadow-destructive/25 transition-transform focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emergency-ring motion-safe:active:scale-[0.97]',
              classes.button,
            )}
          >
            <Icon
              className={cn('text-destructive-soft', classes.icon)}
              strokeWidth={3}
              aria-hidden="true"
            />
            <span
              className={cn(
                'font-extrabold leading-none tracking-tight',
                classes.label,
              )}
            >
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
