import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthPage } from '@/features/auth/pages/AuthPage'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { useAuthUser } from '@/features/auth/hooks/useAuthUser'
import { AppShell } from '@/components/layout/AppShell'
import { MembersPage } from '@/features/members/pages/MembersPage'
import { AttendancePage } from '@/features/attendance/pages/AttendancePage'
import { PaymentsPage } from '@/features/payments/pages/PaymentsPage'
import { AppLoader } from '@/components/ui/AppLoader'

export function AppRouter() {
  const { user, isLoading } = useAuthUser()

  if (isLoading) {
    return <AppLoader />
  }

  return (
    <Routes>
      <Route
        path="/auth"
        element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />}
      />

      <Route
        element={user ? <AppShell /> : <Navigate to="/auth" replace />}
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/members" element={<MembersPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/payments" element={<PaymentsPage />} />
      </Route>

      <Route
        path="/"
        element={<Navigate to={user ? '/dashboard' : '/auth'} replace />}
      />
      <Route
        path="*"
        element={<Navigate to={user ? '/dashboard' : '/auth'} replace />}
      />
    </Routes>
  )
}

