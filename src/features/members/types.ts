import type { Timestamp } from 'firebase/firestore'
import type { ProgramId } from '@/config/programs'

export type MemberStatus = 'active' | 'inactive'

export type Member = {
  id: string
  fullName: string
  phone?: string | null
  email?: string | null
  enrollDate?: Timestamp | null
  fees?: number | null
  age?: number | null
  programs: ProgramId[]
  notes?: string | null
  status: MemberStatus
  createdAt: Timestamp
}

export type MemberCreateInput = {
  fullName: string
  phone: string
  email?: string
  enrollDate: string
  fees: number
  age?: number
  programs?: ProgramId[]
  notes?: string
  status?: MemberStatus
}

