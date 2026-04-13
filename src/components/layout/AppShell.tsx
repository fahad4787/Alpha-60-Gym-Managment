import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AppHeader } from '@/components/layout/AppHeader'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { useAuthUser } from '@/features/auth/hooks/useAuthUser'
import { getAuthInstance } from '@/lib/firebase'
import { cn } from '@/lib/utils'

export function AppShell() {
  const { user } = useAuthUser()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-dvh bg-gym-surface">
      <AppHeader
        user={user}
        onLogout={() => getAuthInstance().signOut()}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed((v) => !v)}
      />

      <div className="flex min-h-[calc(100dvh-4rem)] w-full">
        <AppSidebar collapsed={sidebarCollapsed} />

        <div className="min-w-0 flex-1">
          <main className="w-full px-4 py-8 sm:px-6 lg:px-5">
            <div className={cn('w-full')}>
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

