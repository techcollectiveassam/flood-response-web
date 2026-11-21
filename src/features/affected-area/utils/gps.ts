import type { TranslationKey } from '@/lib/i18n/catalog'
import type { LanguageCode } from '@/lib/i18n/config'
import { formatNumber } from '@/lib/i18n/formatters'

export type GpsErrorCode = 'denied' | 'unavailable' | 'timeout' | 'unsupported'

export const GPS_ERROR_KEYS: Record<GpsErrorCode, TranslationKey> = {
  denied: 'affectedArea.location.gps.error.denied',
  unavailable: 'affectedArea.location.gps.error.unavailable',
  timeout: 'affectedArea.location.gps.error.timeout',
  unsupported: 'affectedArea.location.gps.error.unsupported',
}

export type GpsCoordinates = {
  latitude: number
  longitude: number
  accuracy?: number
}

function formatCoordinate(
  value: number,
  language: LanguageCode,
): string {
  return formatNumber(Math.abs(value), language, {
    minimumFractionDigits: 5,
    maximumFractionDigits: 5,
  })
}

export function formatGpsCoordinates(
  coordinates: GpsCoordinates,
  language: LanguageCode,
): string {
  const latitude = `${formatCoordinate(coordinates.latitude, language)}° ${
    coordinates.latitude >= 0 ? 'N' : 'S'
  }`
  const longitude = `${formatCoordinate(coordinates.longitude, language)}° ${
    coordinates.longitude >= 0 ? 'E' : 'W'
  }`

  return `${latitude}, ${longitude}`
}

export function formatGpsAccuracy(
  accuracy: number,
  language: LanguageCode,
): string {
  return `${formatNumber(Math.round(accuracy), language)} m`
}

export function formatGpsDescription(
  coordinates: GpsCoordinates,
  language: LanguageCode,
  accuracyLabel: string,
): string {
  const formatted = formatGpsCoordinates(coordinates, language)

  if (coordinates.accuracy === undefined) {
    return formatted
  }

  return `${formatted} • ${accuracyLabel}: ${formatGpsAccuracy(
    coordinates.accuracy,
    language,
  )}`
}
