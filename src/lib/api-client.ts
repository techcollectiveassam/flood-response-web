import ky from 'ky'
import { normalizeApiError } from './api-error'

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL || '/'
const baseUrl = configuredBaseUrl.endsWith('/')
  ? configuredBaseUrl
  : `${configuredBaseUrl}/`

export const apiClient = ky.create({
  baseUrl,
  timeout: 30_000,
  retry: 0,
  hooks: {
    beforeError: [({ error }) => normalizeApiError(error)],
  },
})
