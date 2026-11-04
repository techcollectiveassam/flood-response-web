import { MapPin } from 'lucide-react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { renderWithProviders, screen } from '@/testing/test-utils'
import type { MobileMenuItem } from './mobile-menu-config'
import { MobileMenuNavLink } from './mobile-menu-nav-link'

const sosItem: MobileMenuItem = {
  labelKey: 'mobileMenu.item.reportFloodedArea',
  icon: MapPin,
  to: '/sos',
}

function renderLink(item: MobileMenuItem, initialEntry: string) {
  const router = createMemoryRouter(
    [
      {
        path: '/:lang/*',
        element: <MobileMenuNavLink item={item} />,
      },
    ],
    { initialEntries: [initialEntry] },
  )

  renderWithProviders(<RouterProvider router={router} />)

  return router
}

describe('MobileMenuNavLink', () => {
  it('marks the link for the current page', () => {
    renderLink(sosItem, '/en/sos')

    expect(screen.getByRole('link', { name: 'Report Flooded Area' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('marks the link for a nested page under the destination', () => {
    renderLink(sosItem, '/en/sos/new')

    expect(screen.getByRole('link', { name: 'Report Flooded Area' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('does not mark the link for a different page', () => {
    renderLink(sosItem, '/en/faq')

    expect(screen.getByRole('link', { name: 'Report Flooded Area' })).not.toHaveAttribute(
      'aria-current',
    )
  })

  it('never marks placeholder destinations', () => {
    renderLink({ ...sosItem, to: '#' }, '/en/sos')

    expect(screen.getByRole('link', { name: 'Report Flooded Area' })).not.toHaveAttribute(
      'aria-current',
    )
  })
})
