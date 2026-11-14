import { useEffect, useState } from 'react'

export type GeolocationPermissionState = PermissionState | 'unknown'

export function useGeolocationPermission(): GeolocationPermissionState {
  const [permission, setPermission] =
    useState<GeolocationPermissionState>('unknown')

  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.permissions) {
      return
    }

    let cancelled = false
    let status: PermissionStatus | null = null

    const handleChange = () => {
      if (status) {
        setPermission(status.state)
      }
    }

    navigator.permissions
      .query({ name: 'geolocation' })
      .then((nextStatus) => {
        if (cancelled) {
          return
        }

        status = nextStatus
        setPermission(nextStatus.state)
        nextStatus.addEventListener('change', handleChange)
      })
      .catch(() => {
        if (!cancelled) {
          setPermission('unknown')
        }
      })

    return () => {
      cancelled = true
      status?.removeEventListener('change', handleChange)
    }
  }, [])

  return permission
}
