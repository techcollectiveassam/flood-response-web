import { describe, expect, it } from 'vitest'
import { getApiErrorKey } from './api-error'

describe('getApiErrorKey', () => {
  it.each([
    [401, 'apiError.unauthorized'],
    [403, 'apiError.forbidden'],
    [404, 'apiError.notFound'],
    [409, 'apiError.conflict'],
    [429, 'apiError.rateLimited'],
    [500, 'apiError.server'],
    [503, 'apiError.server'],
  ] as const)('maps status %i', (status, key) => {
    expect(getApiErrorKey({ status })).toBe(key)
  })

  it('maps network error codes', () => {
    expect(getApiErrorKey({ code: 'NETWORK_ERROR' })).toBe('apiError.network')
    expect(getApiErrorKey({ code: 'ETIMEDOUT' })).toBe('apiError.network')
  })

  it('falls back to the unknown error key', () => {
    expect(getApiErrorKey(undefined)).toBe('apiError.unknown')
    expect(getApiErrorKey({ status: 418 })).toBe('apiError.unknown')
    expect(getApiErrorKey(new Error('boom'))).toBe('apiError.unknown')
  })
})
