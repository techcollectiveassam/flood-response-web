import {
  Camera,
  ClipboardList,
  ImageOff,
  MapPin,
  Pencil,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { TranslationKey } from '@/lib/i18n/catalog'
import { useReportDraft } from '../contexts/report-draft-context'
import type { ReportSeverity } from '../types/report-draft'
import { ReviewLocationMap } from './review-location-map'

type ReviewSummaryProps = {
  onEditLocation: () => void
  onEditSituation: () => void
  onEditPhotos: () => void
}

const severityTitleKeys: Record<ReportSeverity, TranslationKey> = {
  critical: 'affectedArea.situation.severity.critical.title',
  urgent: 'affectedArea.situation.severity.urgent.title',
  moderate: 'affectedArea.situation.severity.moderate.title',
  unknown: 'affectedArea.situation.severity.unknown.title',
}

type ReviewEditButtonProps = {
  label: string
  onClick: () => void
}

function ReviewEditButton({ label, onClick }: ReviewEditButtonProps) {
  const { t } = useTranslation()

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex min-h-11 items-center gap-1 rounded-lg px-2 text-sm font-medium text-primary transition-colors hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
    >
      <Pencil className="size-3.5" aria-hidden="true" />
      {t('affectedArea.review.edit')}
    </button>
  )
}

export function ReviewSummary({
  onEditLocation,
  onEditSituation,
  onEditPhotos,
}: ReviewSummaryProps) {
  const { t } = useTranslation()
  const { draft } = useReportDraft()
  const { method, query } = draft.location
  const trimmedQuery = query?.trim() ?? ''
  const severity = draft.situation.severity
  const details = draft.situation.details?.trim()

  const locationTitle = trimmedQuery
    ? trimmedQuery
    : method === 'device'
      ? t('affectedArea.review.deviceLocation')
      : method === 'map'
        ? t('affectedArea.review.mapLocation')
        : t('affectedArea.review.searchLocation')

  const locationSubtitle = trimmedQuery
    ? t('affectedArea.review.searchLocation')
    : method === 'search'
      ? t('affectedArea.review.noPlace')
      : t('affectedArea.review.locationPending')

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-border-subtle bg-card p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <MapPin
              className="size-5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <h2 className="text-lg font-bold text-foreground">
              {t('affectedArea.step.location')}
            </h2>
          </div>
          <ReviewEditButton
            label={`${t('affectedArea.review.edit')} ${t('affectedArea.step.location')}`}
            onClick={onEditLocation}
          />
        </div>

        <div className="mt-3">
          <ReviewLocationMap method={method} />
        </div>

        <p className="mt-3 text-base font-semibold text-foreground">
          {locationTitle}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {locationSubtitle}
        </p>
      </section>

      <section className="rounded-2xl border border-border-subtle bg-card p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <ClipboardList
              className="size-5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <h2 className="text-lg font-bold text-foreground">
              {t('affectedArea.step.situation')}
            </h2>
          </div>
          <ReviewEditButton
            label={`${t('affectedArea.review.edit')} ${t('affectedArea.step.situation')}`}
            onClick={onEditSituation}
          />
        </div>

        <div className="mt-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
            {t('affectedArea.review.severityLabel')}
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {severity
              ? t(severityTitleKeys[severity])
              : t('affectedArea.review.notProvided')}
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
            {details || t('affectedArea.review.noDetails')}
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-border-subtle bg-card p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <Camera
              className="size-5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <h2 className="text-lg font-bold text-foreground">
              {t('affectedArea.step.photos')}
            </h2>
          </div>
          <ReviewEditButton
            label={`${t('affectedArea.review.edit')} ${t('affectedArea.step.photos')}`}
            onClick={onEditPhotos}
          />
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-xl bg-muted/50 p-3 text-sm text-muted-foreground">
          <ImageOff className="size-4 shrink-0" aria-hidden="true" />
          <span>{t('affectedArea.review.noPhotos')}</span>
        </div>
      </section>
    </div>
  )
}
