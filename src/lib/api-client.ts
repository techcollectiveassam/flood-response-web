import ky from 'ky'
import { apiBaseUrl } from '@/config/api'
import { normalizeApiError } from './api-error'

export const apiClient = ky.create({
  baseUrl: apiBaseUrl,
  timeout: 30_000,
  retry: 0,
  hooks: {
    beforeError: [({ error }) => normalizeApiError(error)],
  },
})
