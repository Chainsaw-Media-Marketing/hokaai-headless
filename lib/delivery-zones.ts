export const LOCAL_POSTAL_CODES: readonly string[] = [
  "0002",
  "0022",
  "0042",
  "0043",
  "0059",
  "0060",
  "0076",
  "0081",
  "0083",
  "0084",
  "0101",
  "0149",
  "0154",
  "0157",
  "0169",
  "0181",
  "0182",
  "0184",
  "0186",
  "1692",
]

export function isValidPostalCode(code: string): boolean {
  return /^\d{4}$/.test(code.trim())
}

export function isLocalPostalCode(code: string): boolean {
  const trimmed = code.trim()
  return isValidPostalCode(trimmed) && LOCAL_POSTAL_CODES.includes(trimmed)
}
