import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Toaster } from "sonner";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary.tsx";
import { Header } from "@/components/shared/Header.tsx";

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-background font-ui flex flex-col">
      <Header />
      <main className="workspace">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Toaster />
      <TanStackRouterDevtools />
    </div>
  ),
});
