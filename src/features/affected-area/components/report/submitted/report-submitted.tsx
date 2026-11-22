import { CircleCheck, Copy, MapPinPlus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import type { CreateAffectedAreaResult } from '../../../api/create-affected-area-report'
import { ReportStatusTimeline } from './report-status-timeline'

type ReportSubmittedProps = {
  result: CreateAffectedAreaResult
  onDone: () => void
  onReportAnother: () => void
}

export function ReportSubmitted({
  result,
  onDone,
  onReportAnother,
}: ReportSubmittedProps) {
  const { t } = useTranslation()
  const headingRef = useRef<HTMLHeadingElement>(null)
  const [copied, setCopied] = useState(false)
  const refId = result.affected_area.ref_id

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(refId)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col">
      <section className="flex flex-col items-center text-center">
        <span className="relative flex size-20 items-center justify-center rounded-full bg-success-soft">
          <span
            className="absolute inset-2 rounded-full bg-success/10"
            aria-hidden="true"
          />
          <CircleCheck
            className="relative size-11 text-success"
            strokeWidth={2.5}
            aria-hidden="true"
          />
        </span>

        <h1
          ref={headingRef}
          tabIndex={-1}
          className="mt-4 text-2xl font-bold tracking-tight text-foreground focus:outline-none"
        >
          {t('affectedArea.submitted.title')}
        </h1>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {t('affectedArea.submitted.description')}
        </p>

        <div className="mt-4 flex w-full max-w-md flex-col items-center">
          <div className="flex w-full items-center gap-2 rounded-xl bg-muted px-3 py-2">
            <span className="shrink-0 text-xs text-muted-foreground">
              {t('affectedArea.submitted.reportIdLabel')}:
            </span>
            <span className="min-w-0 flex-1 break-all text-left font-mono text-[11px] font-semibold leading-snug text-foreground">
              {refId}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              aria-label={t('affectedArea.submitted.copyId', { id: refId })}
              className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              <Copy className="size-4" aria-hidden="true" />
            </button>
          </div>

          <p className="mt-1.5 text-center text-xs text-muted-foreground">
            {t('affectedArea.submitted.reportIdHint')}
          </p>
          <p
            role="status"
            className="mt-1 min-h-4 text-[10px] font-bold uppercase tracking-[0.08em] text-success-text"
          >
            {copied ? t('affectedArea.submitted.copied') : null}
          </p>
        </div>
      </section>

      <section className="mt-5 rounded-2xl border border-border-subtle bg-card p-5">
        <header className="flex items-center justify-between gap-2">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
            {t('affectedArea.submitted.statusTitle')}
          </h2>
          <span className="text-xs text-muted-foreground">
            {t('affectedArea.submitted.statusLive')}
          </span>
        </header>

        <ReportStatusTimeline
          verificationStatus={result.affected_area.verification_status}
          createdAt={result.report.created_at}
        />
      </section>

      <div className="mt-5 flex flex-col gap-3">
        <Button
          type="button"
          onClick={onDone}
          className="h-12 w-full rounded-xl bg-primary text-sm font-bold uppercase tracking-[0.08em] text-primary-foreground hover:bg-primary-hover"
        >
          {t('affectedArea.submitted.done')}
          <CircleCheck className="size-4" aria-hidden="true" />
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onReportAnother}
          className="h-12 w-full rounded-xl bg-card text-sm font-bold text-foreground hover:bg-muted"
        >
          <MapPinPlus
            className="size-4 text-muted-foreground"
            aria-hidden="true"
          />
          {t('affectedArea.submitted.reportAnother')}
        </Button>
      </div>

      <p className="mt-5 text-center text-xs text-muted-foreground">
        {t('affectedArea.submitted.footer')}
      </p>
    </div>
  )
}
