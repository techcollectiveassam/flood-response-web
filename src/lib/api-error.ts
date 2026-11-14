import type { TranslationKey } from './i18n/catalog'

export const PERMISSION_DENIED_ERROR_CODE = 'PERMISSION_DENIED'

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
])

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
