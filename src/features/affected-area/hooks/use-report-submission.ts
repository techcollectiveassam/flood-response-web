import { useCallback } from 'react'
import { getApiErrorKey } from '@/lib/api-error'
import type { TranslationKey } from '@/lib/i18n/catalog'
import { useCreateAffectedAreaReport } from '../api/create-affected-area-report'
import { useReportDraft } from '../contexts/report-draft-context'
import { hasResolvedLocation } from '../utils/location-method'

const MOBILE_PATTERN = /^\d{10}$/

export function useReportSubmission() {
  const { draft, resetDraft } = useReportDraft()
  const createReport = useCreateAffectedAreaReport()
  const resetMutation = createReport.reset

  const locationMissing = !hasResolvedLocation(draft.location)
  const severityMissing = !draft.situation.severity
  const mobile = draft.reporter.mobile ?? ''
  const mobileInvalid = mobile.length > 0 && !MOBILE_PATTERN.test(mobile)

  function submit() {
    if (
      locationMissing ||
      severityMissing ||
      mobileInvalid ||
      createReport.isPending
    ) {
      return
    }

    createReport.mutate(draft)
  }

  const reset = useCallback(() => {
    resetMutation()
    resetDraft()
  }, [resetDraft, resetMutation])

  const validationErrorKey: TranslationKey | null = locationMissing
    ? 'affectedArea.location.requiredError'
    : severityMissing
      ? 'affectedArea.situation.severity.requiredError'
      : null

  return {
    submit,
    isSubmitting: createReport.isPending,
    errorKey:
      validationErrorKey ??
      (createReport.error ? getApiErrorKey(createReport.error) : null),
    result: createReport.data,
    reset,
  }
}
