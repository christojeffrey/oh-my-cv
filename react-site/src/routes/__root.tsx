import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Toaster } from 'sonner'
import { Header } from '@/components/shared/Header'

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-background font-ui flex flex-col">
      <Header />
      <main className="workspace">
        <Outlet />
      </main>
      <Toaster />
      <TanStackRouterDevtools />
    </div>
  ),
})
