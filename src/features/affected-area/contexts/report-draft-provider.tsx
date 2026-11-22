import { useCallback, useMemo, useReducer } from 'react'
import type { ReactNode } from 'react'
import {
  createEmptyReportDraft,
  type ReportDraft,
} from '../types/report-draft'
import { ReportDraftContext } from './report-draft-context'

type ReportDraftAction =
  | {
      type: 'updateLocation'
      patch: Partial<ReportDraft['location']>
    }
  | {
      type: 'updateSituation'
      patch: Partial<ReportDraft['situation']>
    }
  | {
      type: 'updateReporter'
      patch: Partial<ReportDraft['reporter']>
    }
  | { type: 'reset' }

function reportDraftReducer(
  state: ReportDraft,
  action: ReportDraftAction,
): ReportDraft {
  switch (action.type) {
    case 'updateLocation':
      return {
        ...state,
        location: { ...state.location, ...action.patch },
      }
    case 'updateSituation':
      return {
        ...state,
        situation: { ...state.situation, ...action.patch },
      }
    case 'updateReporter':
      return {
        ...state,
        reporter: { ...state.reporter, ...action.patch },
      }
    case 'reset':
      return createEmptyReportDraft()
    default:
      return state
  }
}

type ReportDraftProviderProps = {
  children: ReactNode
}

export function ReportDraftProvider({ children }: ReportDraftProviderProps) {
  const [draft, dispatch] = useReducer(
    reportDraftReducer,
    undefined,
    createEmptyReportDraft,
  )

  const updateLocation = useCallback(
    (patch: Partial<ReportDraft['location']>) => {
      dispatch({ type: 'updateLocation', patch })
    },
    [],
  )

  const updateSituation = useCallback(
    (patch: Partial<ReportDraft['situation']>) => {
      dispatch({ type: 'updateSituation', patch })
    },
    [],
  )

  const updateReporter = useCallback(
    (patch: Partial<ReportDraft['reporter']>) => {
      dispatch({ type: 'updateReporter', patch })
    },
    [],
  )

  const resetDraft = useCallback(() => {
    dispatch({ type: 'reset' })
  }, [])

  const value = useMemo(
    () => ({
      draft,
      updateLocation,
      updateSituation,
      updateReporter,
      resetDraft,
    }),
    [
      draft,
      resetDraft,
      updateLocation,
      updateReporter,
      updateSituation,
    ],
  )

  return (
    <ReportDraftContext.Provider value={value}>
      {children}
    </ReportDraftContext.Provider>
  )
}
