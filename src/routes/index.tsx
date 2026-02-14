import { createFileRoute } from "@tanstack/react-router";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary.tsx";
import { Dashboard } from "@/features/dashboard";

export const Route = createFileRoute("/")({
  component: () => (
    <div className="h-full">
      <ErrorBoundary>
        <Dashboard />
      </ErrorBoundary>
    </div>
  ),
});

// Create a separate landing/marketing route if needed in future
