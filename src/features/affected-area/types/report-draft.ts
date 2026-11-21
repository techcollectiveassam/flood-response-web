import { z } from 'zod'
import { DEFAULT_LOCATION_METHOD } from '../utils/location-method'

const coordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
})

const locationDraftSchema = z.object({
  method: z.enum(['device', 'search', 'map']).default(DEFAULT_LOCATION_METHOD),
  coordinates: coordinatesSchema.optional(),
  query: z.string().optional(),
  pin: coordinatesSchema.optional(),
})

const situationDraftSchema = z.object({
  severity: z.enum(['critical', 'urgent', 'moderate', 'unknown']).optional(),
  details: z.string().max(2000).optional(),
})

export const reportDraftSchema = z.object({
  location: locationDraftSchema,
  situation: situationDraftSchema,
})

export type ReportDraft = z.infer<typeof reportDraftSchema>
export type ReportSeverity = NonNullable<ReportDraft['situation']['severity']>

export function createEmptyReportDraft(): ReportDraft {
  return {
    location: { method: DEFAULT_LOCATION_METHOD },
    situation: {},
  }
}
