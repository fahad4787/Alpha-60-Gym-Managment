import { useMemo, useState } from 'react'
import { FiEdit2, FiPlus, FiRefreshCw, FiSearch, FiTrash2, FiUsers } from 'react-icons/fi'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { RowActionsMenu } from '@/components/ui/RowActionsMenu'
import { useMembers } from '@/features/members/hooks/useMembers'
import { MemberForm } from '@/features/members/components/MemberForm'
import { PROGRAMS } from '@/config/programs'
import type { Member } from '@/features/members/types'

export function MembersPage() {
  const { items, isLoading, error, refresh, addMember, editMember, removeMember } = useMembers()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selected, setSelected] = useState<Member | null>(null)

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    if (!query) return items
    return items.filter((m) => {
      return (
        m.fullName.toLowerCase().includes(query) ||
        (m.email ?? '').toLowerCase().includes(query) ||
        (m.phone ?? '').toLowerCase().includes(query)
      )
    })
  }, [items, q])

  return (
    <div className="space-y-10">
      <div
        className="opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 animate-[dashFadeUp_0.7s_ease-out_forwards]"
        style={{ animationDelay: '40ms' }}
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-200/90">
              <FiUsers size={18} aria-hidden />
              <span className="text-xs font-semibold uppercase tracking-[0.22em]">Roster</span>
            </div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
              Members
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-slate-300">
              Search by name, phone, or email. Edit programs, PKR fees, enroll dates, and notes from
              one table—add or remove members anytime.
            </p>
            <div
              className="h-px max-w-md origin-left rounded-full bg-linear-to-r from-emerald-400/70 via-sky-400/50 to-transparent motion-reduce:animate-none animate-[dashHeroLine_0.9s_ease-out_forwards]"
              style={{ animationDelay: '120ms' }}
              aria-hidden
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="secondary"
              onClick={() => void refresh()}
              disabled={isLoading}
            >
              <FiRefreshCw size={16} />
              Refresh
            </Button>
            <Button onClick={() => setOpen(true)}>
              <FiPlus size={16} />
              Add member
            </Button>
          </div>
        </div>
      </div>

      {error ? (
        <div
          className="rounded-xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-100 opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 animate-[dashFadeUp_0.55s_ease-out_forwards] [animation-fill-mode:forwards]"
          style={{ animationDelay: '80ms' }}
        >
          {error}
        </div>
      ) : null}

      <Card
        className="p-0 opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 animate-[dashFadeUp_0.65s_ease-out_forwards] [animation-fill-mode:forwards]"
        style={{ animationDelay: '100ms' }}
      >
        <div className="flex flex-col gap-3 border-b border-slate-800/60 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <FiSearch
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, phone, or email…"
              className="h-11 w-full rounded-xl border border-slate-800/70 bg-slate-950/30 pl-10 pr-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/15"
            />
          </div>
          <div className="text-sm text-slate-300">
            {isLoading ? 'Loading…' : `${filtered.length} member(s)`}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.18em] text-slate-400">
              <tr className="border-b border-slate-800/60">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Programs</th>
                <th className="px-4 py-3 font-medium">Enroll date</th>
                <th className="px-4 py-3 font-medium">Fees</th>
                <th className="px-4 py-3 font-medium">Age</th>
                <th className="px-4 py-3 font-medium">Notes</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="text-slate-200">
              {isLoading ? (
                <TableSkeleton />
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center">
                    <p className="text-sm font-medium text-slate-100">
                      No members yet
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Add your first member to get started.
                    </p>
                    <div className="mt-4 flex justify-center">
                      <Button onClick={() => setOpen(true)}>
                        <FiPlus size={16} />
                        Add member
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((m) => (
                  <tr
                    key={m.id}
                    className="border-b border-slate-900/60 hover:bg-slate-950/20"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-100">
                        {m.fullName}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {m.phone ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {m.email ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      {m.programs.length ? (
                        <div className="flex flex-wrap gap-2">
                          {m.programs.map((id) => (
                            <Badge key={id} className={programBadgeClass(id)}>
                              {PROGRAMS.find((p) => p.id === id)?.label ?? id}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {m.enrollDate ? formatDate(m.enrollDate.toDate()) : '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {typeof m.fees === 'number' ? formatPkr(m.fees) : '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {typeof m.age === 'number' ? m.age : '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      <div
                        className="max-w-[100px] truncate"
                        title={m.notes ?? undefined}
                      >
                        {m.notes ?? '—'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <RowActionsMenu
                        compact
                        items={[
                          {
                            id: 'edit',
                            label: 'Edit',
                            icon: <FiEdit2 size={16} />,
                            onSelect: () => {
                              setSelected(m)
                              setEditOpen(true)
                            },
                          },
                          {
                            id: 'delete',
                            label: 'Delete',
                            tone: 'danger',
                            icon: <FiTrash2 size={16} />,
                            onSelect: () => {
                              setSelected(m)
                              setDeleteOpen(true)
                            },
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        open={open}
        title="Add member"
        onClose={() => {
          if (saving) return
          setOpen(false)
        }}
      >
        <MemberForm
          isSubmitting={saving}
          onSubmit={async (values) => {
            setSaving(true)
            try {
              await addMember(values)
              setOpen(false)
              setQ('')
            } finally {
              setSaving(false)
            }
          }}
        />
      </Modal>

      <Modal
        open={editOpen}
        title="Edit member"
        onClose={() => {
          if (saving) return
          setEditOpen(false)
          setSelected(null)
        }}
      >
        {selected ? (
          <MemberForm
            submitLabel="Save changes"
            isSubmitting={saving}
            initialValues={toFormInitialValues(selected)}
            onSubmit={async (values) => {
              setSaving(true)
              try {
                await editMember(selected.id, values)
                setEditOpen(false)
                setSelected(null)
              } finally {
                setSaving(false)
              }
            }}
          />
        ) : null}
      </Modal>

      <Modal
        open={deleteOpen}
        title="Delete member"
        onClose={() => {
          if (saving) return
          setDeleteOpen(false)
          setSelected(null)
        }}
        footer={
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                if (saving) return
                setDeleteOpen(false)
                setSelected(null)
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              isLoading={saving}
              disabled={saving || !selected}
              onClick={async () => {
                if (!selected) return
                setSaving(true)
                try {
                  await removeMember(selected.id)
                  setDeleteOpen(false)
                  setSelected(null)
                  setQ('')
                } finally {
                  setSaving(false)
                }
              }}
            >
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-sm text-slate-300">
          Are you sure you want to delete{' '}
          <span className="font-medium text-slate-100">
            {selected?.fullName ?? 'this member'}
          </span>
          ? This cannot be undone.
        </p>
      </Modal>
    </div>
  )
}

function formatDate(d: Date) {
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
}

function formatPkr(amount: number) {
  const value = Number.isFinite(amount) ? Math.round(amount) : 0
  return `PKR ${value.toLocaleString('en-PK')}`
}

function programBadgeClass(id: (typeof PROGRAMS)[number]['id']) {
  const base = 'border-slate-800/70 bg-slate-950/20 text-slate-200'
  if (id === 'weight_loss') return 'border-emerald-400 bg-emerald-950/60 text-emerald-200 ring-1 ring-emerald-400/30'
  if (id === 'strength_conditioning') return 'border-sky-400 bg-sky-950/60 text-sky-200 ring-1 ring-sky-400/30'
  if (id === 'martial_arts') return 'border-amber-400 bg-amber-950/60 text-amber-200 ring-1 ring-amber-400/30'
  if (id === 'physiotherapy') return 'border-violet-400 bg-violet-950/60 text-violet-200 ring-1 ring-violet-400/30'
  return base
}

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function toDateOnlyString(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

function toFormInitialValues(m: Member) {
  return {
    fullName: m.fullName ?? '',
    phone: m.phone ?? '',
    enrollDate: m.enrollDate ? toDateOnlyString(m.enrollDate.toDate()) : '',
    fees: typeof m.fees === 'number' ? m.fees : NaN,
    age: typeof m.age === 'number' ? m.age : NaN,
    email: m.email ?? '',
    notes: m.notes ?? '',
    programs: PROGRAMS.reduce(
      (acc, p) => {
        acc[p.id] = m.programs.includes(p.id)
        return acc
      },
      {} as Record<(typeof PROGRAMS)[number]['id'], boolean>,
    ),
  }
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, idx) => (
        <tr key={idx} className="border-b border-slate-900/60">
          <td className="px-4 py-3">
            <div className="h-4 w-44 animate-pulse rounded bg-slate-900/70" />
          </td>
          <td className="px-4 py-3">
            <div className="h-4 w-32 animate-pulse rounded bg-slate-900/70" />
          </td>
          <td className="px-4 py-3">
            <div className="h-4 w-56 animate-pulse rounded bg-slate-900/70" />
          </td>
          <td className="px-4 py-3">
            <div className="h-4 w-52 animate-pulse rounded bg-slate-900/70" />
          </td>
          <td className="px-4 py-3">
            <div className="h-4 w-28 animate-pulse rounded bg-slate-900/70" />
          </td>
          <td className="px-4 py-3">
            <div className="h-4 w-20 animate-pulse rounded bg-slate-900/70" />
          </td>
          <td className="px-4 py-3">
            <div className="h-4 w-16 animate-pulse rounded bg-slate-900/70" />
          </td>
          <td className="px-4 py-3">
            <div className="h-9 w-36 animate-pulse rounded-xl bg-slate-900/70" />
          </td>
          <td className="px-4 py-3">
            <div className="h-4 w-64 animate-pulse rounded bg-slate-900/70" />
          </td>
        </tr>
      ))}
    </>
  )
}

