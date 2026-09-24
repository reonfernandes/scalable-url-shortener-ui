import { lazy, Suspense } from 'react'
import { createBrowserRouter, Outlet } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { AuthLayout } from './components/layout/AuthLayout/AuthLayout'
import { HomeRedirect } from './components/routing/HomeRedirect'
import { RedirectIfAuthenticated } from './components/routing/RedirectIfAuthenticated'
import { Spinner } from './components/ui/Spinner/Spinner'
import { AuthProvider } from './context/AuthProvider'

// Each page is its own chunk, so visitors only download the page they open.
const LoginPage = lazy(() => import('./pages/LoginPage/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage/RegisterPage'))
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
