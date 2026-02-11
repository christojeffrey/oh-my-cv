import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/components/dashboard/Dashboard";

export const Route = createFileRoute("/")({
  component: () => (
    <div className="dashboard-page h-full">
      <Dashboard />
    </div>
  )
});

// Create a separate landing/marketing route if needed in future
