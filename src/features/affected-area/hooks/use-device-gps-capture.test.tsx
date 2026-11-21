import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, render, screen } from '@/testing/test-utils'
import { ReportDraftProvider } from '../contexts/report-draft-provider'
import { useReportDraft } from '../contexts/report-draft-context'
import { useDeviceGpsCapture } from './use-device-gps-capture'

const originalGeolocation = Object.getOwnPropertyDescriptor(
  navigator,
  'geolocation',
)

function stubGeolocation(
  onRequest: (success: PositionCallback) => void,
) {
  Object.defineProperty(navigator, 'geolocation', {
    configurable: true,
    value: {
      getCurrentPosition: vi.fn((success: PositionCallback) => {
        onRequest(success)
      }),
    },
  })
}

function GpsCaptureProbe() {
  const { draft, updateLocation } = useReportDraft()
  const { requestGps, coordinates } = useDeviceGpsCapture()

  return (
    <div>
      <output data-testid="method">{draft.location.method}</output>
      <output data-testid="coordinates">
        {coordinates
          ? `${coordinates.latitude},${coordinates.longitude}`
          : 'none'}
      </output>
      <button type="button" onClick={requestGps}>
        Start GPS
      </button>
      <button
        type="button"
        onClick={() => updateLocation({ method: 'search' })}
      >
        Select search
      </button>
    </div>
  )
}

function renderProbe() {
  render(
    <ReportDraftProvider>
      <GpsCaptureProbe />
    </ReportDraftProvider>,
  )
}

describe('useDeviceGpsCapture', () => {
  afterEach(() => {
    if (originalGeolocation) {
      Object.defineProperty(navigator, 'geolocation', originalGeolocation)
    } else {
      Reflect.deleteProperty(navigator, 'geolocation')
    }
  })

  it('stores coordinates when the method has not changed', async () => {
    let successCallback: PositionCallback | undefined

    stubGeolocation((success) => {
      successCallback = success
    })
    renderProbe()

    await userEvent.click(screen.getByRole('button', { name: 'Start GPS' }))

    act(() => {
      successCallback?.({
        coords: {
          latitude: 26.2,
          longitude: 91.8,
          accuracy: 8,
        },
      } as GeolocationPosition)
    })

    expect(screen.getByTestId('method')).toHaveTextContent('device')
    expect(screen.getByTestId('coordinates')).toHaveTextContent('26.2,91.8')
  })

  it('discards coordinates when the method changes during capture', async () => {
    let successCallback: PositionCallback | undefined

    stubGeolocation((success) => {
      successCallback = success
    })
    renderProbe()

    await userEvent.click(screen.getByRole('button', { name: 'Start GPS' }))
    await userEvent.click(
      screen.getByRole('button', { name: 'Select search' }),
    )

    act(() => {
      successCallback?.({
        coords: {
          latitude: 26.2,
          longitude: 91.8,
          accuracy: 8,
        },
      } as GeolocationPosition)
    })

    expect(screen.getByTestId('method')).toHaveTextContent('search')
    expect(screen.getByTestId('coordinates')).toHaveTextContent('none')
  })
})
