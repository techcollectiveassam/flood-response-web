import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { renderWithProviders, screen } from '@/testing/test-utils'
import { DesktopAppShell } from '@/app/layouts/desktop-app-shell'

function renderShell(initialEntry: string) {
  const router = createMemoryRouter(
    [
      {
        path: '/:lang',
        element: <DesktopAppShell />,
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

describe('DesktopAppShell', () => {
  it('exposes a skip link targeting the main landmark', () => {
    renderShell('/en')

    expect(
      screen.getByRole('link', { name: 'Skip to main content' }),
    ).toHaveAttribute('href', '#main-content')
    expect(document.getElementById('main-content')).toBeInTheDocument()
    expect(screen.getByText('Page content')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Report Flooded Area' }),
    ).toHaveAttribute('href', '/en/report-flood')
    expect(
      screen.getByRole('link', { name: 'Emergency SOS' }),
    ).toHaveAttribute('href', '/en/sos/new')
  })
})
