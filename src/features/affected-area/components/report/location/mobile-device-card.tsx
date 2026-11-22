import { Crosshair, Loader2, Navigation } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useDeviceGpsCapture } from '../../../hooks/use-device-gps-capture'
import { GPS_ERROR_KEYS } from '../../../utils/gps'
import { GpsLocationResult } from './gps-location-result'
import { OptionRadioIndicator } from '../shared/option-radio-indicator'

type MobileDeviceCardProps = {
  checked: boolean
  onSelect: () => void
}

export function MobileDeviceCard({
  checked,
  onSelect,
}: MobileDeviceCardProps) {
  const { t } = useTranslation()
  const { isLocating, error, requestGps, coordinates } =
    useDeviceGpsCapture()

  return (
    <div className="rounded-2xl border border-border-subtle bg-card p-4">
      <div className="flex items-center gap-3">
        <label className="flex min-h-11 min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-ring/50">
          <input
            type="radio"
            name="location-method"
            value="device"
            checked={checked}
            onChange={onSelect}
            aria-label={t('affectedArea.location.device.title')}
            className="sr-only"
          />
          <OptionRadioIndicator checked={checked} />
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
          onClick={requestGps}
          disabled={isLocating}
          aria-busy={isLocating}
          className="mt-2 h-12 w-full rounded-xl bg-primary px-4 text-base font-semibold text-primary-foreground hover:bg-primary-hover"
        >
          {isLocating ? (
            <Loader2
              className="size-5 motion-safe:animate-spin"
              aria-hidden="true"
            />
          ) : (
            <Navigation className="size-5" aria-hidden="true" />
          )}
          {isLocating
            ? t('affectedArea.location.gps.locating')
            : t('affectedArea.location.device.action')}
        </Button>

        {error && (
          <p
            role="alert"
            className="mt-2 text-xs font-semibold leading-relaxed text-destructive"
          >
            {t(GPS_ERROR_KEYS[error])}
          </p>
        )}

        {coordinates && (
          <GpsLocationResult
            coordinates={coordinates}
            variant="mobile"
          />
        )}
      </div>
    </div>
  )
}
