import type { ReportDraft } from '../types/report-draft'

export type LocationMethod = 'device' | 'search' | 'map'

export const DEFAULT_LOCATION_METHOD: LocationMethod = 'device'

export function hasResolvedLocation(
  location: ReportDraft['location'],
): boolean {
  switch (location.method) {
    case 'device':
    case 'search':
      return location.coordinates !== undefined
    case 'map':
      return location.pin !== undefined
    default:
      return false
  }
}
