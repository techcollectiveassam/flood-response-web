import {
  CircleCheck,
  CircleDot,
  LifeBuoy,
  ShieldCheck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/hooks/use-language'
import type { TranslationKey } from '@/lib/i18n/catalog'
import { formatDate } from '@/lib/i18n/formatters'
import { cn } from '@/lib/utils'
import type { CreateAffectedAreaResult } from '../../../api/create-affected-area-report'

type VerificationStatus =
  CreateAffectedAreaResult['affected_area']['verification_status']

type TimelineState = 'complete' | 'current' | 'pending'

type TimelineStep = {
  key: string
  titleKey: TranslationKey
  description: string
  state: TimelineState
  icon: LucideIcon
}

type ReportStatusTimelineProps = {
  verificationStatus: VerificationStatus
  createdAt: string
}

const nodeClasses: Record<TimelineState, string> = {
  complete: 'bg-success text-success-foreground',
  current: 'bg-primary text-primary-foreground',
  pending: 'border-2 border-border bg-background text-status-pending',
}

const titleClasses: Record<TimelineState, string> = {
  complete: 'text-foreground',
  current: 'text-primary',
  pending: 'text-muted-foreground',
}

export function ReportStatusTimeline({
  verificationStatus,
  createdAt,
}: ReportStatusTimelineProps) {
  const { t } = useTranslation()
  const { language } = useLanguage()
  const isVerified =
    verificationStatus === 'verified' || verificationStatus === 'resolved'
  const isResolved = verificationStatus === 'resolved'
  const time = formatDate(createdAt, language, {
    hour: '2-digit',
    minute: '2-digit',
  })

  const steps: TimelineStep[] = [
    {
      key: 'submitted',
      titleKey: 'affectedArea.submitted.statusSubmitted',
      description: t('affectedArea.submitted.statusSubmittedMeta', { time }),
      state: 'complete',
      icon: CircleCheck,
    },
    {
      key: 'verifying',
      titleKey: 'affectedArea.submitted.statusVerifying',
      description: t('affectedArea.submitted.statusVerifyingDescription'),
      state: isVerified ? 'complete' : 'current',
      icon: CircleDot,
    },
    {
      key: 'verified',
      titleKey: 'affectedArea.submitted.statusVerified',
      description: t('affectedArea.submitted.statusVerifiedDescription'),
      state: isVerified ? 'complete' : 'pending',
      icon: ShieldCheck,
    },
    {
      key: 'action',
      titleKey: 'affectedArea.submitted.statusAction',
      description: t('affectedArea.submitted.statusActionDescription'),
      state: isResolved ? 'complete' : 'pending',
      icon: LifeBuoy,
    },
  ]

  return (
    <ol className="mt-4">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1
        const Icon = step.icon

        return (
          <li
            key={step.key}
            className="relative flex gap-3 pb-5 last:pb-0"
          >
            {!isLast && (
              <span
                aria-hidden="true"
                className={cn(
                  'absolute bottom-0 left-4 top-8 w-[3px] -translate-x-1/2',
                  step.state === 'complete' ? 'bg-success' : 'bg-border',
                )}
              />
            )}

            <span
              className={cn(
                'relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full',
                nodeClasses[step.state],
              )}
            >
              <Icon
                className={cn(
                  'size-4',
                  step.state === 'current' && 'motion-safe:animate-pulse',
                )}
                aria-hidden="true"
              />
            </span>

            <div className="min-w-0 pt-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    'text-base font-bold',
                    titleClasses[step.state],
                  )}
                >
                  {t(step.titleKey)}
                </span>

                {step.state === 'current' && (
                  <span className="rounded-full bg-primary-soft px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.06em] text-primary">
                    {t('affectedArea.submitted.statusInProgress')}
                  </span>
                )}

                {step.state === 'pending' && (
                  <span className="text-xs text-muted-foreground">
                    {t('affectedArea.submitted.statusPending')}
                  </span>
                )}
              </div>

              <p
                className={cn(
                  'mt-0.5 text-xs leading-snug text-muted-foreground',
                  step.state === 'current' && 'italic',
                )}
              >
                {step.description}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
