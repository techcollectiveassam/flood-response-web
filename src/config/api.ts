import { z } from 'zod'

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/'

export const apiBaseUrl = configuredApiBaseUrl.endsWith('/')
  ? configuredApiBaseUrl
  : `${configuredApiBaseUrl}/`

const disasterRefIdSchema = z.string().uuid()

export function getDisasterRefId(): string | null {
  const raw = import.meta.env.VITE_DISASTER_REF_ID?.trim()

  if (!raw) {
    return null
  }

  const parsed = disasterRefIdSchema.safeParse(raw)

  return parsed.success ? parsed.data : null
}
