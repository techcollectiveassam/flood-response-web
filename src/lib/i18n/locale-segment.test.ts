import { describe, expect, it } from 'vitest'
import {
  buildLocalizedPath,
  getFirstPathSegment,
  isLocaleLikeSegment,
  normalizeLocaleSegment,
  stripLocalePrefix,
} from './locale-segment'

describe('locale segment helpers', () => {
  it.each(['as', 'hi', 'bn', 'en', 'as-IN', 'en-US', 'xx', 'sos'])(
    'treats %s as locale-like',
    (segment) => {
      expect(isLocaleLikeSegment(segment)).toBe(true)
    },
  )

  it.each(['about', 'sosx', 'a', '123', 'as-INX', ''])(
    'does not treat %s as locale-like',
    (segment) => {
      expect(isLocaleLikeSegment(segment)).toBe(false)
    },
  )

  it('normalizes supported locale segments', () => {
    expect(normalizeLocaleSegment('as')).toBe('as')
    expect(normalizeLocaleSegment('AS-IN')).toBe('as')
    expect(normalizeLocaleSegment('en-US')).toBe('en')
    expect(normalizeLocaleSegment('xx')).toBeNull()
  })

  it('extracts the first path segment', () => {
    expect(getFirstPathSegment('/as/sos')).toBe('as')
    expect(getFirstPathSegment('/')).toBe('')
  })

  it('strips only the matching locale prefix', () => {
    expect(stripLocalePrefix('/as/sos', 'as')).toBe('/sos')
    expect(stripLocalePrefix('/as', 'as')).toBe('')
    expect(stripLocalePrefix('/hi/sos', 'as')).toBe('/hi/sos')
  })

  it('builds a localized path from an unprefixed path', () => {
    expect(buildLocalizedPath('hi', '/sos')).toBe('/hi/sos')
    expect(buildLocalizedPath('hi', '/')).toBe('/hi')
  })
})
