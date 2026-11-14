import { HTTPError, NetworkError, TimeoutError } from 'ky'
import type { NormalizedOptions } from 'ky'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import {
  API_ERROR_CODES,
  ApiError,
  getApiErrorKey,
  LOCATION_UNAVAILABLE_ERROR_CODE,
  normalizeApiError,
  PERMISSION_DENIED_ERROR_CODE,
} from './api-error'

const request = new Request('https://example.test/api/v1/sos', {
  method: 'POST',
})

function createHttpError(data: unknown, status = 400) {
  const response = new Response(
    data === undefined ? null : JSON.stringify(data),
    {
      status,
      headers: { 'Content-Type': 'application/json' },
    },
  )
  const error = new HTTPError(response, request, {} as NormalizedOptions)
  error.data = data
  return error
}

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
    expect(getApiErrorKey({ code: 'TIMEOUT' })).toBe('apiError.network')
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

describe('normalizeApiError', () => {
  it('normalizes HTTP errors with backend details', () => {
    const cause = createHttpError({
      error: {
        code: 'invalid_sos',
        message: 'validation error',
        details: [
          { field: 'reporter_mobile', message: 'required' },
          { field: 'location', message: 'invalid' },
        ],
      },
    })

    const error = normalizeApiError(cause)

    expect(error).toBeInstanceOf(ApiError)
    expect(error.status).toBe(400)
    expect(error.code).toBe('invalid_sos')
    expect(error.fieldErrors).toEqual([
      { field: 'reporter_mobile', message: 'required' },
      { field: 'location', message: 'invalid' },
    ])
    expect(error.cause).toBe(cause)
  })

  it('uses the HTTP fallback code without a backend body', () => {
    const cause = createHttpError(undefined, 500)

    const error = normalizeApiError(cause)

    expect(error.status).toBe(500)
    expect(error.code).toBe(API_ERROR_CODES.HTTP)
    expect(error.cause).toBe(cause)
  })

  it('normalizes network and timeout errors', () => {
    const networkCause = new NetworkError(request)
    const networkError = normalizeApiError(networkCause)

    expect(networkError.code).toBe(API_ERROR_CODES.NETWORK)
    expect(networkError.cause).toBe(networkCause)

    const timeoutCause = new TimeoutError(request)
    const timeoutError = normalizeApiError(timeoutCause)

    expect(timeoutError.code).toBe(API_ERROR_CODES.TIMEOUT)
    expect(timeoutError.cause).toBe(timeoutCause)
  })

  it('normalizes validation errors with field paths', () => {
    const result = z
      .object({ reporter_mobile: z.string().regex(/^\d{10}$/) })
      .safeParse({ reporter_mobile: '123' })

    if (result.success) {
      throw new Error('Expected validation to fail')
    }

    const error = normalizeApiError(result.error)

    expect(error.code).toBe(API_ERROR_CODES.VALIDATION)
    expect(error.fieldErrors).toEqual([
      { field: 'reporter_mobile', message: expect.any(String) },
    ])
    expect(error.cause).toBe(result.error)
  })

  it('preserves location error codes', () => {
    const permissionCause = Object.assign(new Error('denied'), {
      code: PERMISSION_DENIED_ERROR_CODE,
    })
    const permissionError = normalizeApiError(permissionCause)

    expect(permissionError.code).toBe(PERMISSION_DENIED_ERROR_CODE)
    expect(permissionError.cause).toBe(permissionCause)

    const unavailableCause = Object.assign(new Error('unavailable'), {
      code: LOCATION_UNAVAILABLE_ERROR_CODE,
    })
    const unavailableError = normalizeApiError(unavailableCause)

    expect(unavailableError.code).toBe(LOCATION_UNAVAILABLE_ERROR_CODE)
    expect(unavailableError.cause).toBe(unavailableCause)
  })

  it('returns existing ApiError instances unchanged', () => {
    const error = new ApiError({ code: 'TEST_ERROR' })

    expect(normalizeApiError(error)).toBe(error)
  })

  it('normalizes unknown errors', () => {
    const cause = new Error('boom')

    const error = normalizeApiError(cause)

    expect(error.code).toBe(API_ERROR_CODES.UNKNOWN)
    expect(error.cause).toBe(cause)
  })
})
