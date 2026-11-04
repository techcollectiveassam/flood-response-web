import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { renderWithProviders, screen, waitFor } from '@/testing/test-utils'
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

  it('closes the navigation menu after switching language inside it', async () => {
    const router = renderShell('/en')

    await userEvent.click(
      screen.getByRole('button', { name: 'Open navigation menu' }),
    )

    expect(await screen.findByRole('dialog')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'हिन्दी' }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/hi')
    })
  })
})
