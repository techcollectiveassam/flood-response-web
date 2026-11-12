import { useId } from 'react'
import { ChevronRight, Map } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { TranslationKey } from '@/lib/i18n/catalog'
import { resolveLanguage } from '@/lib/i18n/config'
import type { LanguageCode } from '@/lib/i18n/config'
import { formatNumber } from '@/lib/i18n/formatters'
import { cn } from '@/lib/utils'

type DistrictTone = 'critical' | 'warning' | 'success'

type DistrictSituation = {
  id: string
  nameKey: TranslationKey
  descriptionKey: TranslationKey
  statusKey: TranslationKey
  tone: DistrictTone
  rationDepots: number
  waterLevel: number
}

// Placeholder values until the public situation API is connected.
const districtSituations: DistrictSituation[] = [
  {
    id: 'majuli',
    nameKey: 'home.situation.district.majuli.name',
    descriptionKey: 'home.situation.district.majuli.description',
    statusKey: 'home.situation.status.critical',
    tone: 'critical',
    rationDepots: 4,
    waterLevel: 1.8,
  },
  {
    id: 'barpeta',
    nameKey: 'home.situation.district.barpeta.name',
    descriptionKey: 'home.situation.district.barpeta.description',
    statusKey: 'home.situation.status.severe',
    tone: 'warning',
    rationDepots: 9,
    waterLevel: 0.9,
  },
  {
    id: 'dhubri',
    nameKey: 'home.situation.district.dhubri.name',
    descriptionKey: 'home.situation.district.dhubri.description',
    statusKey: 'home.situation.status.surge',
    tone: 'warning',
    rationDepots: 12,
    waterLevel: 1.2,
  },
  {
    id: 'darrang',
    nameKey: 'home.situation.district.darrang.name',
    descriptionKey: 'home.situation.district.darrang.description',
    statusKey: 'home.situation.status.stable',
    tone: 'success',
    rationDepots: 6,
    waterLevel: -0.4,
  },
]

const toneClasses: Record<
  DistrictTone,
  {
    card: string
    name: string
    status: string
    divider: string
    water: string
  }
> = {
  critical: {
    card: 'border-destructive/25 bg-destructive-soft/40 hover:border-destructive/60',
    name: 'group-hover:text-destructive',
    status: 'border-destructive/25 bg-destructive-soft text-destructive',
    divider: 'border-destructive/15',
    water: 'bg-destructive-soft/60 text-destructive',
  },
  warning: {
    card: 'border-warning/25 bg-warning-soft/40 hover:border-warning/60',
    name: 'group-hover:text-warning',
    status: 'border-warning/25 bg-warning-soft text-warning',
    divider: 'border-warning/15',
    water: 'bg-warning-soft/60 text-warning',
  },
  success: {
    card: 'border-success/25 bg-success-soft/40 hover:border-success/60',
    name: 'group-hover:text-success-text',
    status: 'border-success/25 bg-success-soft text-success-text',
    divider: 'border-success/15',
    water: 'bg-success-soft/60 text-success-text',
  },
}

function formatWaterLevel(level: number, language: LanguageCode): string {
  return formatNumber(level, language, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    signDisplay: 'always',
  })
}

function SosDistrictCard({ district }: { district: DistrictSituation }) {
  const { t, i18n } = useTranslation()
  const language = resolveLanguage(i18n.resolvedLanguage ?? i18n.language)
  const classes = toneClasses[district.tone]
  const name = t(district.nameKey)

  return (
    <a
      href="#"
      title={t('home.situation.viewOnMap', { district: name })}
      className={cn(
        'group block h-full space-y-2.5 rounded-xl border p-4 transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
        classes.card,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            'flex items-center gap-1 text-xs font-bold text-foreground transition-colors',
            classes.name,
          )}
        >
          {name}
          <ChevronRight
            className="size-3 opacity-0 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          />
        </span>
        <span
          className={cn(
            'shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold',
            classes.status,
          )}
        >
          {t(district.statusKey)}
        </span>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {t(district.descriptionKey)}
      </p>

      <div
        className={cn(
          'flex items-center justify-between gap-2 border-t pt-2 text-[11px] font-semibold',
          classes.divider,
        )}
      >
        <span className="text-foreground/80">
          {t('home.situation.rationDepots')}:{' '}
          <strong className="font-bold text-foreground">
            {formatNumber(district.rationDepots, language)}
          </strong>
        </span>
        <span className={cn('rounded px-1.5 py-0.5 font-bold', classes.water)}>
          {t('home.situation.water')}:{' '}
          {formatWaterLevel(district.waterLevel, language)}
          {t('home.situation.waterUnit')}
        </span>
      </div>
    </a>
  )
}

export function SosRegionalSituation() {
  const { t } = useTranslation()
  const titleId = useId()

  return (
    <section
      aria-labelledby={titleId}
      className="rounded-2xl border border-border-subtle bg-card p-6 xl:p-7"
    >
      <div className="flex flex-col gap-4 border-b border-border-subtle pb-6 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="relative flex size-3" aria-hidden="true">
              <span className="absolute inline-flex size-full rounded-full bg-primary/40 motion-safe:animate-ping" />
              <span className="relative inline-flex size-3 rounded-full bg-primary" />
            </span>
            <h2 id={titleId} className="text-xl font-bold text-foreground">
              {t('home.situation.title')}
            </h2>
            <span className="inline-flex items-center rounded-full border border-info/25 bg-info-soft px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-info">
              {t('home.situation.live')}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {t('home.situation.description')}
          </p>
        </div>
      </div>

      <div className="pt-5">
        <a
          href="#"
          className="group flex w-full flex-col items-center justify-center gap-4 rounded-2xl border border-primary-hover/50 bg-primary px-6 py-6 text-primary-foreground shadow-sm transition-all hover:bg-primary-hover hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 md:flex-row"
        >
          <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary-foreground/10 transition-transform group-hover:scale-105">
            <Map className="size-7" aria-hidden="true" />
          </span>

          <span className="flex flex-col items-center text-center">
            <span className="flex flex-wrap items-center justify-center gap-2.5">
              <span className="text-xl font-extrabold tracking-tight md:text-2xl">
                {t('home.situation.map.title')}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success px-2.5 py-0.5 text-xs font-black uppercase tracking-wider text-primary-foreground shadow-sm">
                <span
                  className="size-2 rounded-full bg-primary-foreground motion-safe:animate-ping"
                  aria-hidden="true"
                />
                {t('home.situation.map.live')}
              </span>
            </span>
            <span className="mt-1.5 text-sm font-medium text-primary-foreground/85">
              {t('home.situation.map.subtitle')}
            </span>
          </span>
        </a>
      </div>

      <ul className="grid grid-cols-4 gap-4 pt-6">
        {districtSituations.map((district) => (
          <li key={district.id}>
            <SosDistrictCard district={district} />
          </li>
        ))}
      </ul>
    </section>
  )
}
