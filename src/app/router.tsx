import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '@shared/layouts/AppLayout'
import { useAuthStore } from '@features/auth/store/authStore'

const LoginPage = lazy(() => import('@features/auth/components/LoginPage').then(m => ({ default: m.LoginPage })))
const DashboardPage = lazy(() => import('@features/dashboard/components/DashboardPage').then(m => ({ default: m.DashboardPage })))
const ProposalPage = lazy(() => import('@features/proposal-builder/components/ProposalPage').then(m => ({ default: m.ProposalPage })))
const CrmPage = lazy(() => import('@features/crm/components/CrmPage').then(m => ({ default: m.CrmPage })))
const AnalyticsPage = lazy(() => import('@features/analytics/components/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })))
const RealtimePage = lazy(() => import('@features/realtime-tracking/components/RealtimePage').then(m => ({ default: m.RealtimePage })))

function Loading() {
  return (
    <div className="flex items-center justify-center h-full min-h-[200px]">
      <div className="w-5 h-5 border-2 border-border border-t-[#e84d3d] rounded-full animate-spin" />
    </div>
  )
}

function ProtectedLayout() {
  const { user } = useAuthStore()
  if (!user) return <Navigate to="/login" replace />
  return <AppLayout />
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Suspense fallback={<Loading />}><LoginPage /></Suspense>,
  },
  {
    path: '/',
    element: <ProtectedLayout />,
    children: [
      { index: true, element: <Suspense fallback={<Loading />}><DashboardPage /></Suspense> },
      { path: 'proposals', element: <Suspense fallback={<Loading />}><ProposalPage /></Suspense> },
      { path: 'crm', element: <Suspense fallback={<Loading />}><CrmPage /></Suspense> },
      { path: 'analytics', element: <Suspense fallback={<Loading />}><AnalyticsPage /></Suspense> },
      { path: 'realtime', element: <Suspense fallback={<Loading />}><RealtimePage /></Suspense> },
      { path: 'notifications', element: <Suspense fallback={<Loading />}><DashboardPage /></Suspense> },
      { path: 'admin', element: <Suspense fallback={<Loading />}><DashboardPage /></Suspense> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
