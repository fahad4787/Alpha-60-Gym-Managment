import { useCallback, useEffect, useMemo, useState } from 'react'
import { Timestamp } from 'firebase/firestore'
import type { Attendance } from '@/features/attendance/types'
import { listAttendanceByDate, markAttendance } from '@/features/attendance/attendanceRepo'
import { invalidateAttendanceCache } from '@/lib/firestoreListCache'

type AttendanceState = {
  items: Attendance[]
  isLoading: boolean
  error: string | null
}

export function useAttendance(dateKey: string) {
  const [state, setState] = useState<AttendanceState>({
    items: [],
    isLoading: true,
    error: null,
  })

  const refresh = useCallback(async () => {
    invalidateAttendanceCache(dateKey)
    setState((s) => ({ ...s, isLoading: true, error: null }))
    try {
      const items = await listAttendanceByDate(dateKey)
      setState({ items, isLoading: false, error: null })
    } catch (e) {
      setState((s) => ({
        ...s,
        isLoading: false,
        error: toErrorMessage(e),
      }))
    }
  }, [dateKey])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const setPresent = useCallback(async (memberId: string, present: boolean) => {
    let previous: Attendance[] = []
    const next: Attendance = {
      id: `${dateKey}_${memberId}`,
      dateKey,
      memberId,
      present,
      checkedAt: Timestamp.now(),
    }

    setState((s) => {
      previous = s.items
      const without = s.items.filter((x) => x.memberId !== memberId)
      return { ...s, items: [next, ...without], error: null }
    })

    try {
      await markAttendance({ dateKey, memberId, present })
    } catch (e) {
      setState((s) => ({ ...s, items: previous, error: toErrorMessage(e) }))
    }
  }, [dateKey])

  const byMemberId = useMemo(() => {
    const map = new Map<string, Attendance>()
    for (const a of state.items) map.set(a.memberId, a)
    return map
  }, [state.items])

  return useMemo(
    () => ({
      ...state,
      refresh,
      setPresent,
      byMemberId,
    }),
    [state, refresh, setPresent, byMemberId],
  )
}

function toErrorMessage(error: unknown) {
  const errObj = typeof error === 'object' && error ? (error as Record<string, unknown>) : null
  const message = errObj && typeof errObj.message === 'string' ? errObj.message : ''
  return message || 'Something went wrong. Please try again.'
}

