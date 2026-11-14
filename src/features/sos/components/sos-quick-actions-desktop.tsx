import { Check, HandHeart, TriangleAlert, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { TranslationKey } from '@/lib/i18n/catalog'
import { resolveLanguage } from '@/lib/i18n/config'
import type { LanguageCode } from '@/lib/i18n/config'
import { formatNumber } from '@/lib/i18n/formatters'
import { SosActionCard } from './sos-action-card'
import { SosMetricCard } from './sos-metric-card'
import { SosRegionalSituation } from './sos-regional-situation'
import { SosTriggerButton } from './sos-trigger-button'

type SosMetric = {
  id: string
  labelKey: TranslationKey
  value: number
  format?: 'number' | 'percent'
  suffix?: string
  unitKey?: TranslationKey
  hintKey: TranslationKey
  tone?: 'default' | 'info' | 'success'
  hintTone?: 'muted' | 'success'
}

// Placeholder values until the public situation API is connected.
const leftMetrics: SosMetric[] = [
  {
    id: 'activeOps',
    labelKey: 'home.metrics.activeOps.label',
    value: 84,
    unitKey: 'home.metrics.activeOps.unit',
    hintKey: 'home.metrics.activeOps.hint',
    hintTone: 'success',
  },
  {
    id: 'reliefDepots',
    labelKey: 'home.metrics.reliefDepots.label',
    value: 42,
    unitKey: 'home.metrics.reliefDepots.unit',
    hintKey: 'home.metrics.reliefDepots.hint',
  },
]

const rightMetrics: SosMetric[] = [
  {
    id: 'displacedCitizens',
    labelKey: 'home.metrics.displacedCitizens.label',
    value: 18420,
    suffix: '+',
    hintKey: 'home.metrics.displacedCitizens.hint',
    tone: 'info',
  },
  {
    id: 'responseVerification',
    labelKey: 'home.metrics.responseVerification.label',
    value: 0.68,
    format: 'percent',
    hintKey: 'home.metrics.responseVerification.hint',
    tone: 'success',
  },
]

const trustChipKeys = [
  'home.sos.chip.noAccount',
  'home.sos.chip.gps',
  'home.sos.chip.sms',
] as const satisfies readonly TranslationKey[]

function formatMetricValue(
  metric: SosMetric,
  language: LanguageCode,
): string {
  const formatted =
    metric.format === 'percent'
      ? formatNumber(metric.value, language, { style: 'percent' })
      : formatNumber(metric.value, language)

  return `${formatted}${metric.suffix ?? ''}`
}

function SosMetricList({ metrics }: { metrics: SosMetric[] }) {
  const { t, i18n } = useTranslation()
  const language = resolveLanguage(i18n.resolvedLanguage ?? i18n.language)

  return (
    <div className="space-y-4">
      {metrics.map((metric) => (
        <SosMetricCard
          key={metric.id}
          label={t(metric.labelKey)}
          value={formatMetricValue(metric, language)}
          unit={metric.unitKey ? t(metric.unitKey) : undefined}
          hint={t(metric.hintKey)}
          tone={metric.tone}
          hintTone={metric.hintTone}
        />
      ))}
    </div>
  )
}

export function SosQuickActionsDesktop() {
  const { t } = useTranslation()

  return (
    <div className="flex w-full flex-col gap-6">
      <section className="rounded-3xl border border-border-subtle bg-card p-8 xl:p-10">
        <header className="mx-auto max-w-3xl text-center">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-destructive/20 bg-destructive-soft px-3 py-1 text-xs font-bold uppercase tracking-wide text-destructive">
              <span
                className="size-2 rounded-full bg-destructive"
                aria-hidden="true"
              />
              {t('home.masthead.warning')}
            </span>

            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1">
              <span className="flex size-5 items-center justify-center rounded-full bg-destructive-soft text-destructive">
                <Zap className="size-3" aria-hidden="true" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t('home.masthead.rapidStatus')}
              </span>
              <span className="text-xs font-bold text-foreground">
                {t('home.masthead.responseLevel')}
              </span>
              <span className="text-border" aria-hidden="true">
                •
              </span>
              <span className="text-xs font-medium text-destructive">
                {t('home.masthead.basinAlert')}
              </span>
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground xl:text-4xl">
            {t('home.masthead.title')}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground xl:text-lg">
            {t('home.masthead.description')}
          </p>
        </header>

        <div className="mt-8 grid grid-cols-12 items-center gap-6">
          <div className="col-span-3">
            <SosMetricList metrics={leftMetrics} />
          </div>

          <div className="col-span-6 flex flex-col items-center px-2 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-destructive/20 bg-destructive-soft px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-destructive">
              <span
                className="size-2 rounded-full bg-destructive"
                aria-hidden="true"
              />
              {t('home.sos.overline')}
            </span>
            <h2 className="mt-2 text-xl font-bold text-foreground">
              {t('home.sos.title')}
            </h2>
            <p className="mt-1 max-w-xs text-xs text-muted-foreground">
              {t('home.sos.description')}
            </p>

            <div className="my-7">
              <SosTriggerButton variant="plain" size="hero" />
            </div>

            <p className="max-w-md text-xs font-medium leading-relaxed text-muted-foreground">
              {t('home.sos.support')}
            </p>

            <ul className="flex flex-wrap items-center justify-center gap-2 pt-3 text-[11px] font-semibold text-muted-foreground">
              {trustChipKeys.map((key) => (
                <li
                  key={key}
                  className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/50 px-2 py-0.5"
                >
                  <Check
                    className="size-3 text-success"
                    aria-hidden="true"
                  />
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-3">
            <SosMetricList metrics={rightMetrics} />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-6">
        <SosActionCard
          icon={TriangleAlert}
          title={t('home.action.reportArea.title')}
          description={t('home.action.reportArea.detail')}
          tag={t('home.action.reportArea.tag')}
          tone="warning"
        />
        <SosActionCard
          icon={HandHeart}
          title={t('home.action.requestRelief.cardTitle')}
          description={t('home.action.requestRelief.detail')}
          tag={t('home.action.requestRelief.tag')}
          tone="info"
        />
      </div>

      <SosRegionalSituation />
    </div>
  )
}
