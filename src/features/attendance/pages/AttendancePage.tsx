import { useMemo, useState } from 'react'
import { FiCalendar, FiRefreshCw, FiSearch } from 'react-icons/fi'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { DatePicker } from '@/components/ui/DatePicker'
import { Switch } from '@/components/ui/Switch'
import { useMembers } from '@/features/members/hooks/useMembers'
import { useAttendance } from '@/features/attendance/hooks/useAttendance'

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function todayDateOnly() {
  const d = new Date()
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

type AttendanceFilter = 'all' | 'present' | 'absent'

export function AttendancePage() {
  const [dateKey, setDateKey] = useState(todayDateOnly())
  const [q, setQ] = useState('')
  const [statusFilter, setStatusFilter] = useState<AttendanceFilter>('all')
  const { items: members, isLoading: membersLoading, error: membersError, refresh: refreshMembers } = useMembers()
  const { byMemberId, isLoading: attendanceLoading, error: attendanceError, refresh: refreshAttendance, setPresent } =
    useAttendance(dateKey)

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase()
    let list = members
    if (query) {
      list = list.filter((m) => {
        return (
          m.fullName.toLowerCase().includes(query) ||
          (m.phone ?? '').toLowerCase().includes(query)
        )
      })
    }
    if (statusFilter === 'present') {
      list = list.filter((m) => byMemberId.get(m.id)?.present === true)
    } else if (statusFilter === 'absent') {
      list = list.filter((m) => byMemberId.get(m.id)?.present !== true)
    }

    return list.map((m) => {
      const a = byMemberId.get(m.id)
      return {
        id: m.id,
        fullName: m.fullName,
        phone: m.phone ?? '—',
        present: a?.present ?? false,
      }
    })
  }, [members, byMemberId, q, statusFilter])

  const isLoading = membersLoading || attendanceLoading
  const error = membersError || attendanceError

  const stats = useMemo(() => {
    const total = members.length
    let present = 0
    let absent = 0
    for (const m of members) {
      const a = byMemberId.get(m.id)
      if (!a) continue
      if (a.present) present++
      else absent++
    }
    return { total, present, absent }
  }, [members, byMemberId])

  return (
    <div className="space-y-10">
      <div
        className="opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 animate-[dashFadeUp_0.7s_ease-out_forwards]"
        style={{ animationDelay: '40ms' }}
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-200/90">
              <FiCalendar size={18} aria-hidden />
              <span className="text-xs font-semibold uppercase tracking-[0.22em]">Check-ins</span>
            </div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
              Attendance
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-slate-300">
              Pick a date, search the roster, and mark present or absent with the switch—filters help
              you focus on who still needs a status.
            </p>
            <div
              className="h-px max-w-md origin-left rounded-full bg-linear-to-r from-emerald-400/70 via-sky-400/50 to-transparent motion-reduce:animate-none animate-[dashHeroLine_0.9s_ease-out_forwards]"
              style={{ animationDelay: '120ms' }}
              aria-hidden
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="w-full sm:w-[240px]">
              <DatePicker
                label="Date"
                value={dateKey}
                onChange={setDateKey}
                showErrorText={false}
              />
            </div>
            <Button
              variant="secondary"
              onClick={() => void Promise.all([refreshMembers(), refreshAttendance()])}
              disabled={isLoading}
            >
              <FiRefreshCw size={16} />
              Refresh
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

      <div
        className="grid gap-3 sm:grid-cols-3 opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 animate-[dashFadeUp_0.65s_ease-out_forwards] [animation-fill-mode:forwards]"
        style={{ animationDelay: '90ms' }}
      >
        <Card className="p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Total members</p>
          <p className="mt-1 text-2xl font-semibold text-slate-50">
            {stats.total}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Present</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-200">{stats.present}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Absent</p>
          <p className="mt-1 text-2xl font-semibold text-rose-200">{stats.absent}</p>
        </Card>
      </div>

      <Card
        className="p-0 opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 animate-[dashFadeUp_0.65s_ease-out_forwards] [animation-fill-mode:forwards]"
        style={{ animationDelay: '110ms' }}
      >
        <div className="flex flex-col gap-3 border-b border-slate-800/60 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="relative w-full sm:max-w-sm">
              <FiSearch
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name or phone…"
                className="h-11 w-full rounded-xl border border-slate-800/70 bg-slate-950/30 pl-10 pr-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/15"
              />
            </div>
            <div
              className="flex flex-wrap items-center gap-2"
              role="group"
              aria-label="Filter by attendance status"
            >
              {(
                [
                  { id: 'all' as const, label: 'All' },
                  { id: 'present' as const, label: 'Present' },
                  { id: 'absent' as const, label: 'Absent' },
                ] as const
              ).map((opt) => (
                <Button
                  key={opt.id}
                  type="button"
                  size="sm"
                  variant={statusFilter === opt.id ? 'primary' : 'secondary'}
                  onClick={() => setStatusFilter(opt.id)}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="shrink-0 text-sm text-slate-300">
            {isLoading ? 'Loading…' : `${rows.length} member(s)`}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.18em] text-slate-400">
              <tr className="border-b border-slate-800/60">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="text-slate-200">
              {isLoading ? (
                <AttendanceSkeleton />
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-10 text-center">
                    <p className="text-sm font-medium text-slate-100">
                      {members.length === 0
                        ? 'No members found'
                        : 'No members match your filters'}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      {members.length === 0
                        ? 'Add members first, then mark attendance.'
                        : 'Try another search or set the filter to All.'}
                    </p>
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-slate-900/60 hover:bg-slate-950/20"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-100">
                        {r.fullName}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{r.phone}</td>
                    <td className="px-4 py-3">
                      <Switch
                        checked={r.present}
                        onCheckedChange={(next) => void setPresent(r.id, next)}
                        disabled={isLoading}
                        size="sm"
                        showLabels={false}
                        aria-label={r.present ? 'Present' : 'Absent'}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function AttendanceSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, idx) => (
        <tr key={idx} className="border-b border-slate-900/60">
          <td className="px-4 py-3">
            <div className="h-4 w-44 animate-pulse rounded bg-slate-900/70" />
          </td>
          <td className="px-4 py-3">
            <div className="h-4 w-32 animate-pulse rounded bg-slate-900/70" />
          </td>
          <td className="px-4 py-3">
            <div className="ml-auto h-7 w-12 animate-pulse rounded-full bg-slate-900/70" />
          </td>
        </tr>
      ))}
    </>
  )
}

