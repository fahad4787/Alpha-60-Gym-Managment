import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore'
import { getDb } from '@/lib/firebase'
import { invalidateMembersListCache, withMembersListCache } from '@/lib/firestoreListCache'
import { PROGRAMS, type ProgramId } from '@/config/programs'
import type { Member, MemberCreateInput, MemberStatus } from '@/features/members/types'

type MemberDoc = {
  fullName: string
  phone: string | null
  email: string | null
  enrollDate: unknown
  fees: number | null
  age: number | null
  programs: ProgramId[]
  notes: string | null
  status: MemberStatus
  createdAt: unknown
}

const MEMBERS_COLLECTION = 'members'

export async function listMembers(opts?: { take?: number }): Promise<Member[]> {
  const take = opts?.take ?? 200
  return withMembersListCache(take, async () => {
    const q = query(
      collection(getDb(), MEMBERS_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(take),
    )
    const snap = await getDocs(q)
    return snap.docs
      .map((d) => toMember(d.id, d.data() as MemberDoc))
      .filter((m): m is Member => !!m)
  })
}

export async function createMember(input: MemberCreateInput) {
  const ref = doc(collection(getDb(), MEMBERS_COLLECTION))
  const payload: Omit<MemberDoc, 'createdAt'> & { createdAt: unknown } = {
    fullName: input.fullName.trim(),
    phone: input.phone.trim(),
    email: input.email?.trim() ? input.email.trim().toLowerCase() : null,
    enrollDate: Timestamp.fromDate(parseDateOnlyToUtcDate(input.enrollDate)),
    fees: Number.isFinite(input.fees) ? input.fees : null,
    age: typeof input.age === 'number' && Number.isFinite(input.age) ? input.age : null,
    programs: sanitizePrograms(input.programs),
    notes: input.notes?.trim() ? input.notes.trim() : null,
    status: input.status ?? 'active',
    createdAt: Timestamp.now(),
  }
  await setDoc(ref, payload)
  invalidateMembersListCache()
  return ref.id
}

export async function updateMember(id: string, input: MemberCreateInput) {
  const ref = doc(getDb(), MEMBERS_COLLECTION, id)
  const payload: Partial<MemberDoc> = {
    fullName: input.fullName.trim(),
    phone: input.phone.trim(),
    email: input.email?.trim() ? input.email.trim().toLowerCase() : null,
    enrollDate: Timestamp.fromDate(parseDateOnlyToUtcDate(input.enrollDate)),
    fees: Number.isFinite(input.fees) ? input.fees : null,
    age: typeof input.age === 'number' && Number.isFinite(input.age) ? input.age : null,
    programs: sanitizePrograms(input.programs),
    notes: input.notes?.trim() ? input.notes.trim() : null,
    status: input.status ?? 'active',
  }
  await updateDoc(ref, payload)
  invalidateMembersListCache()
}

export async function deleteMember(id: string) {
  const ref = doc(getDb(), MEMBERS_COLLECTION, id)
  await deleteDoc(ref)
  invalidateMembersListCache()
}

function toMember(id: string, raw: MemberDoc): Member | null {
  if (!raw || typeof raw.fullName !== 'string') return null
  if (raw.status !== 'active' && raw.status !== 'inactive') return null

  const createdAt = raw.createdAt as Member['createdAt']
  if (!createdAt) return null

  return {
    id,
    fullName: raw.fullName,
    phone: raw.phone ?? null,
    email: raw.email ?? null,
    enrollDate: (raw.enrollDate as Member['enrollDate']) ?? null,
    fees: typeof raw.fees === 'number' ? raw.fees : null,
    age: typeof raw.age === 'number' ? raw.age : null,
    programs: sanitizePrograms(raw.programs),
    notes: raw.notes ?? null,
    status: raw.status,
    createdAt,
  }
}

function sanitizePrograms(input: unknown): ProgramId[] {
  const allowed = new Set<ProgramId>(PROGRAMS.map((p) => p.id))
  if (!Array.isArray(input)) return []
  const values = input.filter((x): x is ProgramId => typeof x === 'string' && allowed.has(x as ProgramId))
  return Array.from(new Set(values))
}

function parseDateOnlyToUtcDate(value: string) {
  const [y, m, d] = value.split('-').map((x) => Number(x))
  const date = new Date(Date.UTC(y, m - 1, d))
  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid enroll date')
  }
  return date
}

