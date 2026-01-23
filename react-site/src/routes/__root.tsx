import { createRootRoute, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <div>
      Root loaded!
      <Outlet />
    </div>
  ),
})