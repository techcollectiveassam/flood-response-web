import { describe, expect, it } from 'vitest'
import {
  compareText,
  formatCurrency,
  formatDate,
  formatIdentifier,
  formatList,
  formatNumber,
  formatRelativeTime,
} from './formatters'

describe('Intl formatters', () => {
  it('uses explicit locale numbering systems', () => {
    expect(formatNumber(123, 'en')).toBe('123')
    expect(formatNumber(123, 'as')).toBe('১২৩')
    expect(formatNumber(123, 'bn')).toBe('১২৩')
    expect(formatNumber(123, 'hi')).toBe('१२३')
  })

  it('formats currency with locale numerals', () => {
    expect(formatCurrency(1000, 'en')).toContain('1,000')
    expect(formatCurrency(1000, 'as')).toMatch(/[০-৯]/)
    expect(formatCurrency(1000, 'hi')).toMatch(/[०-९]/)
  })

  it('formats dates with locale numerals', () => {
    const date = new Date(2026, 0, 15)

    expect(formatDate(date, 'as')).toMatch(/[০-৯]/)
    expect(formatDate(date, 'hi')).toMatch(/[०-९]/)
  })

  it('formats relative time with locale numerals', () => {
    const now = new Date(2026, 0, 15, 12, 0, 0)

    expect(
      formatRelativeTime(now.getTime() - 10 * 60_000, 'as', {
        now,
        unit: 'minute',
      }),
    ).toMatch(/[০-৯]/)

    expect(
      formatRelativeTime(now.getTime() - 10 * 60_000, 'hi', {
        now,
        unit: 'minute',
      }),
    ).toMatch(/[०-९]/)
  })

  it('formats an explicit quarter offset from the yearly unit', () => {
    const now = new Date(2026, 0, 15, 12, 0, 0)

    expect(
      formatRelativeTime(now.getTime() - 2 * 7_889_400_000, 'en', {
        now,
        unit: 'quarter',
      }),
    ).toBe('2 quarters ago')
  })

  it('formats lists and compares text', () => {
    expect(formatList(['a', 'b'], 'en')).toBe('a and b')
    expect(formatList(['ক', 'খ'], 'as')).toContain('আৰু')
    expect(compareText('a', 'b', 'en')).toBeLessThan(0)
  })

  it('leaves identifiers as plain strings', () => {
    expect(formatIdentifier('98******12')).toBe('98******12')
    expect(formatIdentifier('SOS-2026-001')).toBe('SOS-2026-001')
  })
})
