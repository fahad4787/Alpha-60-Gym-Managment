import type { Timestamp } from 'firebase/firestore'

export type MemberPayment = {
  id: string
  monthKey: string
  memberId: string
  paid: boolean
  updatedAt: Timestamp
}

export type PaymentMarkInput = {
  monthKey: string
  memberId: string
  paid: boolean
}
