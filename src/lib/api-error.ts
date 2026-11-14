import {
  isHTTPError,
  isNetworkError,
  isResponseSizeError,
  isTimeoutError,
} from 'ky'
import { ZodError } from 'zod'
import type { TranslationKey } from './i18n/catalog'

export const PERMISSION_DENIED_ERROR_CODE = 'PERMISSION_DENIED'
export const LOCATION_UNAVAILABLE_ERROR_CODE = 'LOCATION_UNAVAILABLE'

export const API_ERROR_CODES = {
  HTTP: 'HTTP_ERROR',
  NETWORK: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  VALIDATION: 'VALIDATION_ERROR',
  RESPONSE_TOO_LARGE: 'RESPONSE_TOO_LARGE',
  CONFIGURATION: 'CONFIGURATION_ERROR',
  UNKNOWN: 'UNKNOWN',
} as const

export type ApiErrorField = {
  field: string
  message: string
}

type ApiErrorOptions = {
  code: string
  status?: number
  fieldErrors?: ApiErrorField[]
  cause?: unknown
  message?: string
}

export class ApiError extends Error {
  readonly status?: number
  readonly code: string
  readonly fieldErrors?: ApiErrorField[]

  constructor({
    code,
    status,
    fieldErrors,
    cause,
    message,
  }: ApiErrorOptions) {
    super(message ?? `API request failed: ${code}`, { cause })
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.fieldErrors = fieldErrors
  }
}

export type ApiErrorLike = {
  status?: number
  code?: string
  name?: string
  response?: {
    status?: number
  }
}

const STATUS_KEYS: Record<number, TranslationKey> = {
  401: 'apiError.unauthorized',
  403: 'apiError.forbidden',
  404: 'apiError.notFound',
  409: 'apiError.conflict',
  429: 'apiError.rateLimited',
  500: 'apiError.server',
  502: 'apiError.server',
  503: 'apiError.server',
  504: 'apiError.server',
}

const NETWORK_CODES = new Set([
  'NETWORK_ERROR',
  'ERR_NETWORK',
  'ECONNABORTED',
  'ETIMEDOUT',
  'TIMEOUT',
])

const KNOWN_DOMAIN_CODES = new Set([
  PERMISSION_DENIED_ERROR_CODE,
  LOCATION_UNAVAILABLE_ERROR_CODE,
])

function getFieldErrors(details: unknown): ApiErrorField[] | undefined {
  if (!Array.isArray(details)) {
    return undefined
  }

  const fieldErrors = details
    .map((detail) => {
      if (typeof detail !== 'object' || detail === null) {
        return null
      }

      const { field, message } = detail as {
        field?: unknown
        message?: unknown
      }

      if (typeof field !== 'string' || typeof message !== 'string') {
        return null
      }

      return { field, message }
    })
    .filter((detail): detail is ApiErrorField => detail !== null)

  return fieldErrors.length > 0 ? fieldErrors : undefined
}

function getBackendError(data: unknown): {
  code?: string
  fieldErrors?: ApiErrorField[]
} {
  if (typeof data !== 'object' || data === null) {
    return {}
  }

  const { error } = data as { error?: unknown }

  if (typeof error !== 'object' || error === null) {
    return {}
  }

  const { code, details } = error as {
    code?: unknown
    details?: unknown
  }

  return {
    code: typeof code === 'string' ? code : undefined,
    fieldErrors: getFieldErrors(details),
  }
}

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  if (isHTTPError(error)) {
    const backendError = getBackendError(error.data)

    return new ApiError({
      status: error.response.status,
      code: backendError.code ?? API_ERROR_CODES.HTTP,
      fieldErrors: backendError.fieldErrors,
      cause: error,
    })
  }

  if (isTimeoutError(error)) {
    return new ApiError({
      code: API_ERROR_CODES.TIMEOUT,
      cause: error,
    })
  }

  if (isNetworkError(error)) {
    return new ApiError({
      code: API_ERROR_CODES.NETWORK,
      cause: error,
    })
  }

  if (isResponseSizeError(error)) {
    return new ApiError({
      code: API_ERROR_CODES.RESPONSE_TOO_LARGE,
      cause: error,
    })
  }

  if (error instanceof ZodError) {
    return new ApiError({
      code: API_ERROR_CODES.VALIDATION,
      fieldErrors: error.issues.map((issue) => ({
        field: issue.path.map(String).join('.') || 'request',
        message: issue.message,
      })),
      cause: error,
    })
  }

  if (typeof error === 'object' && error !== null) {
    const { code } = error as ApiErrorLike

    if (typeof code === 'string' && KNOWN_DOMAIN_CODES.has(code)) {
      return new ApiError({
        code,
        cause: error,
      })
    }
  }

  return new ApiError({
    code: API_ERROR_CODES.UNKNOWN,
    cause: error,
  })
}

export function getApiErrorKey(error: unknown): TranslationKey {
  if (typeof error === 'object' && error !== null) {
    const { status, code, name, response } = error as ApiErrorLike
    const httpStatus =
      typeof status === 'number' ? status : response?.status

    if (typeof httpStatus === 'number' && STATUS_KEYS[httpStatus]) {
      return STATUS_KEYS[httpStatus]
    }

    if (code === PERMISSION_DENIED_ERROR_CODE) {
      return 'apiError.forbidden'
    }

    if (
      (typeof code === 'string' && NETWORK_CODES.has(code)) ||
      name === 'NetworkError' ||
      name === 'TimeoutError'
    ) {
      return 'apiError.network'
    }
  }

  return 'apiError.unknown'
}
