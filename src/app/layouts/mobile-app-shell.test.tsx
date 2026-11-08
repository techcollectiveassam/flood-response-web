import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { renderWithProviders, screen, waitFor, within } from '@/testing/test-utils'
import { i18n } from '@/lib/i18n/i18n'
import { MobileAppShell } from '@/app/layouts/mobile-app-shell'

function renderShell(initialEntry: string) {
  const router = createMemoryRouter(
    [
      {
        path: '/:lang',
        element: <MobileAppShell />,
        children: [
          {
            index: true,
            element: <p>Page content</p>,
          },
          {
            path: '*',
            element: <p>Page content</p>,
          },
        ],
      },
    ],
    { initialEntries: [initialEntry] },
  )

  renderWithProviders(<RouterProvider router={router} />)

  return router
}

describe('MobileAppShell', () => {
  it('exposes a skip link targeting the main landmark', () => {
    renderShell('/en')

    expect(
      screen.getByRole('link', { name: 'Skip to main content' }),
    ).toHaveAttribute('href', '#main-content')
    expect(document.getElementById('main-content')).toBeInTheDocument()
    expect(screen.getByText('Page content')).toBeInTheDocument()
  })

  it('opens the navigation menu and closes it with the close button', async () => {
    renderShell('/en')

    const menuButton = screen.getByRole('button', {
      name: 'Open navigation menu',
    })

    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await userEvent.click(menuButton)

    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    expect(menuButton).toHaveAttribute('aria-expanded', 'true')

    await userEvent.click(
      screen.getByRole('button', { name: 'Close navigation menu' }),
    )

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('keeps the navigation menu open after switching language inside it', async () => {
    const router = renderShell('/en')

    await userEvent.click(
      screen.getByRole('button', { name: 'Open navigation menu' }),
    )

    expect(await screen.findByRole('dialog')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'हिन्दी' }))

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/hi')
    })
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('links the brand and the emergency SOS menu item to localized routes', async () => {
    await i18n.changeLanguage('en')

    const router = renderShell('/en')

    expect(
      screen.getByRole('link', { name: /Flood Watch.*Assam Floods 2026/i }),
    ).toHaveAttribute('href', '/en')

    await userEvent.click(
      screen.getByRole('button', { name: 'Open navigation menu' }),
    )

    const dialog = await screen.findByRole('dialog')

    expect(
      within(dialog).getByRole('link', {
        name: /Flood Watch.*Assam Floods 2026/i,
      }),
    ).toHaveAttribute('href', '/en')

    const sosLink = within(dialog).getByRole('link', {
      name: 'Emergency SOS',
    })

    expect(sosLink).toHaveAttribute('href', '/en/sos/new')

    await userEvent.click(sosLink)

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/en/sos/new')
    })
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })
})
