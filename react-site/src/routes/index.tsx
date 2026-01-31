import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/components/dashboard/Dashboard";

export const Route = createFileRoute("/")({
  component: Dashboard
});

// Create a separate landing/marketing route if needed in future
