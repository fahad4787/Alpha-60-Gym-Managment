import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Member, MemberCreateInput } from '@/features/members/types'
import { createMember, deleteMember, listMembers, updateMember } from '@/features/members/membersRepo'
import { invalidateMembersListCache } from '@/lib/firestoreListCache'

type MembersState = {
  items: Member[]
  isLoading: boolean
  error: string | null
}

export function useMembers() {
  const [state, setState] = useState<MembersState>({
    items: [],
    isLoading: true,
    error: null,
  })

  const refresh = useCallback(async () => {
    invalidateMembersListCache()
    setState((s) => ({ ...s, isLoading: true, error: null }))
    try {
      const items = await listMembers()
      setState({ items, isLoading: false, error: null })
    } catch (e) {
      setState((s) => ({
        ...s,
        isLoading: false,
        error: toErrorMessage(e),
      }))
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const addMember = useCallback(async (input: MemberCreateInput) => {
    await createMember(input)
    await refresh()
  }, [refresh])

  const editMember = useCallback(async (id: string, input: MemberCreateInput) => {
    await updateMember(id, input)
    await refresh()
  }, [refresh])

  const removeMember = useCallback(async (id: string) => {
    await deleteMember(id)
    await refresh()
  }, [refresh])

  return useMemo(
    () => ({
      ...state,
      refresh,
      addMember,
      editMember,
      removeMember,
    }),
    [state, refresh, addMember, editMember, removeMember],
  )
}

function toErrorMessage(error: unknown) {
  const errObj = typeof error === 'object' && error ? (error as Record<string, unknown>) : null
  const message = errObj && typeof errObj.message === 'string' ? errObj.message : ''
  return message || 'Something went wrong. Please try again.'
}

