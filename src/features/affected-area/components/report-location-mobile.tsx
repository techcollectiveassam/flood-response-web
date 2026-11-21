import { Check, MapPin, MapPinSearch } from 'lucide-react'
import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useReportDraft } from '../contexts/report-draft-context'
import { hasResolvedLocation } from '../utils/location-method'
import { MobileDeviceCard } from './mobile-device-card'
import { MobileLocationFooter } from './mobile-location-footer'
import { MobileLocationMethodCard } from './mobile-location-method-card'

type ReportLocationMobileProps = {
  onNext: () => void
}

export function ReportLocationMobile({ onNext }: ReportLocationMobileProps) {
  const { t } = useTranslation()
  const { draft, updateLocation } = useReportDraft()
  const [showLocationError, setShowLocationError] = useState(false)
  const locationErrorId = useId()
  const method = draft.location.method
  const hasLocation = hasResolvedLocation(draft.location)
  const locationError = showLocationError && !hasLocation

  function handleNext() {
    if (!hasLocation) {
      setShowLocationError(true)
      return
    }

    setShowLocationError(false)
    onNext()
  }

  return (
    <>
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

      <fieldset
        aria-describedby={locationError ? locationErrorId : undefined}
        className="mt-4 min-w-0 space-y-3"
      >
        <legend className="sr-only">
          {t('affectedArea.location.methodLegend')}
        </legend>
        <MobileDeviceCard
          checked={method === 'device'}
          onSelect={() => updateLocation({ method: 'device' })}
        />
        <MobileLocationMethodCard
          value="search"
          icon={MapPinSearch}
          titleKey="affectedArea.location.search.title"
          descriptionKey="affectedArea.location.search.description"
          checked={method === 'search'}
          onSelect={() => updateLocation({ method: 'search' })}
          available={false}
        />
        <MobileLocationMethodCard
          value="map"
          icon={MapPin}
          titleKey="affectedArea.location.map.title"
          descriptionKey="affectedArea.location.map.description"
          checked={method === 'map'}
          onSelect={() => updateLocation({ method: 'map' })}
          available={false}
        />
      </fieldset>

      {locationError && (
        <p
          id={locationErrorId}
          role="alert"
          className="mt-3 text-xs font-semibold text-destructive"
        >
          {t('affectedArea.location.requiredError')}
        </p>
      )}

      <MobileLocationFooter onNext={handleNext} />
    </>
  )
}
