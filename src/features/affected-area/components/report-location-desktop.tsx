import { Check } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  DEFAULT_LOCATION_METHOD,
  type LocationMethod,
} from '../utils/location-method'
import { DesktopDeviceCard } from './desktop-device-card'
import { DesktopLocationFooter } from './desktop-location-footer'
import { DesktopMapCard } from './desktop-map-card'
import { DesktopSearchCard } from './desktop-search-card'

type ReportLocationDesktopProps = {
  onNext: () => void
}

export function ReportLocationDesktop({ onNext }: ReportLocationDesktopProps) {
  const { t } = useTranslation()
  const [method, setMethod] = useState<LocationMethod>(DEFAULT_LOCATION_METHOD)

  return (
    <>
      <section className="rounded-2xl border border-border-subtle bg-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {t('affectedArea.location.title')}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {t('affectedArea.location.description')}
            </p>
          </div>

          <p className="inline-flex max-w-md items-center gap-1.5 rounded-full bg-success-soft px-3 py-1.5 text-[10px] font-bold uppercase leading-tight tracking-[0.08em] text-success-text">
            <Check className="size-3.5 shrink-0" aria-hidden="true" />
            <span>{t('affectedArea.location.requiredBadge')}</span>
            <span aria-hidden="true">•</span>
            <span>{t('affectedArea.location.requiredHint')}</span>
          </p>
        </div>
      </section>

      <fieldset className="min-w-0 space-y-4">
        <legend className="sr-only">
          {t('affectedArea.location.methodLegend')}
        </legend>
        <DesktopDeviceCard
          checked={method === 'device'}
          onSelect={() => setMethod('device')}
        />
        <DesktopSearchCard
          checked={method === 'search'}
          onSelect={() => setMethod('search')}
        />
        <DesktopMapCard
          checked={method === 'map'}
          onSelect={() => setMethod('map')}
        />
      </fieldset>

      <DesktopLocationFooter onNext={onNext} />
    </>
  )
}
