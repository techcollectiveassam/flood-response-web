import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { getDisasterRefId } from '@/config/api'
import { apiClient } from '@/lib/api-client'
import { API_ERROR_CODES, ApiError, normalizeApiError } from '@/lib/api-error'
import type { ReportDraft, ReportSeverity } from '../types/report-draft'

const latitudeSchema = z.number().min(-90).max(90)
const longitudeSchema = z.number().min(-180).max(180)

const gpsLocationSchema = z.object({
  source: z.literal('gps'),
  latitude: latitudeSchema,
  longitude: longitudeSchema,
})

const placeSearchLocationSchema = z.object({
  source: z.literal('place_search'),
  latitude: latitudeSchema,
  longitude: longitudeSchema,
})

const pointGeometrySchema = z.object({
  type: z.literal('Point'),
  coordinates: z.tuple([longitudeSchema, latitudeSchema]),
})

const mapLocationSchema = z.object({
  source: z.literal('map'),
  geometry: pointGeometrySchema,
})

const textLocationSchema = z.object({
  source: z.literal('text'),
  description: z.string().min(1),
})

export const affectedAreaLocationPayloadSchema = z.discriminatedUnion(
  'source',
  [
    gpsLocationSchema,
    placeSearchLocationSchema,
    mapLocationSchema,
    textLocationSchema,
  ],
)

// Mirrors the API enum. `unknown` is the form's "Not sure" option.
const severitySchema = z.enum([
  'low',
  'medium',
  'high',
  'critical',
  'unknown',
])

export const affectedAreaReportPayloadSchema = z.object({
  disaster_ref_id: z.string().uuid(),
  location: affectedAreaLocationPayloadSchema,
  severity: severitySchema,
  description: z.string().max(2000).optional(),
  reporter: z
    .object({
      name: z.string().max(100).optional(),
      mobile: z.string().regex(/^\d{10}$/).optional(),
    })
    .optional(),
})

export type AffectedAreaReportPayload = z.infer<
  typeof affectedAreaReportPayloadSchema
>
export type AffectedAreaLocationPayload = z.infer<
  typeof affectedAreaLocationPayloadSchema
>

const severityMap: Record<
  ReportSeverity,
  'critical' | 'high' | 'medium' | 'unknown'
> = {
  critical: 'critical',
  urgent: 'high',
  moderate: 'medium',
  unknown: 'unknown',
}

function buildLocationPayload(draft: ReportDraft): AffectedAreaLocationPayload {
  const { method, coordinates, pin } = draft.location

  switch (method) {
    case 'device':
      if (!coordinates) {
        throw new Error('GPS coordinates are required')
      }

      return {
        source: 'gps',
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      }
    case 'search':
      if (!coordinates) {
        throw new Error('A selected place is required')
      }

      return {
        source: 'place_search',
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      }
    case 'map':
      if (!pin) {
        throw new Error('A map pin is required')
      }

      return {
        source: 'map',
        geometry: {
          type: 'Point',
          coordinates: [pin.longitude, pin.latitude],
        },
      }
    default:
      throw new Error('Unsupported location method')
  }
}

export function buildAffectedAreaReportPayload(
  draft: ReportDraft,
): AffectedAreaReportPayload {
  const disasterRefId = getDisasterRefId()

  if (disasterRefId === null) {
    throw new ApiError({
      code: API_ERROR_CODES.CONFIGURATION,
      message: 'VITE_DISASTER_REF_ID is not configured',
    })
  }

  const severity = draft.situation.severity

  if (!severity) {
    throw new Error('Severity is required')
  }

  const description = draft.situation.details?.trim()
  const reporterName = draft.reporter.name?.trim()
  const reporterMobile = draft.reporter.mobile?.trim()
  const reporter =
    reporterName || reporterMobile
      ? {
          name: reporterName || undefined,
          mobile: reporterMobile || undefined,
        }
      : undefined

  const payload = {
    disaster_ref_id: disasterRefId,
    location: buildLocationPayload(draft),
    severity: severityMap[severity],
    ...(description ? { description } : {}),
    ...(reporter ? { reporter } : {}),
  }

  return affectedAreaReportPayloadSchema.parse(payload)
}

const verificationStatusSchema = z.enum([
  'reported',
  'investigating',
  'verified',
  'disputed',
  'resolved',
])

const createdAffectedAreaSchema = z.object({
  ref_id: z.string(),
  description: z.string().optional(),
  disaster_ref_id: z.string().uuid(),
  location: z.string().optional(),
  geometry: z.string().optional(),
  latitude: z.number().nullish(),
  longitude: z.number().nullish(),
  severity: severitySchema,
  verification_status: verificationStatusSchema,
  report_count: z.number().int(),
})

const createdAffectedAreaReportSchema = z.object({
  ref_id: z.string(),
  severity: severitySchema,
  location: z.record(z.string(), z.unknown()),
  reporter: z
    .object({
      name: z.string().optional(),
      mobile: z.string().optional(),
    })
    .nullish(),
  created_at: z.string(),
})

const createAffectedAreaResponseSchema = z.object({
  data: z.object({
    affected_area: createdAffectedAreaSchema,
    report: createdAffectedAreaReportSchema,
    is_new_area: z.boolean(),
    confidence: z.number(),
    match_reason: z.enum([
      'proximity',
      'within_polygon',
      'overlap',
      'unmatchable',
      'none',
    ]),
  }),
})

export type CreateAffectedAreaResult = z.infer<
  typeof createAffectedAreaResponseSchema
>['data']

export async function createAffectedAreaReport(
  draft: ReportDraft,
): Promise<CreateAffectedAreaResult> {
  try {
    const payload = buildAffectedAreaReportPayload(draft)

    const response = await apiClient
      .post('api/v1/affected-areas', { json: payload })
      .json<unknown>()

    return createAffectedAreaResponseSchema.parse(response).data
  } catch (error) {
    throw normalizeApiError(error)
  }
}

export function useCreateAffectedAreaReport() {
  return useMutation({ mutationFn: createAffectedAreaReport })
}
