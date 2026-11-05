import type { ReactElement } from 'react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { renderWithProviders, screen } from '@/testing/test-utils'
import { RouteErrorBoundary } from './route-error-boundary'

function renderRoute(element: ReactElement, loader?: () => Promise<Response>) {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        errorElement: <RouteErrorBoundary />,
        children: [
          {
            path: '*',
            element,
            loader,
          },
        ],
      },
    ],
    { initialEntries: ['/boom'] },
  )

  renderWithProviders(<RouterProvider router={router} />)

  return router
}

describe('RouteErrorBoundary', () => {
  it('renders the error message and recovery actions for a thrown error', async () => {
    function ThrowingPage(): ReactElement {
      throw new Error('boom')
    }

    renderRoute(<ThrowingPage />)

    expect(
      await screen.findByRole('heading', { name: 'Something went wrong' }),
    ).toBeInTheDocument()
    expect(screen.getByText('boom')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go home' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reload' })).toBeInTheDocument()
  })

  it('renders the status and body for an error response', async () => {
    async function failingLoader(): Promise<Response> {
      throw new Response('Service unavailable', {
        status: 503,
        statusText: 'Service Unavailable',
      })
    }

    renderRoute(<p>Never rendered</p>, failingLoader)

    expect(
      await screen.findByRole('heading', { name: '503 Service Unavailable' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Service unavailable')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go home' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reload' })).toBeInTheDocument()
  })

  it('renders the unexpected error message for a non-Error throw', async () => {
    function ThrowingPage(): ReactElement {
      throw 'kaboom'
    }

    renderRoute(<ThrowingPage />)

    expect(
      await screen.findByRole('heading', { name: 'Something went wrong' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('An unexpected error occurred.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go home' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reload' })).toBeInTheDocument()
  })
})
