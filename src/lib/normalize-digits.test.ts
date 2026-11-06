import { describe, expect, it } from 'vitest'
import { normalizeDigits } from './normalize-digits'

describe('normalizeDigits', () => {
  it('leaves Latin digits unchanged', () => {
    expect(normalizeDigits('0123456789')).toBe('0123456789')
  })

  it('maps Bengali digits to ASCII', () => {
    expect(normalizeDigits('০১২৩৪৫৬৭৮৯')).toBe('0123456789')
  })

  it('maps Devanagari digits to ASCII', () => {
    expect(normalizeDigits('०१२३४५६७८९')).toBe('0123456789')
  })

  it('maps mixed digit scripts', () => {
    expect(normalizeDigits('৯৮৭ abc ४५६')).toBe('987 abc 456')
  })

  it('preserves separators and search text', () => {
    expect(normalizeDigits('+৯১ (০) ১২৩-৪৫৬৭')).toBe('+91 (0) 123-4567')
    expect(normalizeDigits('Barpeta Road ১')).toBe('Barpeta Road 1')
  })
})
