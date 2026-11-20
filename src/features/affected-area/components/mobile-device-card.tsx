import { Crosshair, Navigation, Satellite } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { LocationRadioIndicator } from './location-radio-indicator'

export function MobileDeviceCard() {
  const { t } = useTranslation()
  const hintId = useId()

  return (
    <div className="rounded-2xl border border-border-subtle bg-card p-4">
      <div className="flex items-center gap-3">
        <label className="flex min-h-11 min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-ring/50">
          <input
            type="radio"
            name="location-method"
            value="device"
            defaultChecked
            aria-label={t('affectedArea.location.device.title')}
            className="sr-only"
          />
          <LocationRadioIndicator checked />
          <span className="text-lg font-bold leading-tight text-foreground">
            {t('affectedArea.location.device.title')}
          </span>
        </label>

        <Crosshair className="size-5 shrink-0 text-primary" aria-hidden="true" />
      </div>

      <div className="mt-2 pl-8">
        <p className="text-sm font-semibold text-foreground">
          {t('affectedArea.location.device.gpsLabel')}
        </p>

        <Button
          type="button"
          aria-describedby={hintId}
          className="mt-2 h-12 w-full rounded-xl bg-primary px-4 text-base font-semibold text-primary-foreground hover:bg-primary-hover"
        >
          <Navigation className="size-5" aria-hidden="true" />
          {t('affectedArea.location.device.action')}
        </Button>

        <p
          id={hintId}
          className="mt-2.5 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"
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
