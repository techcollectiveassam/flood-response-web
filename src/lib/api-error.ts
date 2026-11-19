import {
  isHTTPError,
  isNetworkError,
  isResponseSizeError,
  isTimeoutError,
} from 'ky'
import { z, ZodError } from 'zod'
import type { TranslationKey } from './i18n/catalog'

export const PERMISSION_DENIED_ERROR_CODE = 'PERMISSION_DENIED'
export const LOCATION_UNAVAILABLE_ERROR_CODE = 'LOCATION_UNAVAILABLE'

export const API_ERROR_CODES = {
  HTTP: 'HTTP_ERROR',
  NETWORK: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  ABORTED: 'ABORTED',
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

const STATUS_KEYS: Partial<Record<number, TranslationKey>> = {
  401: 'apiError.unauthorized',
  403: 'apiError.forbidden',
  404: 'apiError.notFound',
  409: 'apiError.conflict',
  429: 'apiError.rateLimited',
}

const NETWORK_CODES = new Set<string>([
  API_ERROR_CODES.NETWORK,
  API_ERROR_CODES.TIMEOUT,
])

const NETWORK_ERROR_NAMES = new Set(['NetworkError', 'TimeoutError'])

const KNOWN_DOMAIN_CODES = new Set([
  PERMISSION_DENIED_ERROR_CODE,
  LOCATION_UNAVAILABLE_ERROR_CODE,
])

const fieldErrorSchema = z.object({
  field: z.string(),
  message: z.string(),
})

// Keep `details` as `z.array(z.unknown())` and validate items individually in
// `getBackendError` so one malformed entry does not discard valid sibling errors.
const backendErrorPayloadSchema = z.object({
  error: z.object({
    code: z.string().optional(),
    details: z.array(z.unknown()).optional(),
  }),
})

function asApiErrorLike(error: unknown): ApiErrorLike | null {
  return typeof error === 'object' && error !== null
    ? (error as ApiErrorLike)
    : null
}

function getHttpStatus(error: ApiErrorLike): number | undefined {
  return typeof error.status === 'number'
    ? error.status
    : error.response?.status
}

function isServerErrorStatus(status: number): boolean {
  return status >= 500 && status < 600
}

function isNetworkOrTimeoutError(error: ApiErrorLike): boolean {
  return (
    (typeof error.code === 'string' && NETWORK_CODES.has(error.code)) ||
    (typeof error.name === 'string' && NETWORK_ERROR_NAMES.has(error.name))
  )
}

function getBackendError(data: unknown): {
  code?: string
  fieldErrors?: ApiErrorField[]
} {
  const parsed = backendErrorPayloadSchema.safeParse(data)
  if (!parsed.success) {
    return {}
  }

  const { code, details } = parsed.data.error
  const fieldErrors = details?.flatMap((item) => {
    const field = fieldErrorSchema.safeParse(item)
    return field.success ? [field.data] : []
  })

  return {
    code,
    fieldErrors: fieldErrors?.length ? fieldErrors : undefined,
  }
}

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  if (isHTTPError(error)) {
    const { code, fieldErrors } = getBackendError(error.data)
    return new ApiError({
      status: error.response.status,
      code: code ?? API_ERROR_CODES.HTTP,
      fieldErrors,
      cause: error,
    })
  }

  if (isTimeoutError(error)) {
    return new ApiError({ code: API_ERROR_CODES.TIMEOUT, cause: error })
  }

  if (isNetworkError(error)) {
    return new ApiError({ code: API_ERROR_CODES.NETWORK, cause: error })
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

  const errorLike = asApiErrorLike(error)
  if (errorLike?.name === 'AbortError') {
    return new ApiError({ code: API_ERROR_CODES.ABORTED, cause: error })
  }

  if (
    typeof errorLike?.code === 'string' &&
    KNOWN_DOMAIN_CODES.has(errorLike.code)
  ) {
    return new ApiError({ code: errorLike.code, cause: error })
  }

  return new ApiError({ code: API_ERROR_CODES.UNKNOWN, cause: error })
}

export function isRetryableApiError(error: unknown): boolean {
  const errorLike = asApiErrorLike(error)
  if (!errorLike) {
    return false
  }

  const httpStatus = getHttpStatus(errorLike)
  if (typeof httpStatus === 'number') {
    return isServerErrorStatus(httpStatus)
  }

  return isNetworkOrTimeoutError(errorLike)
}

export function getApiErrorKey(error: unknown): TranslationKey {
  const errorLike = asApiErrorLike(error)
  if (!errorLike) {
    return 'apiError.unknown'
  }

  const httpStatus = getHttpStatus(errorLike)
  if (typeof httpStatus === 'number') {
    const statusKey = STATUS_KEYS[httpStatus]
    if (statusKey) {
      return statusKey
    }

    if (isServerErrorStatus(httpStatus)) {
      return 'apiError.server'
    }
  }

  if (errorLike.code === PERMISSION_DENIED_ERROR_CODE) {
    return 'apiError.forbidden'
  }

  if (errorLike.code === LOCATION_UNAVAILABLE_ERROR_CODE) {
    return 'sos.create.locationRequired'
  }

  if (isNetworkOrTimeoutError(errorLike)) {
    return 'apiError.network'
  }

  return 'apiError.unknown'
}
