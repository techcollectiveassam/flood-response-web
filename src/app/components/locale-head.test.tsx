import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { renderWithProviders, waitFor } from '@/testing/test-utils'
import { i18n } from '@/lib/i18n/i18n'
import { LocaleHead } from './locale-head'

describe('LocaleHead', () => {
  it('renders localized metadata and alternate language links', async () => {
    await i18n.changeLanguage('as')

    renderWithProviders(
      <MemoryRouter initialEntries={['/as/sos?status=open']}>
        <LocaleHead />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(document.documentElement.lang).toBe('as')
    })

    expect(document.title).toBe('ফ্লাড ৰেস্পন্স')

    const canonical = document.head.querySelector('link[rel="canonical"]')
    expect(canonical).not.toBeNull()
    expect(canonical?.getAttribute('href')).toBe(
      `${window.location.origin}/as/sos?status=open`,
    )

    const alternates = Array.from(
      document.head.querySelectorAll('link[rel="alternate"]'),
    )
    const alternateByLocale = new Map(
      alternates.map((link) => [link.getAttribute('hreflang'), link]),
    )

    expect(alternateByLocale.get('hi')?.getAttribute('href')).toBe(
      `${window.location.origin}/hi/sos?status=open`,
    )
    expect(alternateByLocale.get('x-default')?.getAttribute('href')).toBe(
      `${window.location.origin}/en/sos?status=open`,
    )
  })
})
