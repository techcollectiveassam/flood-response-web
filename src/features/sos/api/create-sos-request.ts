import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { getSosDisasterId } from '@/config/api'
import {
  API_ERROR_CODES,
  ApiError,
  LOCATION_UNAVAILABLE_ERROR_CODE,
  normalizeApiError,
  PERMISSION_DENIED_ERROR_CODE,
} from '@/lib/api-error'
import type { ApiErrorLike } from '@/lib/api-error'
import { apiClient } from '@/lib/api-client'
import { normalizeDigits } from '@/lib/normalize-digits'

const MOBILE_PATTERN = /^\d{10}$/
const GEOLOCATION_PERMISSION_DENIED = 1

const coordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
})

const sosLocationSchema = coordinatesSchema.partial()

const createSosRequestSchema = z
  .object({
    disaster_id: z.number().int().positive(),
    reporter_mobile: z.string().regex(MOBILE_PATTERN).optional(),
    location: coordinatesSchema.nullish(),
  })
  .refine(
    (data) => data.reporter_mobile !== undefined || data.location != null,
    {
      message: 'Either reporter_mobile or location is required',
      path: ['reporter_mobile'],
    },
  )

export const sosSchema = z.object({
  id: z.number().int(),
  disaster_id: z.number().int(),
  status: z.enum(['reported', 'active', 'resolved', 'cancelled']),
  report_count: z.number().int(),
  created_at: z.string(),
  location: sosLocationSchema.nullish(),
  reporter_mobile: z.string().optional(),
  message: z.string().optional(),
})

export const sosResponseSchema = z.object({
  data: sosSchema,
})

export type CreateSosRequestInput = z.infer<typeof createSosRequestSchema>
export type Sos = z.infer<typeof sosSchema>

type Coordinates = z.infer<typeof coordinatesSchema>
type CreateSosRequestVariables = {
  reporterMobile?: string
}

function createLocationError(code: string, message: string, cause?: unknown) {
  return new ApiError({ code, message, cause })
}

function getCurrentLocation(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      reject(
        createLocationError(
          LOCATION_UNAVAILABLE_ERROR_CODE,
          'Geolocation is not available',
        ),
      )
      return
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        resolve({
          latitude: coords.latitude,
          longitude: coords.longitude,
        })
      },
      (error) => {
        if (error.code === GEOLOCATION_PERMISSION_DENIED) {
          reject(
            createLocationError(
              PERMISSION_DENIED_ERROR_CODE,
              'Location permission denied',
              error,
            ),
          )
          return
        }

        reject(
          createLocationError(
            LOCATION_UNAVAILABLE_ERROR_CODE,
            'Location is unavailable',
            error,
          ),
        )
      },
      {
        enableHighAccuracy: true,
        timeout: 10_000,
        maximumAge: 0,
      },
    )
  })
}

export function isLocationError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) {
    return false
  }

  const { code } = error as ApiErrorLike

  return (
    code === PERMISSION_DENIED_ERROR_CODE ||
    code === LOCATION_UNAVAILABLE_ERROR_CODE
  )
}

function parseCreateSosRequest(input: unknown): CreateSosRequestInput {
  try {
    return createSosRequestSchema.parse(input)
  } catch (error) {
    throw normalizeApiError(error)
  }
}

export async function buildCreateSosRequest(
  reporterMobile?: string,
): Promise<CreateSosRequestInput> {
  const disasterId = getSosDisasterId()

  if (disasterId === null) {
    throw new ApiError({
      code: API_ERROR_CODES.CONFIGURATION,
      message: 'VITE_DISASTER_ID is not configured',
    })
  }

  if (reporterMobile !== undefined) {
    return parseCreateSosRequest({
      disaster_id: disasterId,
      reporter_mobile: normalizeDigits(reporterMobile).trim(),
    })
  }

  const location = await getCurrentLocation()

  return parseCreateSosRequest({
    disaster_id: disasterId,
    location,
  })
}

export async function createSosRequest(
  variables: CreateSosRequestVariables = {},
): Promise<Sos> {
  try {
    const payload = await buildCreateSosRequest(variables.reporterMobile)
    const response = await apiClient
      .post('api/v1/sos', { json: payload })
      .json<unknown>()

    return sosResponseSchema.parse(response).data
  } catch (error) {
    throw normalizeApiError(error)
  }
}

export function useCreateSosRequest() {
  return useMutation({ mutationFn: createSosRequest })
}
