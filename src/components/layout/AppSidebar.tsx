import { NavLink } from 'react-router-dom'
import { FiBarChart2, FiCalendar, FiCreditCard, FiUsers } from 'react-icons/fi'
import { cn } from '@/lib/utils'

type NavItem = {
  to: string
  label: string
  icon: React.ReactNode
}

const nav: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: <FiBarChart2 size={18} /> },
  { to: '/members', label: 'Members', icon: <FiUsers size={18} /> },
  { to: '/attendance', label: 'Attendance', icon: <FiCalendar size={18} /> },
  { to: '/payments', label: 'Payments', icon: <FiCreditCard size={18} /> },
]

export function AppSidebar({ collapsed }: { collapsed: boolean }) {
  return (
    <aside
      className={cn(
        'hidden h-[calc(100dvh-4rem)] shrink-0 overflow-hidden border-r border-slate-800/60 bg-slate-950/95 p-3 lg:block',
        'transition-[width] duration-300 ease-in-out motion-reduce:transition-none',
        collapsed ? 'w-20' : 'w-72',
      )}
    >
      <nav className="mt-1 grid gap-1">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'group flex min-w-0 items-center rounded-2xl py-2.5 text-sm font-medium transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40 motion-reduce:transition-none',
                collapsed ? 'justify-center px-2' : 'justify-start gap-3 px-3',
                isActive
                  ? 'bg-emerald-400/10 text-emerald-100 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.25)]'
                  : 'text-slate-200 hover:bg-slate-900/40 hover:text-slate-50',
              )
            }
            title={collapsed ? item.label : undefined}
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    'grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-transform duration-200 ease-out motion-reduce:transition-none',
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-100 motion-reduce:animate-none motion-reduce:scale-100 animate-[navIconAlive_2.6s_ease-in-out_infinite]'
                      : 'text-slate-300 group-hover:scale-110 group-hover:text-slate-100',
                  )}
                >
                  {item.icon}
                </span>
                <span
                  className={cn(
                    'min-w-0 overflow-hidden whitespace-nowrap',
                    'transition-[max-width,opacity] duration-300 ease-in-out motion-reduce:transition-none',
                    collapsed
                      ? 'max-w-0 opacity-0'
                      : 'max-w-44 opacity-100',
                  )}
                >
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

