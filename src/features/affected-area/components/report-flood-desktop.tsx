import { Check } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { useLanguage } from '@/hooks/use-language'
import { formatNumber } from '@/lib/i18n/formatters'
import { buildLocalizedPath } from '@/lib/i18n/locale-segment'
import {
  DEFAULT_LOCATION_METHOD,
  type LocationMethod,
} from '../utils/location-method'
import { DesktopDeviceCard } from './desktop-device-card'
import { DesktopLocationFooter } from './desktop-location-footer'
import { DesktopMapCard } from './desktop-map-card'
import { DesktopReportProgress } from './desktop-report-progress'
import { DesktopSearchCard } from './desktop-search-card'

export function ReportFloodDesktop() {
  const { t } = useTranslation()
  const { language } = useLanguage()
  const [method, setMethod] = useState<LocationMethod>(DEFAULT_LOCATION_METHOD)

  return (
    <div className="mx-auto flex w-full flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav aria-label={t('affectedArea.breadcrumb.label')}>
          <ol className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <li>
              <Link
                to={buildLocalizedPath(language, '/')}
                className="rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                {t('affectedArea.breadcrumb.home')}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>{t('affectedArea.breadcrumb.citizenServices')}</li>
            <li aria-hidden="true">/</li>
            <li>
              <span aria-current="page" className="font-medium text-foreground">
                {t('affectedArea.breadcrumb.reportFloodedArea')}
              </span>
            </li>
          </ol>
        </nav>

        <span className="rounded-full border border-warning/30 bg-warning-soft px-3 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-warning-foreground">
          {t('affectedArea.progress.step', {
            number: formatNumber(1, language),
          })}
        </span>
      </div>

      <DesktopReportProgress currentStep={1} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="flex min-w-0 flex-col gap-5">
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

          <DesktopLocationFooter />
        </div>
      </div>
    </div>
  )
}
