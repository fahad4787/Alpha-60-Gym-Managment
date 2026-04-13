import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  FiArrowRight,
  FiBarChart2,
  FiCalendar,
  FiCreditCard,
  FiUsers,
} from 'react-icons/fi'
import { Card } from '@/components/ui/Card'
import { useAuthUser } from '@/features/auth/hooks/useAuthUser'
import { useMembers } from '@/features/members/hooks/useMembers'
import { useAttendance } from '@/features/attendance/hooks/useAttendance'
import { usePayments } from '@/features/payments/hooks/usePayments'
import { cn } from '@/lib/utils'

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function todayDateKey() {
  const d = new Date()
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

function currentMonthKey() {
  const d = new Date()
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`
}

function formatPkr(amount: number) {
  const value = Number.isFinite(amount) ? Math.round(amount) : 0
  return `PKR ${value.toLocaleString('en-PK')}`
}

type StatTone = 'slate' | 'emerald' | 'violet' | 'sky'

type StatItem = {
  id: string
  to: string
  label: string
  value: string
  hint: string
  tone: StatTone
}

const QUICK_LINKS = [
  {
    id: 'members',
    to: '/members',
    title: 'Members',
    description: 'Roster, programs, fees, and notes.',
    icon: FiUsers,
  },
  {
    id: 'attendance',
    to: '/attendance',
    title: 'Attendance',
    description: 'Daily present / absent by date.',
    icon: FiCalendar,
  },
  {
    id: 'payments',
    to: '/payments',
    title: 'Payments',
    description: 'Monthly paid vs unpaid status.',
    icon: FiCreditCard,
  },
] as const

const toneRing: Record<StatTone, string> = {
  slate: 'hover:border-slate-600/90 focus-visible:ring-slate-400/30',
  emerald: 'hover:border-emerald-500/40 focus-visible:ring-emerald-400/35',
  violet: 'hover:border-violet-500/40 focus-visible:ring-violet-400/35',
  sky: 'hover:border-sky-500/40 focus-visible:ring-sky-400/35',
}

const toneAccent: Record<StatTone, string> = {
  slate: 'text-slate-300',
  emerald: 'text-emerald-200',
  violet: 'text-violet-200',
  sky: 'text-sky-200',
}

export function DashboardPage() {
  const { user } = useAuthUser()
  const { items: members, isLoading: membersLoading, error: membersError } = useMembers()
  const { byMemberId: attById, isLoading: attLoading, error: attError } = useAttendance(todayDateKey())
  const { byMemberId: payById, isLoading: payLoading, error: payError } = usePayments(currentMonthKey())

  const isLoading = membersLoading || attLoading || payLoading
  const loadError = membersError || attError || payError

  const aggregates = useMemo(() => {
    const n = members.length
    let presentToday = 0
    let monthPaid = 0
    let monthlyDues = 0
    for (const m of members) {
      if (attById.get(m.id)?.present === true) presentToday++
      if (payById.get(m.id)?.paid === true) monthPaid++
      if (typeof m.fees === 'number' && Number.isFinite(m.fees)) monthlyDues += m.fees
    }
    const monthUnpaid = Math.max(0, n - monthPaid)
    const notPresentToday = Math.max(0, n - presentToday)
    return { n, presentToday, monthPaid, monthUnpaid, monthlyDues, notPresentToday }
  }, [members, attById, payById])

  const statItems: StatItem[] = useMemo(() => {
    const { n, presentToday, monthPaid, monthUnpaid, monthlyDues, notPresentToday } = aggregates
    return [
      {
        id: 'members',
        to: '/members',
        label: 'Total members',
        value: String(n),
        hint: n === 0 ? 'Add your first member to get started.' : `${n} member${n === 1 ? '' : 's'} on file.`,
        tone: 'slate',
      },
      {
        id: 'today',
        to: '/attendance',
        label: 'Present today',
        value: n === 0 ? '—' : `${presentToday} / ${n}`,
        hint:
          n === 0
            ? 'Open attendance after you add members.'
            : notPresentToday === 0
              ? 'Everyone marked present for today.'
              : `${notPresentToday} not marked present yet.`,
        tone: 'emerald',
      },
      {
        id: 'month-pay',
        to: '/payments',
        label: 'Paid this month',
        value: n === 0 ? '—' : `${monthPaid} / ${n}`,
        hint:
          n === 0
            ? 'Track fees once members exist.'
            : monthUnpaid === 0
              ? 'All members marked paid for this month.'
              : `${monthUnpaid} unpaid this month.`,
        tone: 'violet',
      },
      {
        id: 'dues',
        to: '/members',
        label: 'Monthly dues (PKR)',
        value: monthlyDues > 0 ? formatPkr(monthlyDues) : '—',
        hint:
          monthlyDues > 0
            ? 'Total of fee amounts across members.'
            : 'Set fees on member profiles to see a total.',
        tone: 'sky',
      },
    ]
  }, [aggregates])

  return (
    <div className="space-y-10">
      <div
        className="opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 animate-[dashFadeUp_0.7s_ease-out_forwards]"
        style={{ animationDelay: '40ms' }}
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-200/90">
              <FiBarChart2 size={18} aria-hidden />
              <span className="text-xs font-semibold uppercase tracking-[0.22em]">Overview</span>
            </div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
              Dashboard
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-slate-300">
              Signed in as{' '}
              <span className="font-medium text-slate-100">{user?.email ?? '—'}</span>
              . Metrics below refresh from your live members, today&apos;s attendance, and this
              month&apos;s payments.
            </p>
            <div
              className="h-px max-w-md origin-left rounded-full bg-linear-to-r from-emerald-400/70 via-sky-400/50 to-transparent motion-reduce:animate-none animate-[dashHeroLine_0.9s_ease-out_forwards]"
              style={{ animationDelay: '120ms' }}
              aria-hidden
            />
          </div>
        </div>
      </div>

      {loadError ? (
        <div
          className="rounded-xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-100 opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 animate-[dashFadeUp_0.55s_ease-out_forwards] [animation-fill-mode:forwards]"
          style={{ animationDelay: '80ms' }}
        >
          {loadError}
        </div>
      ) : null}

      <section aria-label="Key metrics">
        <h2 className="sr-only">Key metrics</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, idx) => (
                <Card
                  key={idx}
                  className="p-5 opacity-0 motion-reduce:animate-none motion-reduce:opacity-100 animate-[dashFadeUp_0.5s_ease-out_forwards]"
                  style={{ animationDelay: `${60 + idx * 70}ms` }}
                >
                  <div className="h-3 w-24 animate-pulse rounded bg-slate-800/80" />
                  <div className="mt-4 h-9 w-20 animate-pulse rounded bg-slate-800/70" />
                  <div className="mt-3 h-10 w-full animate-pulse rounded-lg bg-slate-900/70" />
                </Card>
              ))
            : statItems.map((item, idx) => (
                <Link
                  key={item.id}
                  to={item.to}
                  className={cn(
                    'group block rounded-2xl outline-none transition duration-300 focus-visible:ring-2',
                    toneRing[item.tone],
                  )}
                >
                  <Card
                    className={cn(
                      'h-full p-5 opacity-0 transition duration-300 motion-reduce:animate-none motion-reduce:opacity-100 group-hover:bg-slate-950/55 group-hover:shadow-[0_18px_48px_-28px_rgba(16,185,129,0.22)] animate-[dashFadeUp_0.65s_ease-out_forwards]',
                    )}
                    style={{ animationDelay: `${100 + idx * 85}ms` }}
                  >
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                      {item.label}
                    </p>
                    <p
                      className={cn(
                        'mt-3 font-semibold tracking-tight text-slate-50',
                        item.value === '—' ? 'text-2xl' : 'text-2xl sm:text-3xl',
                        toneAccent[item.tone],
                      )}
                    >
                      {item.value}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.hint}</p>
                    <p className="mt-4 flex items-center gap-1 text-xs font-medium text-emerald-200/90 opacity-0 transition group-hover:opacity-100">
                      Open
                      <FiArrowRight size={14} className="transition group-hover:translate-x-0.5" />
                    </p>
                  </Card>
                </Link>
              ))}
        </div>
      </section>

      <section aria-label="Shortcuts">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
          Shortcuts
        </h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {QUICK_LINKS.map((item, idx) => {
            const Icon = item.icon
            return (
              <Link
                key={item.id}
                to={item.to}
                className="group block rounded-2xl outline-none transition focus-visible:ring-2 focus-visible:ring-emerald-400/40"
              >
                <Card
                  className={cn(
                    'flex h-full gap-4 p-5 opacity-0 transition duration-300 motion-reduce:animate-none motion-reduce:opacity-100 hover:border-emerald-500/30 hover:bg-slate-950/50 animate-[dashFadeUp_0.65s_ease-out_forwards]',
                  )}
                  style={{ animationDelay: `${280 + idx * 75}ms` }}
                >
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-slate-800/70 bg-slate-900/50 text-slate-200 transition group-hover:border-emerald-500/35 group-hover:text-emerald-100">
                    <Icon size={20} aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-slate-100">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-400">{item.description}</p>
                    <p className="mt-3 flex items-center gap-1 text-xs font-medium text-emerald-200/90">
                      Go
                      <FiArrowRight size={14} className="transition group-hover:translate-x-0.5" />
                    </p>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
