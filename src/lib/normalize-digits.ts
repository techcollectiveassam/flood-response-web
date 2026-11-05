const DIGIT_MAP: Record<string, string> = {}

for (let digit = 0; digit <= 9; digit += 1) {
  const ascii = String(digit)
  DIGIT_MAP[String.fromCharCode(0x09e6 + digit)] = ascii
  DIGIT_MAP[String.fromCharCode(0x0966 + digit)] = ascii
  DIGIT_MAP[ascii] = ascii
}

const NON_ASCII_DIGITS = /[\u09e6-\u09ef\u0966-\u096f]/g

export function normalizeDigits(input: string): string {
  return input.replace(NON_ASCII_DIGITS, (digit) => DIGIT_MAP[digit] ?? digit)
}
