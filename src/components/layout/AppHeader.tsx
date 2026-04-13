import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { User } from 'firebase/auth'
import { FiAlignLeft, FiChevronDown, FiLogOut } from 'react-icons/fi'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { BrandMark } from '@/components/brand/BrandMark'
import { BRAND_NAME } from '@/config/brand'

type AppHeaderProps = {
  user: User | null
  onLogout: () => void
  onToggleSidebar?: () => void
  sidebarCollapsed?: boolean
}

export function AppHeader({ user, onLogout, onToggleSidebar }: AppHeaderProps) {
  const triggerId = useId()
  const menuId = `${triggerId}-menu`
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const name = useMemo(() => {
    return (
      user?.displayName?.trim() ||
      user?.email?.split('@')[0] ||
      'Owner'
    )
  }, [user?.displayName, user?.email])

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      const el = containerRef.current
      if (!el) return
      if (el.contains(e.target as Node)) return
      setOpen(false)
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-950/95">
      <div className="flex h-16 w-full items-center justify-between px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className={cn(
              'grid h-10 w-10 shrink-0 place-items-center rounded-2xl border text-slate-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50',
              'border-slate-800/70 bg-slate-950/30 hover:bg-slate-950/50',
              onToggleSidebar ? undefined : 'pointer-events-none opacity-0',
            )}
            aria-label="Toggle sidebar"
          >
            <FiAlignLeft size={18} />
          </button>
          <BrandMark size="lg" />
          <div className="min-w-0 leading-tight">
            <p className="truncate text-pretty bg-linear-to-r from-emerald-200 via-slate-50 to-sky-200 bg-clip-text text-base font-semibold tracking-tight text-transparent">
              {BRAND_NAME}
            </p>
            <p className="text-xs text-slate-400">Owner dashboard</p>
          </div>
        </div>

        <div ref={containerRef} className="relative">
          <button
            id={triggerId}
            type="button"
            aria-haspopup="menu"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((v) => !v)}
            className={cn(
              'flex items-center gap-2 rounded-2xl border px-3 py-2 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50',
              open
                ? 'border-emerald-400/35 bg-slate-950/50'
                : 'border-slate-800/70 bg-slate-950/30 hover:bg-slate-950/50',
            )}
          >
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900/60 text-sm font-semibold text-slate-100 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.12)]">
              {name.slice(0, 1).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <p className="max-w-[180px] truncate text-sm font-medium text-slate-100">
                {name}
              </p>
              <p className="max-w-[220px] truncate text-xs text-slate-400">
                {user?.email ?? ''}
              </p>
            </div>
            <FiChevronDown
              className={cn(
                'ml-1 text-slate-300 transition-transform',
                open ? 'rotate-180' : 'rotate-0',
              )}
              size={16}
              aria-hidden="true"
            />
          </button>

          {open ? (
            <div
              id={menuId}
              role="menu"
              aria-labelledby={triggerId}
              className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-950 shadow-[0_30px_90px_-50px_rgba(0,0,0,0.9)]"
            >
              <div className="px-4 py-3">
                <p className="text-xs text-slate-400">Signed in as</p>
                <p className="truncate text-sm font-medium text-slate-100">
                  {user?.email ?? '—'}
                </p>
              </div>
              <div className="h-px bg-slate-800/70" />
              <div className="p-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="h-10 w-full justify-start gap-2 rounded-xl px-3 text-slate-100 hover:bg-slate-900/50"
                  onClick={() => {
                    setOpen(false)
                    onLogout()
                  }}
                >
                  <FiLogOut size={16} className="text-slate-300" />
                  Logout
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}

