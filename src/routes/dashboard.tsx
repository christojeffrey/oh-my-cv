// Route for dashboard
import { createFileRoute } from "@tanstack/react-router";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary.tsx";
import { Dashboard } from "@/features/dashboard";

export const Route = createFileRoute("/dashboard")({
    component: () => (
        <div className="h-full">
            <ErrorBoundary>
                <Dashboard />
            </ErrorBoundary>
        </div>
    ),
});
