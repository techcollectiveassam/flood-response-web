import { Crosshair, Navigation, Satellite } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { OptionRadioIndicator } from './option-radio-indicator'

type DesktopDeviceCardProps = {
  checked: boolean
  onSelect: () => void
}

export function DesktopDeviceCard({
  checked,
  onSelect,
}: DesktopDeviceCardProps) {
  const { t } = useTranslation()
  const hintId = useId()

  return (
    <div className="rounded-2xl border border-border-subtle bg-card p-5">
      <label className="flex min-w-0 cursor-pointer items-start gap-3 rounded-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-ring/50">
        <input
          type="radio"
          name="location-method"
          value="device"
          checked={checked}
          onChange={onSelect}
          aria-label={t('affectedArea.location.device.desktopTitle')}
          className="sr-only"
        />
        <OptionRadioIndicator checked={checked} />

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-start justify-between gap-3">
            <span className="flex min-w-0 items-center gap-2">
              <Crosshair className="size-5 shrink-0 text-primary" aria-hidden="true" />
              <span className="text-lg font-bold leading-tight text-foreground">
                {t('affectedArea.location.device.desktopTitle')}
              </span>
            </span>

            <span className="rounded-full bg-primary-soft px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-primary">
              {t('affectedArea.location.device.fastest')}
            </span>
          </span>

          <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
            {t('affectedArea.location.device.description')}
          </span>
        </span>
      </label>

      <div className="mt-4 flex flex-wrap items-start gap-4">
        <Button
          type="button"
          aria-describedby={hintId}
          className="h-12 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
        >
          <Navigation className="size-5" aria-hidden="true" />
          {t('affectedArea.location.device.action')}
        </Button>

        <p
          id={hintId}
          className="flex max-w-md items-start gap-2 pt-1 text-xs leading-relaxed text-muted-foreground"
        >
          <Satellite
            className="mt-0.5 size-4 shrink-0 text-warning"
            aria-hidden="true"
          />
          {t('affectedArea.location.device.hint')}
        </p>
      </div>
    </div>
  )
}
