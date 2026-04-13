import { useCallback, useEffect, useMemo, useState } from 'react'
import { Timestamp } from 'firebase/firestore'
import type { MemberPayment } from '@/features/payments/types'
import { listPaymentsByMonth, setPaymentStatus } from '@/features/payments/paymentsRepo'
import { invalidatePaymentsCache } from '@/lib/firestoreListCache'

type PaymentsState = {
  items: MemberPayment[]
  isLoading: boolean
  error: string | null
}

export function usePayments(monthKey: string) {
  const [state, setState] = useState<PaymentsState>({
    items: [],
    isLoading: true,
    error: null,
  })

  const refresh = useCallback(async () => {
    invalidatePaymentsCache(monthKey)
    setState((s) => ({ ...s, isLoading: true, error: null }))
    try {
      const items = await listPaymentsByMonth(monthKey)
      setState({ items, isLoading: false, error: null })
    } catch (e) {
      setState((s) => ({
        ...s,
        isLoading: false,
        error: toErrorMessage(e),
      }))
    }
  }, [monthKey])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const setPaid = useCallback(async (memberId: string, paid: boolean) => {
    let previous: MemberPayment[] = []
    const next: MemberPayment = {
      id: `${monthKey}_${memberId}`,
      monthKey,
      memberId,
      paid,
      updatedAt: Timestamp.now(),
    }

    setState((s) => {
      previous = s.items
      const without = s.items.filter((x) => x.memberId !== memberId)
      return { ...s, items: [next, ...without], error: null }
    })

    try {
      await setPaymentStatus({ monthKey, memberId, paid })
    } catch (e) {
      setState((s) => ({ ...s, items: previous, error: toErrorMessage(e) }))
    }
  }, [monthKey])

  const byMemberId = useMemo(() => {
    const map = new Map<string, MemberPayment>()
    for (const p of state.items) map.set(p.memberId, p)
    return map
  }, [state.items])

  return useMemo(
    () => ({
      ...state,
      refresh,
      setPaid,
      byMemberId,
    }),
    [state, refresh, setPaid, byMemberId],
  )
}

function toErrorMessage(error: unknown) {
  const errObj = typeof error === 'object' && error ? (error as Record<string, unknown>) : null
  const message = errObj && typeof errObj.message === 'string' ? errObj.message : ''
  return message || 'Something went wrong. Please try again.'
}
