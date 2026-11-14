import { describe, expect, it } from 'vitest'
import {
  getApiErrorKey,
  PERMISSION_DENIED_ERROR_CODE,
} from './api-error'

describe('getApiErrorKey', () => {
  it.each([
    [401, 'apiError.unauthorized'],
    [403, 'apiError.forbidden'],
    [404, 'apiError.notFound'],
    [409, 'apiError.conflict'],
    [429, 'apiError.rateLimited'],
    [500, 'apiError.server'],
    [502, 'apiError.server'],
    [503, 'apiError.server'],
    [504, 'apiError.server'],
  ] as const)('maps status %i', (status, key) => {
    expect(getApiErrorKey({ status })).toBe(key)
  })

  it('maps HTTP errors that expose the status on a response', () => {
    expect(getApiErrorKey({ response: { status: 404 } })).toBe(
      'apiError.notFound',
    )
    expect(getApiErrorKey({ response: { status: 503 } })).toBe(
      'apiError.server',
    )
  })

  it('maps network error codes and names', () => {
    expect(getApiErrorKey({ code: 'NETWORK_ERROR' })).toBe('apiError.network')
    expect(getApiErrorKey({ code: 'ETIMEDOUT' })).toBe('apiError.network')
    expect(getApiErrorKey({ name: 'NetworkError' })).toBe('apiError.network')
    expect(getApiErrorKey({ name: 'TimeoutError' })).toBe('apiError.network')
  })

  it('maps permission denied errors', () => {
    expect(getApiErrorKey({ code: PERMISSION_DENIED_ERROR_CODE })).toBe(
      'apiError.forbidden',
    )
  })

  it('falls back to the unknown error key', () => {
    expect(getApiErrorKey(undefined)).toBe('apiError.unknown')
    expect(getApiErrorKey({ status: 418 })).toBe('apiError.unknown')
    expect(getApiErrorKey(new Error('boom'))).toBe('apiError.unknown')
  })
})
