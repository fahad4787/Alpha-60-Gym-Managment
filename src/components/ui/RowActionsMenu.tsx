import type { ReactNode } from 'react'
import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FiMoreVertical } from 'react-icons/fi'
import { cn } from '@/lib/utils'

type Item = {
  id: string
  label: string
  icon?: ReactNode
  tone?: 'default' | 'danger'
  onSelect: () => void
}

export function RowActionsMenu({
  items,
  align = 'right',
  compact = true,
}: {
  items: Item[]
  align?: 'left' | 'right'
  compact?: boolean
}) {
  const menuId = useId()
  const anchorRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const [open, setOpen] = useState(false)
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    if (!open) return
    const rect = buttonRef.current?.getBoundingClientRect() ?? null
    setAnchorRect(rect)
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    function onPointerDown(e: MouseEvent | TouchEvent) {
      const t = e.target as Node | null
      if (!t) return
      if (menuRef.current?.contains(t)) return
      if (anchorRef.current?.contains(t)) return
      setOpen(false)
    }
    function onReposition() {
      const rect = buttonRef.current?.getBoundingClientRect() ?? null
      setAnchorRect(rect)
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown, { passive: true })
    window.addEventListener('resize', onReposition)
    window.addEventListener('scroll', onReposition, true)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
      window.removeEventListener('resize', onReposition)
      window.removeEventListener('scroll', onReposition, true)
    }
  }, [open])

  const placement = useMemo(() => {
    if (!anchorRect) return null
    const menuH = 220
    const margin = 10
    const spaceBelow = window.innerHeight - anchorRect.bottom
    const openUp = spaceBelow < menuH + margin
    const top = openUp ? Math.max(margin, anchorRect.top - margin) : anchorRect.bottom + 8
    return { openUp, top }
  }, [anchorRect])

  return (
    <div ref={anchorRef} className="relative flex justify-end">
      <button
        type="button"
        ref={buttonRef}
        className={cn(
          'inline-flex h-9 items-center gap-2 rounded-xl border border-slate-800/70 bg-slate-950/30 px-3 text-sm font-medium text-slate-100 hover:bg-slate-900/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50',
          compact ? 'px-2' : undefined,
        )}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
      >
        <FiMoreVertical size={16} aria-hidden="true" />
      </button>

      {open && anchorRect && placement
        ? createPortal(
            <div
              ref={menuRef}
              id={menuId}
              role="menu"
              style={{
                position: 'fixed',
                zIndex: 1000,
                top: placement.openUp ? undefined : placement.top,
                bottom: placement.openUp ? window.innerHeight - anchorRect.top + 8 : undefined,
                left: align === 'left' ? anchorRect.left : undefined,
                right: align === 'right' ? window.innerWidth - anchorRect.right : undefined,
                minWidth: 176,
              }}
              className="rounded-2xl border border-slate-800/70 bg-slate-950 p-1 shadow-[0_40px_120px_-70px_rgba(0,0,0,0.95)]"
            >
              {items.map((it) => (
                <button
                  key={it.id}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    it.onSelect()
                    setOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition hover:bg-slate-900/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40',
                    it.tone === 'danger' ? 'text-rose-100' : 'text-slate-100',
                  )}
                >
                  {it.icon ? <span className="text-slate-300">{it.icon}</span> : null}
                  {it.label}
                </button>
              ))}
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}
