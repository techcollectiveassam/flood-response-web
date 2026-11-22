import { useId, useState } from 'react'
import { useReportDraft } from '../contexts/report-draft-context'
import { hasResolvedLocation } from '../utils/location-method'

export function useLocationStep(onNext: () => void) {
  const { draft } = useReportDraft()
  const [showError, setShowError] = useState(false)
  const errorId = useId()
  const hasLocation = hasResolvedLocation(draft.location)
  const error = showError && !hasLocation

  function handleNext() {
    if (!hasLocation) {
      setShowError(true)
      return
    }

    setShowError(false)
    onNext()
  }

  return { error, errorId, handleNext }
}
