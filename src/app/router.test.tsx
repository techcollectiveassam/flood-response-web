import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { renderWithProviders, screen, waitFor } from '@/testing/test-utils'
import { LANGUAGE_STORAGE_KEY } from '@/lib/i18n/config'
import { routes } from './router'

function renderRoute(initialEntry: string) {
  const router = createMemoryRouter(routes, {
    initialEntries: [initialEntry],
  })

  renderWithProviders(<RouterProvider router={router} />)

  return router
}

describe('locale routing', () => {
  it('redirects an unsupported locale to the stored preference', async () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, 'hi')

    const router = renderRoute('/xx/sos')

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/hi/sos')
    })
    expect(await screen.findByRole('heading', { name: 'SOS अनुरोध' })).toBeInTheDocument()
  })

  it('redirects an unsupported locale-like path to the preferred locale', async () => {
    const router = renderRoute('/fr/sos')

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/en/sos')
    })
  })

  it('normalizes a supported locale with a region', async () => {
    const router = renderRoute('/as-IN/sos')

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/as/sos')
    })
    expect(await screen.findByRole('heading', { name: 'SOS অনুৰোধ' })).toBeInTheDocument()
  })

  it('localizes an unprefixed unknown path before rendering 404', async () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, 'hi')

    const router = renderRoute('/about')

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/hi/about')
    })
    expect(await screen.findByRole('heading', { name: 'पृष्ठ नहीं मिला' })).toBeInTheDocument()
  })

  it('localizes nested unknown paths', async () => {
    const router = renderRoute('/about/foo')

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/en/about/foo')
    })
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })

  it('localizes short unknown paths instead of dropping them', async () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, 'hi')

    const router = renderRoute('/map')

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/hi/map')
    })
    expect(await screen.findByRole('heading', { name: 'पृष्ठ नहीं मिला' })).toBeInTheDocument()
  })

  it('sends a bare short unknown segment to the localized 404 instead of home', async () => {
    const router = renderRoute('/faq')

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/en/faq')
    })
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })

  it('renders a localized 404 without redirecting inside a supported locale', async () => {
    const router = renderRoute('/as/nope')

    expect(await screen.findByRole('heading', { name: 'পৃষ্ঠা পোৱা নগ’ল' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/as/nope')
  })

  it('redirects legacy /sos using the stored preference', async () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, 'hi')

    const router = renderRoute('/sos')

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/hi/sos')
    })
  })

  it('redirects legacy /sos/new using the stored preference', async () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, 'bn')

    const router = renderRoute('/sos/new')

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/bn/sos/new')
    })
  })

  it('keeps a reserved legacy segment inside the locale', async () => {
    const router = renderRoute('/sos/extra')

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/en/sos/extra')
    })
  })

  it('redirects / to the stored preference', async () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, 'hi')

    const router = renderRoute('/')

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/hi')
    })
  })

  it('lets a supported URL override the stored preference', async () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, 'hi')

    const router = renderRoute('/as/sos')

    expect(await screen.findByRole('heading', { name: 'SOS অনুৰোধ' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/as/sos')
  })
})
