import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/components/dashboard/Dashboard.tsx";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary.tsx";

export const Route = createFileRoute("/")({
  component: () => (
    <div className="dashboard-page h-full">
      <ErrorBoundary>
        <Dashboard />
      </ErrorBoundary>
    </div>
  ),
});

// Create a separate landing/marketing route if needed in future
