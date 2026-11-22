import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach } from 'vitest'
import { i18n } from '@/lib/i18n/i18n'
import { server } from './mocks/server'

// Start before test modules import the API client so ky binds to the
// intercepted fetch implementation.
server.listen({ onUnhandledFrame: 'error' })

afterEach(async () => {
  server.resetHandlers()
  cleanup()
  localStorage.clear()
  document.documentElement.lang = 'en'
  document.documentElement.dir = 'ltr'
  await i18n.changeLanguage('en')
})

afterAll(() => {
  server.close()
})
