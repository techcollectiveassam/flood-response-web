import { http, HttpResponse } from 'msw'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { API_ERROR_CODES, ApiError } from '@/lib/api-error'
import { server } from '@/testing/mocks/server'
import type { ReportDraft } from '../types/report-draft'
import {
  buildAffectedAreaReportPayload,
  createAffectedAreaReport,
} from './create-affected-area-report'

function createDraft(
  overrides: Partial<ReportDraft> = {},
): ReportDraft {
  return {
    location: {
      method: 'device',
      coordinates: {
        latitude: 26.2,
        longitude: 91.8,
      },
    },
    situation: {
      severity: 'moderate',
      details: 'Family stranded near the school.',
    },
    reporter: {
      name: 'Rakesh',
      mobile: '0000000000',
    },
    ...overrides,
  }
}

describe('buildAffectedAreaReportPayload', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_DISASTER_ID', '1')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('builds a GPS payload with description and reporter details', () => {
    expect(buildAffectedAreaReportPayload(createDraft())).toEqual({
      disaster_id: 1,
      location: {
        source: 'gps',
        latitude: 26.2,
        longitude: 91.8,
      },
      severity: 'medium',
      description: 'Family stranded near the school.',
      reporter: {
        name: 'Rakesh',
        mobile: '0000000000',
      },
    })
  })

  it('maps village search to place_search', () => {
    expect(
      buildAffectedAreaReportPayload(
        createDraft({
          location: {
            method: 'search',
            coordinates: {
              latitude: 26.95,
              longitude: 94.17,
            },
          },
          situation: {
            severity: 'critical',
            details: 'Bridge submerged.',
          },
        }),
      ),
    ).toMatchObject({
      location: {
        source: 'place_search',
        latitude: 26.95,
        longitude: 94.17,
      },
      severity: 'critical',
    })
  })

  it('maps a map pin to a GeoJSON point', () => {
    expect(
      buildAffectedAreaReportPayload(
        createDraft({
          location: {
            method: 'map',
            pin: {
              latitude: 26.95,
              longitude: 94.17,
            },
          },
          situation: {
            severity: 'urgent',
          },
        }),
      ),
    ).toMatchObject({
      location: {
        source: 'map',
        geometry: {
          type: 'Point',
          coordinates: [94.17, 26.95],
        },
      },
      severity: 'high',
    })
  })

  it('maps the unknown severity to unknown', () => {
    expect(
      buildAffectedAreaReportPayload(
        createDraft({
          situation: {
            severity: 'unknown',
          },
        }),
      ),
    ).toMatchObject({
      severity: 'unknown',
    })
  })

  it('omits empty description and reporter fields', () => {
    const payload = buildAffectedAreaReportPayload(
      createDraft({
        situation: {
          severity: 'moderate',
        },
        reporter: {},
      }),
    )

    expect(payload).not.toHaveProperty('description')
    expect(payload).not.toHaveProperty('reporter')
  })

  it('requires severity', () => {
    expect(() =>
      buildAffectedAreaReportPayload(
        createDraft({
          situation: {},
        }),
      ),
    ).toThrow('Severity is required')
  })

  it('requires GPS coordinates for the device method', () => {
    expect(() =>
      buildAffectedAreaReportPayload(
        createDraft({
          location: {
            method: 'device',
          },
        }),
      ),
    ).toThrow('GPS coordinates are required')
  })

  it('requires a pin for the map method', () => {
    expect(() =>
      buildAffectedAreaReportPayload(
        createDraft({
          location: {
            method: 'map',
          },
        }),
      ),
    ).toThrow('A map pin is required')
  })

  it('rejects an invalid reporter mobile', () => {
    expect(() =>
      buildAffectedAreaReportPayload(
        createDraft({
          reporter: {
            mobile: '123',
          },
        }),
      ),
    ).toThrow()
  })

  it('requires the disaster configuration', () => {
    vi.stubEnv('VITE_DISASTER_ID', '')

    expect(() => buildAffectedAreaReportPayload(createDraft())).toThrow(
      ApiError,
    )
  })
})

const createdAffectedAreaFixture = {
  affected_area: {
    ref_id: '3f2a9c1e-7b4d-4e2a-9c1e-5d6f7a8b9c0d',
    disaster_id: 1,
    latitude: 26.2,
    longitude: 91.8,
    severity: 'medium',
    verification_status: 'reported',
    report_count: 1,
  },
  report: {
    ref_id: '4f2a9c1e-7b4d-4e2a-9c1e-5d6f7a8b9c0d',
    severity: 'medium',
    location: {
      source: 'gps',
      latitude: 26.2,
      longitude: 91.8,
    },
    reporter: {
      name: 'Rakesh',
      mobile: '0000000000',
    },
    created_at: '2026-11-22T00:00:00Z',
  },
  is_new_area: true,
  confidence: 0,
  match_reason: 'none',
} as const

describe('createAffectedAreaReport', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_DISASTER_ID', '1')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('posts the draft payload and parses the created report', async () => {
    let requestBody: unknown

    server.use(
      http.post('*/api/v1/affected-areas', async ({ request }) => {
        requestBody = await request.json()
        return HttpResponse.json(
          { data: createdAffectedAreaFixture },
          { status: 201 },
        )
      }),
    )

    const result = await createAffectedAreaReport(createDraft())

    expect(requestBody).toEqual({
      disaster_id: 1,
      location: {
        source: 'gps',
        latitude: 26.2,
        longitude: 91.8,
      },
      severity: 'medium',
      description: 'Family stranded near the school.',
      reporter: {
        name: 'Rakesh',
        mobile: '0000000000',
      },
    })
    expect(result.affected_area.ref_id).toBe(
      createdAffectedAreaFixture.affected_area.ref_id,
    )
    expect(result.report.ref_id).toBe(
      createdAffectedAreaFixture.report.ref_id,
    )
    expect(result.is_new_area).toBe(true)
  })

  it('normalizes backend errors', async () => {
    server.use(
      http.post('*/api/v1/affected-areas', () =>
        HttpResponse.json(
          {
            error: {
              code: 'invalid_request_body',
              message: 'validation error',
              details: [
                {
                  field: 'severity',
                  message: 'severity must be one of: low, medium, high, critical',
                },
              ],
            },
          },
          { status: 400 },
        ),
      ),
    )

    await expect(createAffectedAreaReport(createDraft())).rejects.toMatchObject(
      {
        name: 'ApiError',
        status: 400,
        code: 'invalid_request_body',
        fieldErrors: [
          {
            field: 'severity',
            message: 'severity must be one of: low, medium, high, critical',
          },
        ],
      },
    )
  })

  it('rejects a response that does not match the contract', async () => {
    server.use(
      http.post('*/api/v1/affected-areas', () =>
        HttpResponse.json({ data: {} }, { status: 201 }),
      ),
    )

    await expect(createAffectedAreaReport(createDraft())).rejects.toMatchObject(
      {
        name: 'ApiError',
        code: API_ERROR_CODES.VALIDATION,
      },
    )
  })
})
