import { Mic } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { normalizeDigits } from '@/lib/normalize-digits'
import { useReportDraft } from '../contexts/report-draft-context'

export function DetailsField() {
  const { t } = useTranslation()
  const { draft, updateSituation } = useReportDraft()
  const headingId = useId()

  return (
    <section aria-labelledby={headingId}>
      <h2
        id={headingId}
        className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground"
      >
        {t('affectedArea.situation.details.label')}
      </h2>

      <div className="relative mt-3">
        <textarea
          aria-labelledby={headingId}
          value={draft.situation.details ?? ''}
          onChange={(event) =>
            updateSituation({
              details: normalizeDigits(event.target.value),
            })
          }
          maxLength={2000}
          rows={4}
          placeholder={t('affectedArea.situation.details.placeholder')}
          className="min-h-32 w-full resize-y rounded-2xl border border-border-subtle bg-card p-4 pb-14 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        />

        <button
          type="button"
          aria-label={t('affectedArea.situation.details.voice')}
          className="absolute bottom-3 right-3 flex size-10 items-center justify-center rounded-lg bg-primary-soft text-primary transition-colors hover:bg-primary-soft/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <Mic className="size-4" aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}
