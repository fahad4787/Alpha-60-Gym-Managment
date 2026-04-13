import { useEffect, useMemo, useRef, useState } from 'react'
import { FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { cn } from '@/lib/utils'

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function toDateOnlyString(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

function fromDateOnlyString(value: string) {
  const [y, m, d] = value.split('-').map((x) => Number(x))
  if (!y || !m || !d) return null
  const date = new Date(y, m - 1, d)
  if (Number.isNaN(date.getTime())) return null
  return date
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

function addMonths(d: Date, delta: number) {
  return new Date(d.getFullYear(), d.getMonth() + delta, 1)
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function fmtLong(d: Date) {
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
}

export function DatePicker({
  label,
  value,
  onChange,
  error,
  placeholder = 'Select date',
  className,
  showErrorText = true,
}: {
  label: string
  value: string
  onChange: (next: string) => void
  error?: string
  placeholder?: string
  className?: string
  showErrorText?: boolean
}) {
  const anchorRef = useRef<HTMLDivElement | null>(null)
  const popoverRef = useRef<HTMLDivElement | null>(null)
  const [open, setOpen] = useState(false)

  const selected = useMemo(() => (value ? fromDateOnlyString(value) : null), [value])
  const [month, setMonth] = useState<Date>(() => startOfMonth(selected ?? new Date()))

  useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    function onPointerDown(e: MouseEvent | TouchEvent) {
      const t = e.target as Node | null
      if (!t) return
      if (popoverRef.current?.contains(t)) return
      if (anchorRef.current?.contains(t)) return
      setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown, { passive: true })
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    setMonth(startOfMonth(selected ?? new Date()))
  }, [open, selected])

  const grid = useMemo(() => {
    const first = startOfMonth(month)
    const firstDow = first.getDay()
    const start = new Date(first)
    start.setDate(first.getDate() - firstDow)
    const days: Date[] = []
    for (let i = 0; i < 42; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      days.push(d)
    }
    return days
  }, [month])

  const monthLabel = useMemo(() => month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }), [month])
  const displayValue = selected ? fmtLong(selected) : ''

  return (
    <div className={cn('grid gap-2 text-left', className)}>
      <label className="text-sm text-slate-200">{label}</label>
      <div ref={anchorRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            'h-11 w-full rounded-xl border bg-slate-950/30 px-3 text-left text-sm outline-none transition',
            error
              ? 'border-rose-400/70 text-slate-100 focus:ring-2 focus:ring-rose-400/30'
              : 'border-slate-800/70 text-slate-100 focus:border-emerald-400/60 focus:ring-2 focus:ring-emerald-400/15',
          )}
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          <span className={cn(displayValue ? 'text-slate-100' : 'text-slate-500')}>
            {displayValue || placeholder}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-300">
            <FiCalendar size={16} aria-hidden="true" />
          </span>
        </button>

        {open ? (
          <div
            ref={popoverRef}
            role="dialog"
            aria-label="Choose date"
            className="absolute left-0 right-0 top-full z-40 mt-2 rounded-2xl border border-slate-800/70 bg-slate-950 p-3 shadow-[0_40px_120px_-70px_rgba(0,0,0,0.95)]"
          >
            <div className="flex items-center justify-between gap-3 px-1 pb-2">
              <button
                type="button"
                onClick={() => setMonth((m) => addMonths(m, -1))}
                className="grid h-9 w-9 place-items-center rounded-xl border border-slate-800/70 bg-slate-950/30 text-slate-100 hover:bg-slate-900/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
                aria-label="Previous month"
              >
                <FiChevronLeft size={16} />
              </button>
              <div className="min-w-0 px-1 text-sm font-semibold text-slate-50">
                {monthLabel}
              </div>
              <button
                type="button"
                onClick={() => setMonth((m) => addMonths(m, 1))}
                className="grid h-9 w-9 place-items-center rounded-xl border border-slate-800/70 bg-slate-950/30 text-slate-100 hover:bg-slate-900/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
                aria-label="Next month"
              >
                <FiChevronRight size={16} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 px-1 pb-2 text-xs uppercase tracking-[0.18em] text-slate-400">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="px-1 py-1 text-center">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 px-1">
              {grid.map((d) => {
                const inMonth = d.getMonth() === month.getMonth()
                const isSelected = selected ? isSameDay(d, selected) : false
                return (
                  <button
                    key={d.toISOString()}
                    type="button"
                    onClick={() => {
                      onChange(toDateOnlyString(d))
                      setOpen(false)
                    }}
                    className={cn(
                      'h-9 rounded-xl text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50',
                      inMonth ? 'text-slate-100' : 'text-slate-500',
                      isSelected
                        ? 'bg-emerald-500/15 text-emerald-100 ring-1 ring-emerald-400/40'
                        : 'hover:bg-slate-900/50',
                    )}
                    aria-pressed={isSelected}
                  >
                    {d.getDate()}
                  </button>
                )
              })}
            </div>
          </div>
        ) : null}
      </div>
      {error && showErrorText ? <p className="text-xs text-rose-300">{error}</p> : null}
    </div>
  )
}

