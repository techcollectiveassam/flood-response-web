import { UserPlus } from 'lucide-react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { renderWithProviders, screen } from '@/testing/test-utils'
import type { DesktopHeaderNavItem } from './desktop-header-nav-config'
import { DesktopHeaderNav } from './desktop-header-nav'

const sosItem: DesktopHeaderNavItem = {
  labelKey: 'desktopHeader.volunteer',
  to: '/sos',
  icon: UserPlus,
}

function renderNav(items: DesktopHeaderNavItem[], initialEntry: string) {
  const router = createMemoryRouter(
    [
      {
        path: '/:lang/*',
        element: <DesktopHeaderNav items={items} />,
      },
    ],
    { initialEntries: [initialEntry] },
  )

  renderWithProviders(<RouterProvider router={router} />)

  return router
}

describe('DesktopHeaderNav', () => {
  it('marks the link for the current page', () => {
    renderNav([sosItem], '/en/sos')

    expect(screen.getByRole('link', { name: 'Volunteer' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('does not mark the link for a different page', () => {
    renderNav([sosItem], '/en/faq')

    expect(screen.getByRole('link', { name: 'Volunteer' })).not.toHaveAttribute(
      'aria-current',
    )
  })

  it('matches a root destination only on the locale index', () => {
    renderNav([{ ...sosItem, to: '/' }], '/en')

    expect(screen.getByRole('link', { name: 'Volunteer' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('does not match a root destination on nested pages', () => {
    renderNav([{ ...sosItem, to: '/' }], '/en/sos')

    expect(screen.getByRole('link', { name: 'Volunteer' })).not.toHaveAttribute(
      'aria-current',
    )
  })

  it('never marks placeholder destinations', () => {
    renderNav([{ ...sosItem, to: '#' }], '/en/sos')

    expect(screen.getByRole('link', { name: 'Volunteer' })).not.toHaveAttribute(
      'aria-current',
    )
  })
})
