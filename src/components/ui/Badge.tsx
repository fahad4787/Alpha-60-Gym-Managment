import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode
  tone?: 'neutral' | 'success' | 'danger'
  className?: string
}) {
  const toneClass =
    tone === 'success'
      ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-100'
      : tone === 'danger'
        ? 'border-rose-400/25 bg-rose-500/10 text-rose-100'
        : 'border-slate-700/50 bg-slate-900/40 text-slate-200'

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium',
        toneClass,
        className,
      )}
    >
      {children}
    </span>
  )
}

