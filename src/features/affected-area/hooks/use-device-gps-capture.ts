import { useCallback, useEffect, useRef } from 'react'
import { useReportDraft } from '../contexts/report-draft-context'
import { useGpsLocation } from './use-gps-location'

export function useDeviceGpsCapture() {
  const { draft, updateLocation } = useReportDraft()
  const { isLocating, error, request } = useGpsLocation()
  const methodVersion = useRef(0)
  const isMounted = useRef(true)

  useEffect(() => {
    methodVersion.current += 1
  }, [draft.location.method])

  useEffect(() => {
    isMounted.current = true

    return () => {
      isMounted.current = false
    }
  }, [])

  const requestGps = useCallback(() => {
    const requestedVersion = methodVersion.current

    request((coordinates) => {
      if (
        !isMounted.current ||
        methodVersion.current !== requestedVersion
      ) {
        return
      }

      updateLocation({
        method: 'device',
        coordinates,
      })
    })
  }, [request, updateLocation])

  return {
    isLocating,
    error,
    requestGps,
    coordinates: draft.location.coordinates,
  }
}
