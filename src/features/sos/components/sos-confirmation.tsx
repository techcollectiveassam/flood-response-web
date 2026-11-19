import { CircleCheck, Copy, MapPin } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { useLanguage } from '@/hooks/use-language'
import { buildLocalizedPath } from '@/lib/i18n/locale-segment'
import type { Sos } from '../api/create-sos-request'

type SosConfirmationProps = {
  sos: Sos
  onReset: () => void
}

function formatCoordinate(
  value: number,
  positiveDirection: string,
  negativeDirection: string,
): string {
  const direction = value < 0 ? negativeDirection : positiveDirection
  return `${Math.abs(value).toFixed(4)}° ${direction}`
}

export function SosConfirmation({ sos, onReset }: SosConfirmationProps) {
  const { t } = useTranslation()
  const { language } = useLanguage()
  const headingRef = useRef<HTMLHeadingElement>(null)
  const [copied, setCopied] = useState(false)
  const coordinates =
    typeof sos.location?.latitude === 'number' &&
    typeof sos.location.longitude === 'number'
      ? {
          latitude: formatCoordinate(sos.location.latitude, 'N', 'S'),
          longitude: formatCoordinate(sos.location.longitude, 'E', 'W'),
        }
      : null

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(sos.tracking_id)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="w-full">
      <div className="flex flex-col items-center text-center">
        <span
          className="flex size-20 items-center justify-center rounded-full bg-success-soft"
          aria-hidden="true"
        >
          <CircleCheck className="size-12 text-success" strokeWidth={2.5} />
        </span>

        <h2
          ref={headingRef}
          tabIndex={-1}
          className="mt-4 text-2xl font-extrabold tracking-tight text-foreground focus:outline-none"
        >
          {t('sos.confirmation.title')}
        </h2>

        <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
          {sos.location
            ? t('sos.confirmation.descriptionLocation')
            : t('sos.confirmation.descriptionMobile')}
        </p>

        {coordinates && (
          <p className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            <MapPin className="size-3.5" aria-hidden="true" />
            {t('sos.confirmation.coordinates', coordinates)}
          </p>
        )}
      </div>

      <div className="mt-6 rounded-xl border border-border-subtle bg-muted/30 p-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
          {t('sos.confirmation.referenceLabel')}
        </p>
        <p className="mt-1 break-all font-mono text-sm font-semibold text-foreground">
          {sos.tracking_id}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {t('sos.confirmation.referenceHint')}
        </p>

        <button
          type="button"
          onClick={handleCopy}
          aria-label={t('sos.confirmation.copy')}
          className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-background px-3 text-xs font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <Copy className="size-4" aria-hidden="true" />
          {t('sos.confirmation.copy')}
          <span role="status" className="text-success">
            {copied ? t('sos.confirmation.copied') : null}
          </span>
        </button>
      </div>

      <div className="mt-3 flex items-start gap-3 rounded-xl border border-border-subtle bg-warning-soft/40 p-4">
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-warning-soft text-warning"
          aria-hidden="true"
        >
          <MapPin className="size-4" />
        </span>
        <div className="text-left">
          <p className="text-sm font-semibold text-foreground">
            {t('sos.confirmation.safetyTitle')}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {t('sos.confirmation.safetyDescription')}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <Link
          to={buildLocalizedPath(language, '/sos')}
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          {t('sos.confirmation.done')}
        </Link>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          {t('sos.confirmation.sendAnother')}
        </button>
      </div>
    </div>
  )
}
