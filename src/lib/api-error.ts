import type { TranslationKey } from './i18n/catalog'

export type ApiErrorLike = {
  status?: number
  code?: string
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
    const { status, code } = error as ApiErrorLike

    if (typeof status === 'number' && STATUS_KEYS[status]) {
      return STATUS_KEYS[status]
    }

    if (typeof code === 'string' && NETWORK_CODES.has(code)) {
      return 'apiError.network'
    }
  }

  return 'apiError.unknown'
}
