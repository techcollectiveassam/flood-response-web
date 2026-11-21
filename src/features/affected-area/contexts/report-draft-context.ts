import { createContext, useContext } from 'react'
import type { ReportDraft } from '../types/report-draft'

export type ReportDraftContextValue = {
  draft: ReportDraft
  updateLocation: (patch: Partial<ReportDraft['location']>) => void
  updateSituation: (patch: Partial<ReportDraft['situation']>) => void
  updateReporter: (patch: Partial<ReportDraft['reporter']>) => void
  resetDraft: () => void
}

export const ReportDraftContext =
  createContext<ReportDraftContextValue | null>(null)

export function useReportDraft(): ReportDraftContextValue {
  const context = useContext(ReportDraftContext)

  if (context === null) {
    throw new Error(
      'useReportDraft must be used within a ReportDraftProvider',
    )
  }

  return context
}
