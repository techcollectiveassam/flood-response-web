import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@/testing/test-utils'
import { ReportDraftProvider } from './report-draft-provider'
import { useReportDraft } from './report-draft-context'

function DraftProbe() {
  const {
    draft,
    updateLocation,
    updateSituation,
    updateReporter,
    resetDraft,
  } = useReportDraft()

  return (
    <div>
      <output data-testid="location-method">
        {draft.location.method ?? 'none'}
      </output>
      <output data-testid="location-query">
        {draft.location.query ?? 'none'}
      </output>
      <output data-testid="severity">
        {draft.situation.severity ?? 'none'}
      </output>
      <output data-testid="details">
        {draft.situation.details ?? 'none'}
      </output>
      <output data-testid="reporter-name">
        {draft.reporter.name ?? 'none'}
      </output>
      <output data-testid="reporter-mobile">
        {draft.reporter.mobile ?? 'none'}
      </output>

      <button
        type="button"
        onClick={() =>
          updateLocation({ method: 'search', query: 'Kamalabari' })
        }
      >
        Set location
      </button>
      <button
        type="button"
        onClick={() =>
          updateSituation({
            severity: 'urgent',
            details: 'Stranded family',
          })
        }
      >
        Set situation
      </button>
      <button
        type="button"
        onClick={() =>
          updateReporter({
            name: 'Anjali Das',
            mobile: '9800000012',
          })
        }
      >
        Set reporter
      </button>
      <button type="button" onClick={resetDraft}>
        Reset draft
      </button>
    </div>
  )
}

function renderDraftProbe() {
  render(
    <ReportDraftProvider>
      <DraftProbe />
    </ReportDraftProvider>,
  )
}

describe('ReportDraftProvider', () => {
  it('starts with the default location method', () => {
    renderDraftProbe()

    expect(screen.getByTestId('location-method')).toHaveTextContent('device')
    expect(screen.getByTestId('location-query')).toHaveTextContent('none')
    expect(screen.getByTestId('severity')).toHaveTextContent('none')
    expect(screen.getByTestId('details')).toHaveTextContent('none')
  })

  it('keeps location data when situation data is added', async () => {
    renderDraftProbe()

    await userEvent.click(screen.getByRole('button', { name: 'Set location' }))
    await userEvent.click(screen.getByRole('button', { name: 'Set situation' }))

    expect(screen.getByTestId('location-method')).toHaveTextContent('search')
    expect(screen.getByTestId('location-query')).toHaveTextContent(
      'Kamalabari',
    )
    expect(screen.getByTestId('severity')).toHaveTextContent('urgent')
    expect(screen.getByTestId('details')).toHaveTextContent(
      'Stranded family',
    )
  })

  it('stores and resets reporter contact details', async () => {
    renderDraftProbe()

    await userEvent.click(screen.getByRole('button', { name: 'Set reporter' }))

    expect(screen.getByTestId('reporter-name')).toHaveTextContent(
      'Anjali Das',
    )
    expect(screen.getByTestId('reporter-mobile')).toHaveTextContent(
      '9800000012',
    )

    await userEvent.click(screen.getByRole('button', { name: 'Reset draft' }))

    expect(screen.getByTestId('reporter-name')).toHaveTextContent('none')
    expect(screen.getByTestId('reporter-mobile')).toHaveTextContent('none')
  })

  it('resets all draft data', async () => {
    renderDraftProbe()

    await userEvent.click(screen.getByRole('button', { name: 'Set location' }))
    await userEvent.click(screen.getByRole('button', { name: 'Set situation' }))
    await userEvent.click(screen.getByRole('button', { name: 'Reset draft' }))

    expect(screen.getByTestId('location-method')).toHaveTextContent('device')
    expect(screen.getByTestId('location-query')).toHaveTextContent('none')
    expect(screen.getByTestId('severity')).toHaveTextContent('none')
    expect(screen.getByTestId('details')).toHaveTextContent('none')
  })
})
