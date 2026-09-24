import { lazy, Suspense } from 'react'
import { createBrowserRouter, Outlet } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { AppLayout } from './components/layout/AppLayout/AppLayout'
import { AuthLayout } from './components/layout/AuthLayout/AuthLayout'
import { HomeRedirect } from './components/routing/HomeRedirect'
import { RedirectIfAuthenticated } from './components/routing/RedirectIfAuthenticated'
import { RequireAuth } from './components/routing/RequireAuth'
import { Spinner } from './components/ui/Spinner/Spinner'
import { AuthProvider } from './context/AuthProvider'

// Each page is its own chunk, so visitors only download the page they open.
const LoginPage = lazy(() => import('./pages/LoginPage/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage/RegisterPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage/DashboardPage'))
const LinkStatsPage = lazy(() => import('./pages/LinkStatsPage/LinkStatsPage'))
const UnlockPage = lazy(() => import('./pages/UnlockPage/UnlockPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage/NotFoundPage'))

function RootLayout() {
  return (
    <Suspense fallback={<Spinner fullPage />}>
      <Outlet />
    </Suspense>
  )
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <HomeRedirect /> },
      {
        // Public pages; logged-in users are sent to the dashboard.
        element: <RedirectIfAuthenticated />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              { path: 'login', element: <LoginPage /> },
              { path: 'register', element: <RegisterPage /> },
            ],
          },
        ],
      },
      {
        // Pages that need a login.
        element: <RequireAuth />,
        children: [
          {
            element: <AppLayout />,
            children: [
              { path: 'dashboard', element: <DashboardPage /> },
              { path: 'links/:shortCode', element: <LinkStatsPage /> },
            ],
          },
        ],
      },
      // Public: a visitor opening a password-protected link.
      { path: 'unlock/:shortCode', element: <UnlockPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}
