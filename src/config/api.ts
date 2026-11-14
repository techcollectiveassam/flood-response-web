export function getSosDisasterId(): number | null {
  const raw = import.meta.env.VITE_DISASTER_ID

  if (raw === undefined || raw === '') {
    return null
  }

  const disasterId = Number(raw)

  return Number.isInteger(disasterId) && disasterId > 0 ? disasterId : null
}
