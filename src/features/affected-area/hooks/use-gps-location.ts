import { useCallback, useState } from 'react'
import type { GpsCoordinates, GpsErrorCode } from '../utils/gps'

type GpsStatus = 'idle' | 'locating'

export function useGpsLocation() {
  const [status, setStatus] = useState<GpsStatus>('idle')
  const [error, setError] = useState<GpsErrorCode | null>(null)

  const request = useCallback(
    (onSuccess: (coordinates: GpsCoordinates) => void) => {
      if (
        typeof navigator === 'undefined' ||
        !('geolocation' in navigator)
      ) {
        setError('unsupported')
        return
      }

      setError(null)
      setStatus('locating')

      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const coordinates: GpsCoordinates = {
            latitude: coords.latitude,
            longitude: coords.longitude,
          }

          if (Number.isFinite(coords.accuracy)) {
            coordinates.accuracy = coords.accuracy
          }

          onSuccess(coordinates)
          setStatus('idle')
        },
        (positionError) => {
          setStatus('idle')
          setError(
            positionError.code === 1
              ? 'denied'
              : positionError.code === 3
                ? 'timeout'
                : 'unavailable',
          )
        },
        {
          enableHighAccuracy: true,
          timeout: 10_000,
          maximumAge: 0,
        },
      )
    },
    [],
  )

  return {
    isLocating: status === 'locating',
    error,
    request,
  }
}
