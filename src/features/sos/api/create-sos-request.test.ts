import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { PERMISSION_DENIED_ERROR_CODE } from '@/lib/api-error'
import {
  buildCreateSosRequest,
  isLocationError,
  LOCATION_UNAVAILABLE_ERROR_CODE,
  sosResponseSchema,
} from './create-sos-request'

const originalGeolocation = Object.getOwnPropertyDescriptor(
  navigator,
  'geolocation',
)

function stubGeolocation(
  implementation: (
    success: PositionCallback,
    error?: PositionErrorCallback | null,
  ) => void,
) {
  Object.defineProperty(navigator, 'geolocation', {
    configurable: true,
    value: {
      getCurrentPosition: vi.fn(implementation),
    },
  })
}

function stubSuccessfulLocation() {
  stubGeolocation((success) => {
    success({
      coords: {
        latitude: 26.29,
        longitude: 91.8,
      },
    } as GeolocationPosition)
  })
}

describe('buildCreateSosRequest', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_DISASTER_ID', '7')
    stubSuccessfulLocation()
  })

  afterEach(() => {
    vi.unstubAllEnvs()

    if (originalGeolocation) {
      Object.defineProperty(navigator, 'geolocation', originalGeolocation)
    } else {
      Reflect.deleteProperty(navigator, 'geolocation')
    }
  })

  it('builds the payload with the configured disaster and GPS coordinates', async () => {
    await expect(buildCreateSosRequest()).resolves.toEqual({
      disaster_id: 7,
      location: {
        latitude: 26.29,
        longitude: 91.8,
      },
    })
  })

  it('builds a mobile fallback payload without GPS', async () => {
    stubGeolocation((_success, error) => {
      error?.({
        code: 1,
        message: 'Permission denied',
      } as GeolocationPositionError)
    })

    await expect(buildCreateSosRequest('9876543210')).resolves.toEqual({
      disaster_id: 7,
      reporter_mobile: '9876543210',
    })
  })

  it('normalizes localized digits in the mobile fallback', async () => {
    await expect(buildCreateSosRequest('৯৮৭৬৫৪৩২১০')).resolves.toEqual({
      disaster_id: 7,
      reporter_mobile: '9876543210',
    })
  })

  it('rejects an invalid mobile number', async () => {
    await expect(buildCreateSosRequest('123')).rejects.toThrow()
  })

  it('rejects when the disaster id is missing', async () => {
    vi.stubEnv('VITE_DISASTER_ID', '')

    await expect(buildCreateSosRequest()).rejects.toThrow(
      'VITE_DISASTER_ID is not configured',
    )
  })

  it('rejects when the disaster id is invalid', async () => {
    vi.stubEnv('VITE_DISASTER_ID', 'abc')

    await expect(buildCreateSosRequest()).rejects.toThrow(
      'VITE_DISASTER_ID is not configured',
    )
  })

  it('rejects when geolocation fails', async () => {
    stubGeolocation((_success, error) => {
      error?.({
        code: 1,
        message: 'Permission denied',
      } as GeolocationPositionError)
    })

    await expect(buildCreateSosRequest()).rejects.toMatchObject({
      code: PERMISSION_DENIED_ERROR_CODE,
    })
  })

  it('maps other geolocation failures to the unavailable code', async () => {
    stubGeolocation((_success, error) => {
      error?.({
        code: 2,
        message: 'Position unavailable',
      } as GeolocationPositionError)
    })

    await expect(buildCreateSosRequest()).rejects.toMatchObject({
      code: LOCATION_UNAVAILABLE_ERROR_CODE,
    })
  })
})

describe('isLocationError', () => {
  it('recognizes permission and unavailable location errors', () => {
    expect(isLocationError({ code: PERMISSION_DENIED_ERROR_CODE })).toBe(true)
    expect(isLocationError({ code: LOCATION_UNAVAILABLE_ERROR_CODE })).toBe(
      true,
    )
    expect(isLocationError({ code: 'NETWORK_ERROR' })).toBe(false)
    expect(isLocationError(null)).toBe(false)
  })
})

describe('sosResponseSchema', () => {
  it('parses a created SOS response', () => {
    const response = sosResponseSchema.parse({
      data: {
        id: 12,
        disaster_id: 7,
        status: 'reported',
        report_count: 1,
        created_at: '2026-11-13T00:00:00Z',
        location: {
          latitude: 26.29,
          longitude: 91.8,
        },
      },
    })

    expect(response.data.id).toBe(12)
    expect(response.data.location).toEqual({
      latitude: 26.29,
      longitude: 91.8,
    })
  })
})
