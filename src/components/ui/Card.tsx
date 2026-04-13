import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type CardProps = {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export function Card({ children, className, style }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-800/70 bg-slate-950/95 p-6 shadow-[0_20px_70px_-30px_rgba(0,0,0,0.75)]',
        className,
      )}
      style={style}
    >
      {children}
    </div>
  )
}

