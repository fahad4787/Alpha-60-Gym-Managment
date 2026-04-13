const DEFAULT_TTL_MS = 12_000

type Timed<T> = { value: T; until: number }

const membersByTake = new Map<number, Timed<unknown>>()
const attendanceByDate = new Map<string, Timed<unknown>>()
const paymentsByMonth = new Map<string, Timed<unknown>>()

export async function withMembersListCache<T>(take: number, fetcher: () => Promise<T>): Promise<T> {
  const now = Date.now()
  const hit = membersByTake.get(take) as Timed<T> | undefined
  if (hit && now < hit.until) return hit.value
  const value = await fetcher()
  membersByTake.set(take, { value, until: now + DEFAULT_TTL_MS })
  return value
}

export function invalidateMembersListCache() {
  membersByTake.clear()
}

export async function withAttendanceListCache<T>(dateKey: string, fetcher: () => Promise<T>): Promise<T> {
  const now = Date.now()
  const hit = attendanceByDate.get(dateKey) as Timed<T> | undefined
  if (hit && now < hit.until) return hit.value
  const value = await fetcher()
  attendanceByDate.set(dateKey, { value, until: now + DEFAULT_TTL_MS })
  return value
}

export function invalidateAttendanceCache(dateKey: string) {
  attendanceByDate.delete(dateKey)
}

export async function withPaymentsListCache<T>(monthKey: string, fetcher: () => Promise<T>): Promise<T> {
  const now = Date.now()
  const hit = paymentsByMonth.get(monthKey) as Timed<T> | undefined
  if (hit && now < hit.until) return hit.value
  const value = await fetcher()
  paymentsByMonth.set(monthKey, { value, until: now + DEFAULT_TTL_MS })
  return value
}

export function invalidatePaymentsCache(monthKey: string) {
  paymentsByMonth.delete(monthKey)
}
