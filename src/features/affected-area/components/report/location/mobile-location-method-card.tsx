import { useTranslation } from 'react-i18next'
import type { LucideIcon } from 'lucide-react'
import type { TranslationKey } from '@/lib/i18n/catalog'
import { cn } from '@/lib/utils'
import type { LocationMethod } from '../../../utils/location-method'
import { OptionRadioIndicator } from '../shared/option-radio-indicator'

type MobileLocationMethodCardProps = {
  value: LocationMethod
  icon: LucideIcon
  titleKey: TranslationKey
  descriptionKey: TranslationKey
  checked: boolean
  onSelect: () => void
  available?: boolean
}

export function MobileLocationMethodCard({
  value,
  icon: Icon,
  titleKey,
  descriptionKey,
  checked,
  onSelect,
  available = true,
}: MobileLocationMethodCardProps) {
  const { t } = useTranslation()

  return (
    <label
      aria-disabled={!available || undefined}
      className={cn(
        'flex min-h-20 items-center gap-4 rounded-2xl border border-border-subtle bg-card p-4 transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-ring/50',
        available ? 'cursor-pointer' : 'cursor-not-allowed opacity-60',
      )}
    >
      <input
        type="radio"
        name="location-method"
        value={value}
        checked={checked}
        onChange={onSelect}
        disabled={!available}
        aria-label={t(titleKey)}
        className="sr-only"
      />

      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
        <Icon className="size-6" aria-hidden="true" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-base font-semibold leading-tight text-foreground">
          {t(titleKey)}
        </span>
        <span className="mt-0.5 block text-sm text-muted-foreground">
          {t(descriptionKey)}
        </span>
        {!available && (
          <span className="mt-1 block text-[11px] font-semibold text-muted-foreground">
            {t('affectedArea.location.methodUnavailable')}
          </span>
        )}
      </span>

      <OptionRadioIndicator checked={checked} />
    </label>
  )
}
