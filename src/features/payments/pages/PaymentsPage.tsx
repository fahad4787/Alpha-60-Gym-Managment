import { useMemo, useState } from 'react'
import { FiCreditCard, FiRefreshCw, FiSearch } from 'react-icons/fi'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { DatePicker } from '@/components/ui/DatePicker'
import { Switch } from '@/components/ui/Switch'
import { useMembers } from '@/features/members/hooks/useMembers'
import { usePayments } from '@/features/payments/hooks/usePayments'

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function currentMonthKey() {
  const d = new Date()
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`
}

type PayFilter = 'all' | 'paid' | 'unpaid'

export function PaymentsPage() {
  const [monthKey, setMonthKey] = useState(currentMonthKey())
  const [q, setQ] = useState('')
  const [payFilter, setPayFilter] = useState<PayFilter>('all')
  const { items: members, isLoading: membersLoading, error: membersError, refresh: refreshMembers } = useMembers()
  const { byMemberId, isLoading: paymentsLoading, error: paymentsError, refresh: refreshPayments, setPaid } =
    usePayments(monthKey)

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
    if (payFilter === 'paid') {
      list = list.filter((m) => byMemberId.get(m.id)?.paid === true)
    } else if (payFilter === 'unpaid') {
      list = list.filter((m) => byMemberId.get(m.id)?.paid !== true)
    }

    return list.map((m) => {
      const p = byMemberId.get(m.id)
      return {
        id: m.id,
        fullName: m.fullName,
        phone: m.phone ?? '—',
        fees: m.fees,
        paid: p?.paid ?? false,
      }
    })
  }, [members, byMemberId, q, payFilter])

  const isLoading = membersLoading || paymentsLoading
  const error = membersError || paymentsError

  const stats = useMemo(() => {
    const total = members.length
    let paid = 0
    for (const m of members) {
      if (byMemberId.get(m.id)?.paid === true) paid++
    }
    const unpaid = Math.max(0, total - paid)
    return { total, paid, unpaid }
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
              <FiCreditCard size={18} aria-hidden />
              <span className="text-xs font-semibold uppercase tracking-[0.22em]">Billing</span>
            </div>
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
              Payments
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-slate-300">
              Choose a month, see each member&apos;s PKR fee, and toggle paid or unpaid—search and
              filters narrow the list to who still owes.
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
                label="Month"
                value={`${monthKey}-01`}
                onChange={(v) => setMonthKey(v.slice(0, 7))}
                showErrorText={false}
              />
            </div>
            <Button
              variant="secondary"
              onClick={() => void Promise.all([refreshMembers(), refreshPayments()])}
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
          <p className="mt-1 text-2xl font-semibold text-slate-50">{stats.total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Paid</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-200">{stats.paid}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Unpaid</p>
          <p className="mt-1 text-2xl font-semibold text-rose-200">{stats.unpaid}</p>
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
              aria-label="Filter by payment status"
            >
              {(
                [
                  { id: 'all' as const, label: 'All' },
                  { id: 'paid' as const, label: 'Paid' },
                  { id: 'unpaid' as const, label: 'Unpaid' },
                ] as const
              ).map((opt) => (
                <Button
                  key={opt.id}
                  type="button"
                  size="sm"
                  variant={payFilter === opt.id ? 'primary' : 'secondary'}
                  onClick={() => setPayFilter(opt.id)}
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
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.18em] text-slate-400">
              <tr className="border-b border-slate-800/60">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Fees</th>
                <th className="px-4 py-3 font-medium text-right">Payment</th>
              </tr>
            </thead>
            <tbody className="text-slate-200">
              {isLoading ? (
                <PaymentsSkeleton />
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center">
                    <p className="text-sm font-medium text-slate-100">
                      {members.length === 0
                        ? 'No members found'
                        : 'No members match your filters'}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      {members.length === 0
                        ? 'Add members first, then mark payment status.'
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
                    <td className="px-4 py-3 text-slate-300">
                      {typeof r.fees === 'number' ? formatPkr(r.fees) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <Switch
                        checked={r.paid}
                        onCheckedChange={(next) => void setPaid(r.id, next)}
                        disabled={isLoading}
                        size="sm"
                        showLabels={false}
                        aria-label={r.paid ? 'Paid' : 'Unpaid'}
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

function formatPkr(amount: number) {
  const value = Number.isFinite(amount) ? Math.round(amount) : 0
  return `PKR ${value.toLocaleString('en-PK')}`
}

function PaymentsSkeleton() {
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
            <div className="h-4 w-24 animate-pulse rounded bg-slate-900/70" />
          </td>
          <td className="px-4 py-3">
            <div className="ml-auto h-7 w-12 animate-pulse rounded-full bg-slate-900/70" />
          </td>
        </tr>
      ))}
    </>
  )
}
