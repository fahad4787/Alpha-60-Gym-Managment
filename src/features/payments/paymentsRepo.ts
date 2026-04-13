import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  where,
} from 'firebase/firestore'
import { getDb } from '@/lib/firebase'
import { invalidatePaymentsCache, withPaymentsListCache } from '@/lib/firestoreListCache'
import type { MemberPayment, PaymentMarkInput } from '@/features/payments/types'

type PaymentDoc = {
  monthKey: string
  memberId: string
  paid: boolean
  updatedAt: unknown
}

const PAYMENTS_COLLECTION = 'memberPayments'

export async function listPaymentsByMonth(monthKey: string): Promise<MemberPayment[]> {
  return withPaymentsListCache(monthKey, async () => {
    const q = query(
      collection(getDb(), PAYMENTS_COLLECTION),
      where('monthKey', '==', monthKey),
    )
    const snap = await getDocs(q)
    return snap.docs
      .map((d) => toPayment(d.id, d.data() as PaymentDoc))
      .filter((x): x is MemberPayment => !!x)
  })
}

export async function setPaymentStatus(input: PaymentMarkInput) {
  const id = `${input.monthKey}_${input.memberId}`
  const ref = doc(getDb(), PAYMENTS_COLLECTION, id)
  const payload: PaymentDoc = {
    monthKey: input.monthKey,
    memberId: input.memberId,
    paid: input.paid,
    updatedAt: Timestamp.now(),
  }
  await setDoc(ref, payload, { merge: true })
  invalidatePaymentsCache(input.monthKey)
}

function toPayment(id: string, raw: PaymentDoc): MemberPayment | null {
  if (!raw || typeof raw.monthKey !== 'string' || typeof raw.memberId !== 'string') return null
  if (typeof raw.paid !== 'boolean') return null
  const updatedAt = raw.updatedAt as MemberPayment['updatedAt']
  if (!updatedAt) return null
  return {
    id,
    monthKey: raw.monthKey,
    memberId: raw.memberId,
    paid: raw.paid,
    updatedAt,
  }
}
