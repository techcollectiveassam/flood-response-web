import ky from 'ky'

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL || '/'
const baseUrl = configuredBaseUrl.endsWith('/')
  ? configuredBaseUrl
  : `${configuredBaseUrl}/`

export const apiClient = ky.create({
  baseUrl,
  timeout: 30_000,
  retry: 0,
})
