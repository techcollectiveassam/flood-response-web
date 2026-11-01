import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { renderWithProviders, screen, waitFor } from '@/testing/test-utils'
import { LANGUAGE_STORAGE_KEY } from '@/lib/i18n/config'
import { i18n } from '@/lib/i18n/i18n'
import { LanguageSwitcher } from './language-switcher'

describe('LanguageSwitcher', () => {
  it('switches language, persists it, and keeps the current path', async () => {
    await i18n.changeLanguage('as')

    const router = createMemoryRouter(
      [
        {
          path: '/:lang/*',
          element: <LanguageSwitcher />,
        },
      ],
      {
        initialEntries: ['/as/sos'],
      },
    )

    renderWithProviders(<RouterProvider router={router} />)

    expect(screen.getByRole('button', { name: 'অসমীয়া' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )

    await userEvent.click(screen.getByRole('button', { name: 'हिन्दी' }))

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/hi/sos')
    })
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe('hi')
    expect(i18n.resolvedLanguage).toBe('hi')
  })
})
