import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { i18n } from '@/lib/i18n/i18n'
import { fireEvent, renderWithProviders, screen } from '@/testing/test-utils'
import type { Sos } from '../api/create-sos-request'
import { SosConfirmation } from './sos-confirmation'

const locationSos: Sos = {
  tracking_id: '123e4567-e89b-12d3-a456-426614174000',
  status: 'reported',
  report_count: 1,
  created_at: '2026-11-13T00:00:00Z',
  location: {
    latitude: 26.7509,
    longitude: 94.2037,
  },
}

const mobileSos: Sos = {
  ...locationSos,
  tracking_id: '223e4567-e89b-12d3-a456-426614174000',
  location: null,
  reporter_mobile: '9800000000',
}

function renderConfirmation(sos: Sos, onReset = vi.fn()) {
  return renderWithProviders(
    <MemoryRouter initialEntries={['/en/sos/new']}>
      <SosConfirmation sos={sos} onReset={onReset} />
    </MemoryRouter>,
  )
}

describe('SosConfirmation', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
  })

  it('shows the sent state with coordinates and the reference number', () => {
    renderConfirmation(locationSos)

    expect(screen.getByRole('heading', { name: 'SOS Sent' })).toHaveFocus()
    expect(
      screen.getByText(
        'Your SOS and location have been sent to the Command Center.',
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Coordinates: 26.7509° N, 94.2037° E'),
    ).toBeInTheDocument()
    expect(screen.getByText(locationSos.tracking_id)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Done' })).toHaveAttribute(
      'href',
      '/en/sos',
    )
  })

  it('uses the mobile message when no location was sent', () => {
    renderConfirmation(mobileSos)

    expect(
      screen.getByText(
        'Your SOS has been sent to the Command Center with your mobile number.',
      ),
    ).toBeInTheDocument()
    expect(screen.queryByText(/^Coordinates:/)).not.toBeInTheDocument()
  })

  it('resets to the form when sending another SOS', () => {
    const onReset = vi.fn()
    renderConfirmation(mobileSos, onReset)

    fireEvent.click(screen.getByRole('button', { name: 'Send another SOS' }))

    expect(onReset).toHaveBeenCalledTimes(1)
  })

  describe('copy reference number', () => {
    const originalClipboard = Object.getOwnPropertyDescriptor(
      navigator,
      'clipboard',
    )

    afterEach(() => {
      if (originalClipboard) {
        Object.defineProperty(navigator, 'clipboard', originalClipboard)
      } else {
        Reflect.deleteProperty(navigator, 'clipboard')
      }
    })

    it('copies the tracking id and confirms it', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined)

      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: { writeText },
      })

      renderConfirmation(locationSos)

      fireEvent.click(
        screen.getByRole('button', { name: 'Copy reference number' }),
      )

      expect(writeText).toHaveBeenCalledWith(locationSos.tracking_id)
      expect(await screen.findByText('Copied')).toBeInTheDocument()
    })
  })
})
