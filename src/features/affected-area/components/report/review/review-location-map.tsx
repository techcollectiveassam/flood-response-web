import { MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { TranslationKey } from '@/lib/i18n/catalog'
import type { LocationMethod } from '../../../utils/location-method'
import { MapPreview } from '../shared/map-preview'

type ReviewLocationMapProps = {
  method: LocationMethod
}

const badgeKeys: Record<LocationMethod, TranslationKey> = {
  device: 'affectedArea.location.device.gpsLabel',
  search: 'affectedArea.review.badgeSearch',
  map: 'affectedArea.review.badgeMap',
}

export function ReviewLocationMap({ method }: ReviewLocationMapProps) {
  const { t } = useTranslation()

  return (
    <div className="relative overflow-hidden rounded-xl border border-border-subtle">
      <MapPreview className="h-32" />

      <span className="absolute right-3 top-3 rounded bg-foreground/80 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.05em] text-background">
        {t(badgeKeys[method])}
      </span>

      <MapPin
        className="absolute left-1/2 top-1/2 size-8 -translate-x-1/2 -translate-y-1/2 text-destructive drop-shadow-sm"
        fill="currentColor"
        stroke="white"
        strokeWidth={1.5}
        aria-hidden="true"
      />
    </div>
  )
}
