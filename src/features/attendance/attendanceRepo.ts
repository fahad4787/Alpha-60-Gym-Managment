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
import { invalidateAttendanceCache, withAttendanceListCache } from '@/lib/firestoreListCache'
import type { Attendance, AttendanceMarkInput } from '@/features/attendance/types'

type AttendanceDoc = {
  dateKey: string
  memberId: string
  present: boolean
  checkedAt: unknown
}

const ATTENDANCE_COLLECTION = 'attendance'

export async function listAttendanceByDate(dateKey: string): Promise<Attendance[]> {
  return withAttendanceListCache(dateKey, async () => {
    const q = query(
      collection(getDb(), ATTENDANCE_COLLECTION),
      where('dateKey', '==', dateKey),
    )
    const snap = await getDocs(q)
    return snap.docs
      .map((d) => toAttendance(d.id, d.data() as AttendanceDoc))
      .filter((x): x is Attendance => !!x)
  })
}

export async function markAttendance(input: AttendanceMarkInput) {
  const id = `${input.dateKey}_${input.memberId}`
  const ref = doc(getDb(), ATTENDANCE_COLLECTION, id)
  const payload: AttendanceDoc = {
    dateKey: input.dateKey,
    memberId: input.memberId,
    present: input.present,
    checkedAt: Timestamp.now(),
  }
  await setDoc(ref, payload, { merge: true })
  invalidateAttendanceCache(input.dateKey)
}

function toAttendance(id: string, raw: AttendanceDoc): Attendance | null {
  if (!raw || typeof raw.dateKey !== 'string' || typeof raw.memberId !== 'string') return null
  if (typeof raw.present !== 'boolean') return null
  const checkedAt = raw.checkedAt as Attendance['checkedAt']
  if (!checkedAt) return null
  return {
    id,
    dateKey: raw.dateKey,
    memberId: raw.memberId,
    present: raw.present,
    checkedAt,
  }
}

