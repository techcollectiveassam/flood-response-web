import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { i18n } from '@/lib/i18n/i18n'
import { renderWithProviders, screen } from '@/testing/test-utils'
import type { CreateAffectedAreaResult } from '../../../api/create-affected-area-report'
import { ReportSubmitted } from './report-submitted'

const result: CreateAffectedAreaResult = {
  affected_area: {
    ref_id: '3f2a9c1e-7b4d-4e2a-9c1e-5d6f7a8b9c0d',
    disaster_ref_id: '5f2a9c1e-7b4d-4e2a-9c1e-5d6f7a8b9c0d',
    latitude: 26.7509,
    longitude: 94.2037,
    severity: 'high',
    verification_status: 'reported',
    report_count: 1,
  },
  report: {
    ref_id: '4f2a9c1e-7b4d-4e2a-9c1e-5d6f7a8b9c0d',
    severity: 'high',
    location: {
      source: 'gps',
      latitude: 26.7509,
      longitude: 94.2037,
    },
    created_at: '2026-11-22T00:00:00Z',
  },
  is_new_area: true,
  confidence: 0,
  match_reason: 'none',
}

const originalClipboard = Object.getOwnPropertyDescriptor(
  navigator,
  'clipboard',
)
const writeText = vi.fn().mockResolvedValue(undefined)

function renderSubmitted({
  value = result,
  onDone = vi.fn(),
  onReportAnother = vi.fn(),
}: {
  value?: CreateAffectedAreaResult
  onDone?: () => void
  onReportAnother?: () => void
} = {}) {
  return renderWithProviders(
    <MemoryRouter>
      <ReportSubmitted
        result={value}
        onDone={onDone}
        onReportAnother={onReportAnother}
      />
    </MemoryRouter>,
  )
}

describe('ReportSubmitted', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en')
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })
  })

  afterEach(() => {
    writeText.mockReset()

    if (originalClipboard) {
      Object.defineProperty(navigator, 'clipboard', originalClipboard)
    } else {
      Reflect.deleteProperty(navigator, 'clipboard')
    }
  })

  it('focuses the heading and shows the report id and status timeline', () => {
    renderSubmitted()

    expect(
      screen.getByRole('heading', { level: 1, name: 'Report submitted' }),
    ).toHaveFocus()
    expect(
      screen.getByText('3f2a9c1e-7b4d-4e2a-9c1e-5d6f7a8b9c0d'),
    ).toBeInTheDocument()
    expect(screen.getByText(/Sent to Command Center/)).toBeInTheDocument()
    expect(screen.getByText('Under verification')).toBeInTheDocument()
    expect(screen.getByText('In progress')).toBeInTheDocument()
    expect(screen.getByText('Verified')).toBeInTheDocument()
    expect(screen.getAllByText('Pending')).toHaveLength(2)
    expect(screen.getByText('Action taken')).toBeInTheDocument()
  })

  it('copies the report id', async () => {
    renderSubmitted()

    await userEvent.click(
      screen.getByRole('button', {
        name: 'Copy report ID 3f2a9c1e-7b4d-4e2a-9c1e-5d6f7a8b9c0d',
      }),
    )

    expect(writeText).toHaveBeenCalledWith(
      '3f2a9c1e-7b4d-4e2a-9c1e-5d6f7a8b9c0d',
    )
    expect(screen.getByText('Copied to clipboard')).toBeInTheDocument()
  })

  it('runs the done and report-another actions', async () => {
    const onDone = vi.fn()
    const onReportAnother = vi.fn()

    renderSubmitted({ onDone, onReportAnother })

    await userEvent.click(screen.getByRole('button', { name: 'Done' }))
    await userEvent.click(
      screen.getByRole('button', { name: 'Report another area' }),
    )

    expect(onDone).toHaveBeenCalledTimes(1)
    expect(onReportAnother).toHaveBeenCalledTimes(1)
  })

  it('completes verification for a verified area', () => {
    renderSubmitted({
      value: {
        ...result,
        affected_area: {
          ...result.affected_area,
          verification_status: 'verified',
        },
      },
    })

    expect(screen.queryByText('In progress')).not.toBeInTheDocument()
    expect(screen.getByText('Verified')).toBeInTheDocument()
    expect(screen.getByText('Pending')).toBeInTheDocument()
  })
})
