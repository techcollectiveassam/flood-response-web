import { CircleCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { resolveLanguage } from '@/lib/i18n/config'
import {
  formatGpsAccuracy,
  formatGpsCoordinates,
} from '../../../utils/gps'
import type { GpsCoordinates } from '../../../utils/gps'

type GpsLocationResultProps = {
  coordinates: GpsCoordinates
  variant: 'mobile' | 'desktop'
}

export function GpsLocationResult({
  coordinates,
  variant,
}: GpsLocationResultProps) {
  const { t, i18n } = useTranslation()
  const language = resolveLanguage(i18n.resolvedLanguage ?? i18n.language)
  const formattedCoordinates = formatGpsCoordinates(coordinates, language)
  const accuracy =
    coordinates.accuracy === undefined
      ? null
      : `${t('affectedArea.location.gps.accuracy')}: ${formatGpsAccuracy(
          coordinates.accuracy,
          language,
        )}`

  if (variant === 'mobile') {
    return (
      <div className="mt-3 rounded-xl border border-success/20 bg-success-soft/60 p-3">
        <p className="flex items-center gap-2 text-sm font-semibold text-success-text">
          <CircleCheck className="size-4" aria-hidden="true" />
          {t('affectedArea.location.gps.success')}
        </p>
        <p className="mt-1 text-xs text-foreground">{formattedCoordinates}</p>
        {accuracy && (
          <p className="mt-1 text-xs text-muted-foreground">{accuracy}</p>
        )}
      </div>
    )
  }

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-muted/40 px-4 py-3">
      <p className="flex flex-wrap items-center gap-2 text-sm text-foreground">
        <CircleCheck className="size-4 text-success" aria-hidden="true" />
        <span className="font-semibold">
          {t('affectedArea.location.gps.success')}:
        </span>
        <span>{formattedCoordinates}</span>
      </p>
      {accuracy && (
        <span className="rounded-full bg-success-soft px-2 py-1 text-[10px] font-bold uppercase tracking-[0.05em] text-success-text">
          {accuracy}
        </span>
      )}
    </div>
  )
}
