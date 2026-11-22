import { useState } from 'react'
import { useReportDraft } from '../contexts/report-draft-context'

export function useSituationStep(onNext: () => void) {
  const { draft } = useReportDraft()
  const [showError, setShowError] = useState(false)

  function handleNext() {
    if (!draft.situation.severity) {
      setShowError(true)
      return
    }

    setShowError(false)
    onNext()
  }

  return { error: showError, handleNext }
}
