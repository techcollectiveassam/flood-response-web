import { Check, MapPin, MapPinSearch } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  DEFAULT_LOCATION_METHOD,
  type LocationMethod,
} from '../utils/location-method'
import { MobileDeviceCard } from './mobile-device-card'
import { MobileLocationMethodCard } from './mobile-location-method-card'
import { MobileReportProgress } from './mobile-report-progress'

export function ReportFloodMobile() {
  const { t } = useTranslation()
  const [method, setMethod] = useState<LocationMethod>(DEFAULT_LOCATION_METHOD)

  return (
    <div className="mx-auto w-full max-w-md">
      <MobileReportProgress currentStep={1} />

      <header className="mt-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {t('affectedArea.location.title')}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {t('affectedArea.location.description')}
        </p>
      </header>

      <div className="mt-5 flex flex-wrap items-start gap-3">
        <p className="inline-flex max-w-48 items-center gap-1.5 rounded-full bg-success-soft px-3 py-1.5 text-[10px] font-bold uppercase leading-tight tracking-[0.08em] text-success-text">
          <Check className="size-3.5 shrink-0" aria-hidden="true" />
          {t('affectedArea.location.requiredBadge')}
        </p>
        <p className="max-w-40 pt-0.5 text-xs leading-snug text-muted-foreground">
          {t('affectedArea.location.requiredHint')}
        </p>
      </div>

      <fieldset className="mt-4 min-w-0 space-y-3">
        <legend className="sr-only">
          {t('affectedArea.location.methodLegend')}
        </legend>
        <MobileDeviceCard
          checked={method === 'device'}
          onSelect={() => setMethod('device')}
        />
        <MobileLocationMethodCard
          value="search"
          icon={MapPinSearch}
          titleKey="affectedArea.location.search.title"
          descriptionKey="affectedArea.location.search.description"
          checked={method === 'search'}
          onSelect={() => setMethod('search')}
        />
        <MobileLocationMethodCard
          value="map"
          icon={MapPin}
          titleKey="affectedArea.location.map.title"
          descriptionKey="affectedArea.location.map.description"
          checked={method === 'map'}
          onSelect={() => setMethod('map')}
        />
      </fieldset>
    </div>
  )
}
