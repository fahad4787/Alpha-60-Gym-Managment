import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { FiX } from 'react-icons/fi'
import { cn } from '@/lib/utils'

export function Modal({
  open,
  title,
  children,
  onClose,
  footer,
  className,
}: {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
  footer?: ReactNode
  className?: string
}) {
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-black/70"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative mx-auto flex min-h-dvh max-w-xl items-center px-4 py-10">
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className={cn(
            'w-full rounded-2xl border border-slate-800/70 bg-slate-950 shadow-[0_40px_120px_-70px_rgba(0,0,0,0.95)]',
            'animate-[modalIn_180ms_ease-out]',
            className,
          )}
        >
          <div className="flex items-center justify-between gap-4 border-b border-slate-800/60 px-5 py-4">
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-slate-50">
                {title}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-xl border border-slate-800/70 bg-slate-950/30 text-slate-100 hover:bg-slate-900/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
              aria-label="Close modal"
            >
              <FiX size={18} />
            </button>
          </div>
          <div className="px-5 py-5">{children}</div>
          {footer ? (
            <div className="border-t border-slate-800/60 px-5 py-4">
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
  )
}

