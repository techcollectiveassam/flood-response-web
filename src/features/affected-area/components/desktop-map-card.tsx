import { Expand, Map, MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { DesktopMapPreview } from './desktop-map-preview'
import { OptionRadioIndicator } from './option-radio-indicator'

type DesktopMapCardProps = {
  checked: boolean
  onSelect: () => void
}

export function DesktopMapCard({ checked, onSelect }: DesktopMapCardProps) {
  const { t } = useTranslation()

  return (
    <div className="rounded-2xl border border-border-subtle bg-card p-5">
      <label className="flex min-w-0 cursor-pointer items-start gap-3 rounded-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-ring/50">
        <input
          type="radio"
          name="location-method"
          value="map"
          checked={checked}
          onChange={onSelect}
          aria-label={t('affectedArea.location.map.desktopTitle')}
          className="sr-only"
        />
        <OptionRadioIndicator checked={checked} />

        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <Map className="size-5" aria-hidden="true" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-lg font-bold leading-tight text-foreground">
            {t('affectedArea.location.map.desktopTitle')}
          </span>

          <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
            {t('affectedArea.location.map.desktopDescription')}
          </span>
        </span>
      </label>

      <div className="relative mt-4 ml-8 overflow-hidden rounded-xl border border-border-subtle">
        <DesktopMapPreview />

        <span className="absolute left-3 top-3 rounded bg-card/95 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.04em] text-foreground shadow-sm">
          {t('affectedArea.location.map.embankment')}
        </span>

        <MapPin
          className="absolute left-1/2 top-1/2 size-9 -translate-x-1/2 -translate-y-1/2 text-destructive drop-shadow-sm"
          fill="currentColor"
          stroke="white"
          strokeWidth={1.5}
          aria-hidden="true"
        />

        <button
          type="button"
          onClick={onSelect}
          className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-lg bg-card px-3 py-2 text-xs font-semibold text-foreground shadow-md transition-colors hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <Expand className="size-4" aria-hidden="true" />
          {t('affectedArea.location.map.expand')}
        </button>
      </div>
    </div>
  )
}
