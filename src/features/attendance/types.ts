import type { Timestamp } from 'firebase/firestore'

export type Attendance = {
  id: string
  dateKey: string
  memberId: string
  present: boolean
  checkedAt: Timestamp
}

export type AttendanceMarkInput = {
  dateKey: string
  memberId: string
  present: boolean
}

