import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import { createFileRoute } from "@tanstack/react-router";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary.tsx";
import { Dashboard } from "@/features/dashboard";

export const Route = createFileRoute("/dashboard")({
  component: DashboardComponent,
});

function DashboardComponent() {
  return (
    <ErrorBoundary>
      <SignedIn>
        <Dashboard />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </ErrorBoundary>
  );
}
